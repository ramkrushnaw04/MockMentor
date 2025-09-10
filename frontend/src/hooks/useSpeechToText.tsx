import { useState, useRef, useCallback } from "react";

const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

type UseSpeechToTextReturn = {
  text: string;
  startListening: () => void;
  stopListening: () => void;
};

export function useSpeechToText(waitTime: number = 5000): UseSpeechToTextReturn {
  const [text, setText] = useState<string>("");
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<number | null>(null);

  const startListening = useCallback(() => {
    if (!SpeechRecognition) {
      alert("Web Speech API not supported in this browser.");
      return;
    }

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.continuous = true;

      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          finalTranscript += event.results[i][0].transcript;
        }
        setText(finalTranscript);

        // reset silence timer
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = window.setTimeout(() => {
          recognition.stop();
        }, waitTime);
      };

      recognition.onerror = (err: any) => {
        console.error("Speech recognition error:", err);
      };

      recognition.onend = () => {
        // optional: do something when stopped
      };

      recognitionRef.current = recognition;
    }

    recognitionRef.current.start();
  }, [waitTime]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
  }, []);

  return { text, startListening, stopListening };
}