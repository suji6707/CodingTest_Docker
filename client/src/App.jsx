import React from 'react'
import Editor from "@monaco-editor/react";
import { useRef } from 'react';
import axios from 'axios'
import { useState } from 'react';

function App() {
  const editorRef = useRef(null)
  const [result, setResult] = useState('')
  const [isAnswer, setIsAnswer] = useState(false)

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor
  }

  async function showValue() {
    const code = editorRef.current.getValue()
    
    try {
      const res = await axios.post(`http://localhost:8080/submit`, { code })
      const {output, isAnswer} = res.data
      setResult(output)
      setIsAnswer(isAnswer)
    } catch (err) {
      console.error(err)
      setResult('Error occurred while processing the answer')
    }
  }

  return (
    <>
      <div>
        {/* style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}} */}
        <button width="30vh" onClick={showValue}>Show value</button>
        <Editor 
          height="50vh"
          width="100vh"
          defaultLanguage="c"
          defaultValue="// some comment"
          onMount={handleEditorDidMount}
        />
        <div>
          <h3>Submit Output:</h3>  
          <pre>{result}</pre>
          <pre>{isAnswer ? '맞췄습니다!' : '틀렸습니다'}</pre>
        </div> 
      </div>
    </>
  )
}

export default App
