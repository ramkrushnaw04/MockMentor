
const { Problem, TestCase, Tag } = require('../../models/problem');

async function getProblem(req, res) {
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
    } catch (error) {
        return res.status(500).json({ message: 'Failed to get problem', error: error.message });
    }
}

module.exports = getProblem;