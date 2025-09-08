
require('dotenv').config();
const axios = require('axios');
const JUDGE0_API = process.env.JUDGE0_API

async function evaluateCode(req, res) {
    // console.log('Received evaluation request: ', req.body);

    try {
        if (req.body.languageId == -1) {
            return res.status(400).json({ message: 'Invalid language' });
        }

        const userOutput = await Promise.all(req.body.testCases.map(async testCase => {
            const encodedCode = Buffer.from(req.body.code).toString("base64");
            const encodedInput = Buffer.from(testCase.input).toString("base64");
            const encodedExpectedOutput = Buffer.from(testCase.expectedOutput).toString("base64");

            const submission = await axios.post(
                `${JUDGE0_API}?base64_encoded=true&wait=true`,
                {
                    source_code: encodedCode,
                    language_id: req.body.languageId,
                    stdin: encodedInput,
                    expected_output: encodedExpectedOutput,
                },
                {
                    headers: {
                        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
                        "Content-Type": "application/json",
                    },
                }
            );
            const resOutput = Buffer.from(submission.data.stdout || "", "base64").toString("utf-8");
            
            return {
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
                output: resOutput,
                passed: submission.data.status.id === 3 // 3 means Accepted
            };
        }))

        
        console.log('User Output: ', userOutput);

        // Respond with success
        res.status(200).json(userOutput);
    } catch (error) {
        // Respond with error
        console.error(error.response?.data || error.message);
        res.status(500).json({ message: 'Evaluation failed', error: error.message });
    }
}

module.exports = evaluateCode;