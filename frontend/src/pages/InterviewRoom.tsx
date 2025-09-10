
import { useEffect } from 'react';
import CodeEditor from '../components/editor/CodeEditor';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

const InterviewRoom = () => {
    const {text, startListening, stopListening} = useSpeechToText();
    const {speak} = useTextToSpeech();

    // useEffect(() => {
    //   console.log(text)
    
    //   return () => {
        
    //   }
    // }, [text])

    useEffect(() => {
      speak("Welcome to the interview room. You can start coding now.");
    
      return () => {

      }
    }, [])
    
    
  return (

        <CodeEditor  />
       
  )
}

export default InterviewRoom
