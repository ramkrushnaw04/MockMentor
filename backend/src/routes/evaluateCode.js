
require('dotenv').config();
const axios = require('axios');


const JUDGE0_API = "https://judge0-ce.p.rapidapi.com/submissions";

async function evaluateCode(req, res) {
    console.log('Received evaluation request: ', req.body);
    try {
        if (req.body.id == -1) {
            return res.status(400).json({ message: 'Invalid language' });
        }
        const encodedCode = Buffer.from(req.body.code).toString("base64");
        const encodedExpectedOutput = Buffer.from("Hello World123").toString("base64");

        const submission = await axios.post(
            `${JUDGE0_API}?base64_encoded=true&wait=true`,
            {
                source_code: encodedCode,
                language_id: 54,
                stdin: '',
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
        
        console.log('Submission response: ', submission.data);


        // Respond with success
        res.status(200).json({ message: 'Evaluation received' });
    } catch (error) {
        // Respond with error
        console.error(error.response?.data || error.message);
        res.status(500).json({ message: 'Evaluation failed', error: error.message });
    }
}

module.exports = evaluateCode;