const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

// imports
const evaluateCode = require('./routes/evaluateCode');

// middleware
app.use(cors({
    allowedHeaders: ['Content-Type'],
    methods: ['POST'],
    credentials: true,
    origin: ['http://localhost:5173']
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('MockMentor API is running');
});

// routes
app.post('/evaluate', evaluateCode);

// server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)});