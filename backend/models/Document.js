const mongoose = require("mongoose")

const documentSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    file_name: String,
    file_url: String,
    uploaded_at: String,
    embedding: [Number],
})

module.exports = mongoose.model("Document", documentSchema)