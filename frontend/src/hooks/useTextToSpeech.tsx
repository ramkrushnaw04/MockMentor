// useTextToSpeech.ts
export const useTextToSpeech = () => {
  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) {
      console.error("Text-to-speech not supported in this browser.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  return { speak };
};