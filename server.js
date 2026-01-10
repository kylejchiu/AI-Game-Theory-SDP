import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import path from 'path';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), 'chat.html'));
});

app.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage =
      req.body.message ||
      (Array.isArray(req.body.messages)
        ? req.body.messages[req.body.messages.length - 1].content
        : "");

    if (!userMessage) {
      return res.status(400).json({ error: "No message provided." });
    }

    const systemPrompt =
      process.env.SYSTEM_PROMPT ||
      "You are a concise AI game theory agent. Answer questions about game theory and, when asked to choose actions in games, follow instructions precisely.";

    const model =
      process.env.OPENROUTER_MODEL; //
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.error("❌ Missing OPENROUTER_API_KEY");
      return res.status(500).json({ error: "Server not configured with API key." });
    }

    console.log("➡️ Sending to OpenRouter:", { model, userMessage });

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.5,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ OpenRouter API error:", data);
      return res.status(500).json({
        error:
          data?.error?.message ||
          `OpenRouter returned HTTP ${response.status}`,
      });
    }

    const reply = data?.choices?.[0]?.message?.content || "No AI response.";
    res.json({ reply });
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`AI Game Theory backend running on port ${PORT}`);
});

// Serve chat.html for any other GET route (single-page entry)
app.get('*', (req, res) => {
  if (req.method !== 'GET') return res.status(405).end();
  res.sendFile(path.join(process.cwd(), 'chat.html'));
});