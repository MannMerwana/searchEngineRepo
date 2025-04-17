import { useState } from 'react'
import './App.css'

function App() {
 
  return (
    <>
    <h1>Search Engine</h1>
      <div className='searchBox-Container'>
            <input
            className='searchBox'
             type="text" 
            id ='searchBox'
            placeholder='Enter Text To Search...' />
        </div>
    </>
  )
}

export default App
