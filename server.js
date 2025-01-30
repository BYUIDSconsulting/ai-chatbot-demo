const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const MarkdownIt = require("markdown-it");
const md = new MarkdownIt();


require("dotenv").config();

const app = express();
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
app.use(express.json());
const PORT = process.env.PORT || 5500;

const model = genAI.getGenerativeModel({
    model: "learnlm-1.5-pro-experimental",
    systemInstruction: "Respond to me like a TA for a class",
  });
  
const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

// API route to handle chat requests
app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
  
      const chatSession = model.startChat({
        history: [],
      });
  
      let result;
      try {
        result = await chatSession.sendMessage(message);
        // result = md.render(result.response.text());
        console.log("AI Response:", result);
      } catch (error) {
        console.error("Error during sendMessage:", error);
        return res.status(500).json({ error: "Failed to process the AI request" });
      }
  
      if (result && result.response && result.response.text) {
        let translatedResponse = md.render(result.response.text());
        return res.json({ response: translatedResponse });
      } else {
        return res.status(500).json({ error: "Invalid response from AI model" });
      }
    } catch (error) {
      console.error("Error during AI request:", error);
      res.status(500).json({ error: "Failed to process the request" });
    }
  });
    
// Middleware to parse JSON
app.use(express.json());

// Serve static files from the "src" directory
app.use(express.static(path.join(__dirname, 'src')));
console.log("Static files should be served from:", path.join(__dirname, 'src'));

// Define a route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', '/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
