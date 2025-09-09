
export type editorConfigType = {
    language: string,
    languageId: number,
    languageCode: string,
    fontSize: number,
}

export type resultsType = {
    input: string; 
    expectedOutput: 
    string; 
    got: string; 
    passed: boolean
}