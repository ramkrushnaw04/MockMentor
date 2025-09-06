import client from "../config/client";

export async function evaluateCode(code: string, language: string) {

    const response = await client.post(
        "/evaluate", 
        { code, language }
    );
    console.log(response)
}