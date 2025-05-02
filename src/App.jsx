import { useState } from 'react'
import FileUploader from './components/FileUploader'
import { Docsy } from './components/Docsy'
import './App.css'

function App() {
 
  return (
    <>
      <FileUploader />
      <Docsy />
    </>
  )
}

export default App
