import React from 'react';
import { useEffect,useState } from 'react';

 const SearchEngine = () => {
   const [searchInput, setSearchInput] = useState("");
   const [results, setResults] = useState([]);
   const [showResults, setShowResults] = useState(false);

   const fetchData = async () => {
     const timeTakenForEachApiCallInMs = searchInput;
     console.log(`API Call ${timeTakenForEachApiCallInMs}`);
     const resData = await fetch(
       "https://dummyjson.com/recipes/search?q=" + searchInput
     );

     const jsonData = await resData.json();
     setResults(jsonData?.recipes);
   };
   //debouncing to reduce api calls.
   useEffect(() => {
     const delayFetchData = setTimeout(fetchData, 350);
     return () => {
       clearTimeout(delayFetchData);
     };
   }, [searchInput]);

   return (
     <>
      
       <div>
         <input
           type="text"
           className="searchInput"
           value={searchInput}
           onChange={(e) => setSearchInput(e.target.value)}
           onFocus={() => setShowResults(true)}
           onBlur={() => setShowResults(false)}
         />
       </div>
       {showResults && (
         <div className="resultsContainer">
           {results &&
             results.map((recipe) => (
               <span className="result" key={recipe.id}>
                 {recipe.name}
               </span>
             ))}
         </div>
       )}
     </>
   );
}
export default SearchEngine