const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');
const cors = require('cors');

// Validate environment variables
if (!process.env.GEMINI_API_KEY && !process.env.GROQ_API_KEY) {
  throw new Error('API keys for Gemini and Groq are missing in the environment variables.');
}

// Initialize Gemini API
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const geminiModel = genAI ? genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }) : null;

// Initialize Groq API
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

const app = express();

app.use(express.json());
app.use(cors()); // To handle cross-origin requests
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Serve index.html on the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Endpoint to handle the chat request from the frontend
app.post('/chat', async (req, res) => {
  const { messages, api } = req.body;

  if (!messages || messages.length === 0) {
    return res.status(400).json({ error: 'No messages provided' });
  }

  try {
    let botResponse = "";

    if (api === 'gemini' && geminiModel) {
      const prompt = messages.map((msg) => `${msg.role}: ${msg.content}`).join('\n');
      const result = await geminiModel.generateContent(prompt);
      botResponse = result.response.text();
    } else if (api === 'groq' && groq) {
      const chatCompletion = await groq.chat.completions.create({
        model: 'llama3-8b-8192', // Adjust with the model you want to use
        messages: messages,
      });
      botResponse = chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't process the request.";
    } else {
      return res.status(400).json({ error: 'Invalid or missing API selection' });
    }

    res.json({ response: botResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error with the AI service' });
  }
});

// Handle unknown routes and serve 404.html
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
