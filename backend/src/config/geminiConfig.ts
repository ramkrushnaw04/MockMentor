import "dotenv/config"; 
import { GoogleGenAI } from "@google/genai"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string; 

const ai = new GoogleGenAI( { apiKey: GEMINI_API_KEY });

async function getAiResponse(prompt: string) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });
        return response

    }  catch (error) {
        console.error("Error generating AI content:", error);
        return error
    }
}


module.exports = getAiResponse