
import { Problem, TestCase, Tag } from '../models/problem'
import { Request, Response } from "express";
import { AxiosError } from "axios";

export async function getProblem(req: Request, res: Response) {
    try {
        const { id } = req.params;
        // Find problem by primary key and include test cases
        const problem = await Problem.findByPk(id, {
            include: [
                { model: TestCase, as: 'testCases' },
                { model: Tag, as: 'tags' },
            ],
        });

        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }
    
        const problemJson = problem.toJSON();
        problemJson.testCases = problemJson.testCases.slice(0, 3)
        
        // console.log('Fetched problem: ', problemJson);

        res.status(200).json(problemJson);
    } catch (err) {
        const error = err as AxiosError;
        return res.status(500).json({ message: 'Failed to get problem', error: error.message });
    }
}

