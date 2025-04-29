import * as mammoth from "mammoth";
import * as XLSX from "xlsx";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker"; // This ensures worker code is bundled

console.log("metadataWorker loaded!");

self.onmessage = async function (e) {
    console.log("Worker received file:", e.data);
    const file = e.data
    const extension = file.name.split(".").pop().toLowerCase()

    const reader = new FileReader()

    reader.onload = async function () {
        let textContent = ""

        //for .docx
        if (extension === "docx") {
            const result = await mammoth.extractRawText({ arrayBuffer: reader.result })
            textContent = result.value
            console.log("Docx parsed");
        }
        // for pdf 
        else if (extension === "pdf") {
            const typedArray = new Uint8Array(reader.result)
            const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise
            textContent = ""
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i)
                const content = await page.getTextContent()
                const strings = content.items.map((item) => item.str).join(" ")
                textContent += strings + "\n"
            }
        }
        // for excel - xlsx
        else if (extension === "xlsx") {
            const workbook = XLSX.read(reader.result, { type: "array" })
            workbook.SheetNames.forEach(sheetName => {
                const sheet = workbook.Sheets[sheetName]
                const data = XLSX.utils.sheet_to_csv(sheet)
                textContent += `Sheet: ${sheetName}\n${data}\n`
            })
        } else {
            self.postMessage({ error: "Unsupported file type" })
            return
        }

        const metadata = {
            id: crypto.randomUUID(),
            file_name: file.name,
            title: file.name.split(".").slice(0, -1).join("."),
            file_url: "",
            textContent: textContent,
            uploaded_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        }

        self.postMessage({ metadata })
    }
    reader.readAsArrayBuffer(file)
}