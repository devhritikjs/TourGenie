// Required imports
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Root route
app.get('/', (req, res) => {
  res.send("hello world geimini");
});

// Initialize the Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to generate content based on prompt
const generate = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text(); // Return the generated content
  } catch (err) {
    console.log(err);
    throw err; // Return the error
  }
};
  
// API endpoint for content generation
app.post('/api/content', async (req, res) => {
    try {
      const data = req.body.question; // Extract the question from the request body
      
      if (!data) {  // Check if 'question' is undefined or empty
        return res.status(400).send({ error: "No question provided." });
      }
      
      const result = await generate(data); // Generate content using the AI model
      res.send({
        "result": result // Send back the generated result
      });
    } catch (err) {
      console.error("Error:", err); // Log the error to the server console
      res.status(500).send({ error: err.message }); // Send the error message as response
    }
  });

// Start the server
app.listen(3000, () => {
  console.log('Server is up and running');
});
