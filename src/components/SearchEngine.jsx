import React from 'react';
import { useEffect,useState } from 'react';

 const SearchEngine = () => {
   const [searchInput, setSearchInput] = useState("");

   //initialize the loading state as true.
   const [loading,setLoading] = useState(true);

   //initialize the error state as null
   const [error,setError] = useState(null);


   const [results, setResults] = useState([]);
   const [showResults, setShowResults] = useState(false);
   const [cache, setCache] = useState({}); //state to implement and handle cache to cache api calls

   const fetchData = async () => {

    //start loading
    setLoading(true);
    setError(null);//Reset error before fetching

     //if data is present in cache,setResults to the input
     if (cache[searchInput]) {
       console.log(`CACHE RETURNED ${searchInput}`);
       setResults(cache[searchInput]);
       setLoading(false); // Done loading from cache
       return;
     }

     try
     {
          
        //if data is not present in the cache,then only make an api call
        const timeTakenForEachApiCallInMs = searchInput;
        console.log(`API Call ${timeTakenForEachApiCallInMs}`);


        const resData = await fetch(
          "https://dummyjson.com/recipes/search?q=" + searchInput
        );

        if(!resData.ok){
          throw new Error(`HTTP error! Status:${resData.status}`);
        }

        const jsonData = await resData.json();
        setResults(jsonData?.recipes);

        //here key is Mango as ex and jsondata is the result that we have got.
        setCache((prev) => ({ ...prev, [searchInput]: jsonData?.recipes }));
      }catch(error){
        console.error(`Error while Fetching Data:`,error);
        setError(error);
      } finally{
        setLoading(false);// end loading no matter we get data or not. 
      }
   }
   //debouncing to reduce api calls.
   useEffect(() => {
     const delayFetchData = setTimeout(fetchData, 350);
     return () => {
       clearTimeout(delayFetchData);
     };
   }, [searchInput]);

   return (
     <>
       <h1 className="heading">Auto Complete Search Bar</h1>
       <div className="">
         <input
           type="text"
           className="searchInput"
           value={searchInput}
           onChange={(e) => setSearchInput(e.target.value)}
           onFocus={() => setShowResults(true)}
           onBlur={() => setShowResults(false)}
         />

         {loading && (
           <div className="loadingState">
             <div className="spinner"></div>
             <p className='loadingText'>Loading...</p>
           </div>
         )}

         {error && (
           <p>There was an error in loading the Documents,files content.</p>
         )}
       </div>

       {showResults && (
         <div className="resultsContainer">
           {!loading && !error && results.length === 0 && (
             <p>No Records/Documents Found...</p>
           )}
           {!loading &&
             !error &&
             results.length > 0 &&
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