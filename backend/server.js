const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const { generateEmbedding } = require("./utils/embedder")
const mongoose = require("mongoose")
const Document = require("./models/Document")
const computeCosineSimilarity = require("compute-cosine-similarity")

const app = express()
const port = 5000;

// mongodb connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log("MongoDB Connection Error", error))

app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }))

// endpoint to handle the metadata embedding
app.post("/generate-embedding", async (req, res) => {
    try {
        const { id, textContent, file_name, file_url, uploaded_at } = req.body

        if (!textContent) {
            return res.status(400).json({ error: "textContent is required" })
        }

        console.log(`Generating embedding for: ${file_name}`);
        const embedding = generateEmbedding(textContent)

        console.log("Generated embedding vector: ", embedding);

        const snippet = textContent.slice(0, 100)

        // save to db
        const document = new Document({
            id,
            file_name,
            file_url,
            uploaded_at,
            snippet,
            embedding,
        })

        await document.save()
        console.log("Metadata saved to DB");

        res.json({
            message: "Embedding generated successfully",
            id,
            file_name,
            file_url,
            uploaded_at,
            embedding,
        })
    } catch (error) {
        console.error("Error generating embedding:", error);
        res.status(500).json({ error: "Internal server error" })
    }
})

// endpoint for query embedding and search
app.post("/search", async (req, res) => {
    try {
        const { query } = req.body
        console.log("Query: ", query);

        if (!query) {
            return res.status(400).json({ error: "Query is required" })
        }

        const queryEmbedding = generateEmbedding(query)
        console.log("Generated Query vector: ", queryEmbedding);

        //All docs from db
        const documents = await Document.find()

        //cosine similarity for each doc
        const results = documents &&
            documents.map((document) => {
                const similarity = computeCosineSimilarity(queryEmbedding, document.embedding)

                const docWithoutEmbedding = { ...document._doc } //metadata from the db
                delete docWithoutEmbedding.embedding

                return {
                    ...docWithoutEmbedding,
                    similarityScore: similarity
                }
            })

        results.sort((a, b) => b.similarityScore - a.similarityScore) // descending order

        res.json({
            query,
            topResults: results.slice(0, 3), // top 3
        })
    } catch (error) {
        console.error("Search Error:", error)
        res.status(500).json({ error: "Internal server error" })
    }
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})
