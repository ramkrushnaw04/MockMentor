import getAiResponse from "../config/geminiConfig";
import { Request, Response } from "express";
import buildInterviewPrompt from "../templates/aiPrompt";
import interviewPromptInputType from "../templates/aiPrompt";

export default async function getInterviewResponse(req: Request, res: Response) {
    try {
        const prompt = buildInterviewPrompt(req.body);
        const aiResponse = await getAiResponse(prompt) as any
        const cleanedText = aiResponse.text.replace(/^```json\n/, '').replace(/\n```$/, '') as string
        const parsedJSON = JSON.parse(cleanedText) as typeof interviewPromptInputType
        res.status(200).json( parsedJSON );
    } catch(err) {
        const error = err as Error;
        res.status(500).json({ message: 'Failed to get interview response', error: error.message });
    }
}