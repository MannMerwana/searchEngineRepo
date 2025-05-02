const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const { generateEmbedding } = require("./utils/embedder")
const mongoose = require("mongoose")
const Document = require("./models/Document")

const app = express()
const port = 5000;

// mongodb connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log("MongoDB Connection Error", error))

app.use(cors())
app.use(bodyParser.json({ limit: '10mb' }))

// endpoint to handle the metadata embedding
app.post("/generate-embedding", async (req, res) => {
    try {
        const { id, textContent, file_name, title, file_url, uploaded_at } = req.body

        if (!textContent) {
            return res.status(400).json({ error: "textContent is required" })
        }

        console.log(`Generating embedding for: ${file_name}`);
        const embedding = generateEmbedding(textContent)

        console.log("Generated embedding vector: ", embedding);

        // save to db
        const document = new Document({
            id,
            file_name,
            file_url,
            uploaded_at,
            embedding,
        })

        await document.save()

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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})
