const {Problem, TestCase, Tag} = require('../../models/problem');

async function createProblem(req, res) {
    try {
        
        const { tags, ...problemData } = req.body;

        // create problem without test cases and tags first
        const problem = await Problem.create(problemData, {
            include: [{ model: TestCase, as: 'testCases' }]
        });

        // add tags
        if(tags && tags.length) { 
            const tagInstances = await Promise.all(
                tags.map(async (tagName) => {
                    const [tag] = await Tag.findOrCreate({ where: { name: tagName } });
                    return tag;
                })
            )
            await problem.setTags(tagInstances);
        }

        res.status(201).json({ message: 'Problem created successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Problem creation failed', error: error.message });
    }
}

module.exports = createProblem;