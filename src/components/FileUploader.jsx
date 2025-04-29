import { useState } from "react";
import { supabase } from "../supabaseClient";
import axios from "axios";

const FileUploader = () => {

    const [file, setFile] = useState(null) // for input file
    const [uploading, setuploading] = useState(false) // to keep the note that uploading is on going
    const [uploadedUrl, setUploadedUrl] = useState("")
    const handleUpload = async (e) => {
        e.preventDefault() // to stop automatic refresh
        if (!file) {
            alert("Please select a file first!")
            return
        }

        //check the file format
        const allowedExtensions = ["pdf", "docx", "xlsx", "xls"]
        const fileExtension = file.name.split(".").pop().toLowerCase()
        if(!allowedExtensions.includes(fileExtension)) {
            alert("Invalid file type, Only PDF, DOCX & Excel files are allowed.")
            return
        }

        setuploading(true)
        const filePath = `public/${file.name}`

        //file upload to cloud storage
        const {data, error} = await supabase.storage.from('documents').upload(filePath, file)
        if (error) {
            console.log("Upload Error", error);
            alert("Upload failed!")
            setuploading(false)
            return
        } 
        const publicUrl = supabase.storage.from('documents').getPublicUrl(filePath).data
        setUploadedUrl(publicUrl)
        alert("File Uploaded Succesfully!")

        //web worker
        const worker = new Worker(new URL("../workers/metadataWorker.js", import.meta.url), {type: "module"})

        console.log("Worker created and file sent.");
        worker.postMessage(file) //send to worker

        worker.onmessage = async (e) => {
            console.log("Worker responded:", e.data);
            const message = e.data
            
            if (message.error) {
                console.error("Worker Error:", message.error);
                alert("Error extracting metadata: " + message.error);
                setuploading(false)
                worker.terminate()
                return
            } 
            
            if (message.metadata) {
                const metadata = message.metadata;
                metadata.file_url = publicUrl;
                console.log("Extracted Metadata:", metadata);

                // sending the metadata to the server
                try {
                    console.log("Sending metadata to backend...");
                    const response = await axios.post("http://localhost:5000/generate-embedding", metadata)
                    console.log("Metadata saved successfully", response.data);
                } catch (error) {
                    console.error("Error saving metadata:", error)
                }
            
                worker.terminate()
                setuploading(false)
            }    
        }
    }

    return(
        <div>
            <h2 id="Input-heading">Upload a File</h2>
            <input 
                type="file" 
                onChange={(e) => setFile(e.target.files[0])}
            />
            <button type="button" onClick={handleUpload} disabled={uploading}>
                Upload File
            </button>
        </div>
    )
}

export default FileUploader