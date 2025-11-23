const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// السماح بالاتصال من أي مكان
app.use(cors());
app.use(express.json());

// التحقق من وجود المفتاح
if (!process.env.GEMINI_API_KEY) {
  console.error("⚠️  Error: GEMINI_API_KEY is missing!");
}

// إعداد Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// مسار الفحص (Health Check)
app.get('/', (req, res) => {
  res.status(200).send('ZOOKA AI Backend is running ✅');
});

// مسار الشات
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Please provide a 'message' field." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error("❌ Gemini Error:", error);
    res.status(500).json({ 
      error: "Failed to generate response", 
      details: error.message 
    });
  }
});

// تشغيل السيرفر
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
