const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const { generateEmbedding } = require("./utils/embedder")

const app = express()
const port = 5000;

app.use(cors())
app.use(bodyParser.json())

// endpoint to handle the metadata embedding
app.post("/generate-embedding", async (req, res) => {
    try {
        const { textContent, file_name, title, file_url, uploaded_at } = req.body

        if (!textContent) {
            return res.status(400).json({ error: "textContent is required" })
        }

        console.log(`Generating embedding for: ${file_name}`);
        const embedding = generateEmbedding(textContent)

        console.log("Generated embedding vector: ", embedding);

        res.json({
            message: "Embedding generated successfully",
            embedding,
            file_name,
            file_url,
            uploaded_at,
        })
    } catch (error) {
        console.error("Error generating embedding:", error);
        res.status(500).json({ error: "Internal server error" })
    }
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})
