import React, {useState} from 'react'
import CodeEditor from '../components/editor/CodeEditor';

const Home = () => {
    const [codeText, setCodeText] = useState("")

  return (
    <div>
        <CodeEditor language='javascript' onChange={() => {}} value={codeText} />
    </div>
  )
}

export default Home
