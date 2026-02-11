import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import path from 'path';

dotenv.config();
const app = express();

// Define OpenRouter models
const OPENROUTER_MODELS = {
  OPENROUTER_MODEL_1: process.env.OPENROUTER_MODEL_1 || 'liquid/lfm-2.5-1.2b-thinking:free',
  OPENROUTER_MODEL_2: process.env.OPENROUTER_MODEL_2 || 'allenai/molmo-2-8b:free',
  OPENROUTER_MODEL_3: process.env.OPENROUTER_MODEL_3 || 'nvidia/nemotron-3-nano-30b-a3b:free',
  OPENROUTER_MODEL_4: process.env.OPENROUTER_MODEL_4 || 'qwen/qwen3-next-80b-a3b-instruct:free',
  OPENROUTER_MODEL_5: process.env.OPENROUTER_MODEL_5 || 'openai/gpt-oss-120b:free',
  OPENROUTER_MODEL_6: process.env.OPENROUTER_MODEL_6 || 'google/gemma-3n-e2b-it:free'
};

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), 'index.html'));
});

app.get("/api/models", (req, res) => {
  res.json(OPENROUTER_MODELS);
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
      "You are a strategic game theory player in an Iterated Prisoner's Dilemma. You must analyze the game history and make optimal decisions. You are helpful and follow instructions. You must respond with a Thought and an Action (Cooperate or Defect).";

    // Allow model to be specified in request, otherwise use default
    const model = req.body.model || process.env.OPENROUTER_MODEL;
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

// Serve index.html for any other GET route (single-page entry)
app.get('*', (req, res) => {
  if (req.method !== 'GET') return res.status(405).end();
  res.sendFile(path.join(process.cwd(), 'index.html'));
});