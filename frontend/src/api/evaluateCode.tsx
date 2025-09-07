import client from "../config/client";

export async function evaluateCode(code: string, language: string, languageId: number) {
    console.log(languageId)
    const response = await client.post(
        "/evaluate", 
        { code, language, languageId }
    );
    console.log(response.data)
}