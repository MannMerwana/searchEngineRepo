import React from 'react';
import {useState } from 'react';
import axios from "axios";
 
 export const Docsy = () => {
   
   const [searchInput, setSearchInput] = useState("");
 
   //initialize the loading state as true.
  //  const [loading,setLoading] = useState(true);
 
   //initialize the error state as null
   const [error,setError] = useState(null);
 
 
   const [results, setResults] = useState([]);
   const [showResults, setShowResults] = useState(false);
const performSearchOnMetaData = async () => {
  // setLoading(true);
  const query = searchInput.toLowerCase().trim();
  if(!query){
    setResults([]);
    // setLoading(false);
  }

  try {
    // const response = await axios.post("http://localhost:5000/search", { query });
    // // setResults(response.data.topResults || []);
    // const filtered = response.data.topResults && response.data.topResults.filter((doc) => {
    //   const combinedText = `
     
    //   ${doc.file_name?.toLowerCase() || ''}
    //   ${doc.title?.toLowerCase() || ''}
    //   ${doc.file_url?.toLowerCase() || ''}
    // `;
    // return (
    //   combinedText.includes(query)
    // )
    // })
    const response = await axios.post("http://localhost:5000/search", { query });
    setResults(response.data.topResults || []);
    console.log(response.data.topResults);
  } catch (err) {
    console.error("Search error:", err);
    setError("An error occurred while searching. Please try again.");
  } finally {
    // setLoading(false);
  }
}

   return (
     <>
       <div className="docsy">
         <h1 className="heading">Docsy Search Engine</h1>
         <div className="search">
           <input
             type="text"
             className="searchInput"
             value={searchInput}
             onChange={(e) => setSearchInput(e.target.value)}
             onFocus={() => setShowResults(true)}
            //  onBlur={() => setShowResults(false)}
           />
 
           <button onClick={performSearchOnMetaData}>Search</button>
 
           {/* {loading && (
             <div className="loadingState">
               <div className="spinner"></div>
               <p className="loadingText">Loading...</p>
             </div>
           )} */}
 
           
         </div>
 
         {showResults && (
           <div className="resultsContainer">
             {!error && results.length === 0 && (
               <p>No Records/Documents Found...</p>
             )}
             {results &&
  results.map((document) => (
    <div
      className="result"
      key={document.id}
      style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
      onClick={() => window.open(document.file_url, "_blank")}
    >
      <h3>{document.title}</h3>
      <p>
        <strong>File:</strong> {document.file_name}
      </p>
      <p>
        <strong>File-URL:</strong> {document.file_url}
      </p>
      <p>
      <strong>Snippet:</strong> {document.snippet}
      </p>
    </div>
  ))}
           </div>
         )}
       </div>
     </>
   );
}
 
 