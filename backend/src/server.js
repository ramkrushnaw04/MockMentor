const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose'); 
const sequelize = require('../config');


// route imports
const evaluateCode = require('./routes/evaluateCode');
const createProblem = require('./routes/createProblem');
const getProblem = require('./routes/getProblem');

// config
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "").split(",");
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/MockMentor'; 

// Connect to MongoDB
// mongoose.connect(MONGODB_URI)
//     .then(() => console.log('MongoDB connected'))
//     .catch((err) => {
//         console.error('MongoDB connection error:', err);
//         process.exit(1);
//     });

(async () => {
  await sequelize.sync({ alter: true }); // creates/updates tables automatically
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
app.get('/', (req, res) => {
  res.send('MockMentor API is running');
});
app.post('/evaluate', evaluateCode);
app.post('/problem', createProblem);
app.get('/problem/:id', getProblem);

// server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)});