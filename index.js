const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
dotenv.config();
const port = 3000;
const app = express();
const model =  "gemini-2.5-flash";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
const extractText = (result) =>  result.candidates?.[0]?.content?.parts?.[0]?.text || "No output";

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if(!message) {
    return res.status(400).json({ error: "Message is required"});
  }

  try {
    const result = await ai.models.generateContent({
      model: model,
      contents: message
    });
    const text = extractText(result);
    res.status(200).json({ reply: text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(port, () => {
    console.log(`This gemini app ai running on ${port}`)
})