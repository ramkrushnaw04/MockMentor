import {Problem, TestCase, Tag} from '../models/problem';
import { Request, Response } from "express";
import { AxiosError } from "axios";

export async function createProblem(req: Request, res: Response) {
    try {
        
        const { tags, ...problemData } = req.body;

        // create problem without test cases and tags first
        const problem = await Problem.create(problemData, {
            include: [{ model: TestCase, as: 'testCases' }]
        }) as any;

        // add tags
        if(tags && tags.length) { 
            const tagInstances = await Promise.all(
                tags.map(async (tagName: any) => {
                    const [tag] = await Tag.findOrCreate({ where: { name: tagName } });
                    return tag;
                })
            )
            await problem.setTags(tagInstances);
        }

        res.status(201).json({ message: 'Problem created successfully' });
    } catch (err) {
        const error = err as AxiosError;
        return res.status(500).json({ message: 'Problem creation failed', error: error.message });
    }
}

