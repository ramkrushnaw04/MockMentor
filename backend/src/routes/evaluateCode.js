

function evaluateCode(req, res) {
  try {
    console.log(req.body);
    console.log('Received evaluation request:');
    // Respond with success
    res.status(200).json({ message: 'Evaluation received' });
  } catch (error) {
    // Respond with error
    res.status(500).json({ message: 'Evaluation failed', error: error.message });
  }
}

module.exports = evaluateCode;