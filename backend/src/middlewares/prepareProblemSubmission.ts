

import { Problem, TestCase, testCaseType, problemType } from '../models/problem'
import { Request, Response, NextFunction } from "express";
import { AxiosError } from "axios";


export async function prepareProblemSubmission(req: Request, res: Response, next: NextFunction) {
    try {
        const problemId = req.body.problemId;
        const problem = await Problem.findByPk(problemId,
            { include: [{ model: TestCase, as: 'testCases' }] }
        ) as problemType | null;

        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        // Prepare test cases from the problem
        const testCases = (problem.testCases as testCaseType[]).map((tc: testCaseType) => ({
            input: tc.input,
            expectedOutput: tc.expectedOutput,
        }));

        // add necesary data to req.body
        req.body.testCases = testCases;

        return next()

    } catch (err) {
        const error = err as AxiosError;
        console.error(error.response?.data || error.message);
        res.status(500).json({ message: 'Evaluation failed', error: error.message });
    }
}

