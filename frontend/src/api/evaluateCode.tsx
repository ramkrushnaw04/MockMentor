import client from "../config/client";

// export async function evaluateCode(code: string, input: string, expectedOutput: string, language: string, languageId: number) {
//     const response = await client.post(
//         "/evaluate", 
//         { code, input, expectedOutput, language, languageId }
//     );
//     return response.data
// }




export async function evaluateCode(code: string, testCases: any, language: string, languageId: number) {
    // console.log('Test Cases in API Call: ', testCases);
    const response = await client.post(
        "/evaluate", 
        { code, testCases, language, languageId }
    );
    return response.data
}