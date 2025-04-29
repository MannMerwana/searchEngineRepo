const fs = require("fs")
const path = require("path")
const natural = require("natural")
const stopword = require("stopword")

// embedding size
const EMBEDDINNG_DIM = 100

// load GloVe vectors 
const glovePath = "F:/Study/Learnings/Conqt/searchEngineRepo/backend/utils/embeddings/glove.6B.100d.txt";
const gloveVectors = {}

console.log("Loading GloVe embeddings...");
const lines = fs.readFileSync(glovePath, "utf8").split("\n")

for (const line of lines) {
    const [word, ...values] = line.trim().split(" ")
    if (word && values.length === EMBEDDINNG_DIM) {
        gloveVectors[word] = values.map(Number)
    }
}

console.log("GloVe embeddings loaded");

// normalize vector to unit length
function normalize(vec) {
    const magnitude = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0))
    return vec.map((val) => (magnitude ? val / magnitude : 0))
}

// main function
function generateEmbedding(text) {
    const tokenizer = new natural.WordTokenizer()
    const tokens = tokenizer.tokenize(text.toLowerCase())
    const filteredTokens = stopword.removeStopwords(tokens)

    const tfidf = new natural.TfIdf()
    tfidf.addDocument(filteredTokens.join(" "))

    const scores = {}
    tfidf.listTerms(0).forEach(({ term, tfidf }) => {
        scores[term] = tfidf
    })

    const vector = new Array(EMBEDDINNG_DIM).fill(0)
    let weightSum = 0

    for (const word of filteredTokens) {
        const wordVec = gloveVectors[word]
        const weight = scores[word]

        if (wordVec && weight > 0) {
            for (let i = 0; i < EMBEDDINNG_DIM; i++) {
                vector[i] += wordVec[i] * weight
            }
            weightSum += weight
        }
    }
    if (weightSum === 0) return Array(EMBEDDINNG_DIM).fill(0)
    return normalize(vector.map((val) => val / (weightSum)))
}

module.exports = { generateEmbedding }