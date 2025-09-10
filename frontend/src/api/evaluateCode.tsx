import client from "../config/client";

export async function runSampleCases(code: string, testCases: any, languageId: number) {
    // console.log('Test Cases in API Call: ', testCases);
    const response = await client.post(
        "/problems/evaluate", 
        { code, testCases, languageId }
    );
    return response.data
}


export async function submitProblem(code: string, languageId: number, problemId: string) {
    const response = await client.post(
        "/problems/submit", 
        { code, languageId, problemId }
    );
    return response.data
}