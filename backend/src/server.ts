import "dotenv/config"; 
import express from 'express';
import cors from 'cors'
import sequelize from './config/databaseConfig';

const app = express();

// route imports
import { evaluateTestCases } from './routes/evaluateTestCases'
import { createProblem } from './routes/createProblem'
import { getProblem } from './routes/getProblem'
import { prepareProblemSubmission } from './middlewares/prepareProblemSubmission'
import getInterviewResponse from './routes/getInterviewResponse'

// } config
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "").split(",");
const PORT = process.env.PORT || 3000;

(async () => {
  await sequelize.sync({ alter: true }); 
  console.log("Models synced to DB");
})();


// middlewares
app.use(cors({
    allowedHeaders: ['Content-Type'],
    methods: ['POST'],
    credentials: true,
    origin: ALLOWED_ORIGINS
}));
app.use(express.json());

// routes
app.get('/', (_, res) => {
  res.send('MockMentor API is running');
});
app.post('/problems/evaluate', evaluateTestCases);
app.post('/problems', createProblem);
app.get('/problems/:id', getProblem);
app.post('/problems/submit', prepareProblemSubmission, evaluateTestCases)
app.post('/interview/respond', getInterviewResponse)

// server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});