const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const mysql = require("mysql2")

const app = express()
const port = 5000;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "yashsql",
    database: "file_metadata"
})

db.connect((err) => {
    if (err) throw err
    console.log("Connected to MySQL Database");
})

app.use(cors())
app.use(bodyParser.json())

// endpoint to handle the metadata storage
app.post("/save-metadata", (req, res) => {
    const { id, file_name, title, file_url, text_content, uploaded_at } = req.body
    const fileUrlString = file_url.publicUrl // so that the value can be inserted in the table
    console.log("Incoming metadata:", req.body);
    const query = `INSERT INTO metadata (id, file_name, title, file_url, text_content, uploaded_at) VALUES (?,?,?,?,?,?)`

    db.query(
        query,
        [id, file_name, title, fileUrlString, text_content, uploaded_at],
        (err, result) => {
            if (err) {
                console.error("Error inserting data:", err)
                return res.status(500).send("Error inserting metadata")
            }
            res.status(200).send("Metadata saved Successfully!")
        }
    )
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})
