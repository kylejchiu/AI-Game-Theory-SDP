# AI-Ethics-Academy

**Website:** [https://ai-ethics-academy.vercel.app/](https://ai-ethics-academy.vercel.app/)

## Overview


# AI Game Theory

This repository is a minimal demo for AI game-theory experiments, focused on an Iterated Prisoner's Dilemma (IPD) interactive demo located in `chat.html`.

Usage:

- Start the backend: `node server.js`
- Open `chat.html` in your browser (or visit the server root).

The UI provides a simple chat interface and an IPD runner that plays multiple rounds against the AI.

## Features

* Interactive chatbot for exploring ethical issues in AI
* Educational sections explaining fairness, transparency, and accountability
* A 25-question AI ethics quiz with instant feedback
* Simple, accessible design for all audiences
* Node.js backend for secure API proxying
* Hosted front-end on **Vercel** and backend on **Render**

## Getting Started

**Static Preview:**
Open `index.html` directly in a browser or run a quick local server:

```bash
python3 -m http.server 5500
# open http://localhost:5500/
```

**Backend Setup (for chatbot):**

```bash
npm install
npm start
```

Default port is `8080` or as defined by the `PORT` variable.

## Environment Variables

Create a `.env` file with:

```
OPENROUTER_API_KEY=
OPENROUTER_MODEL=
PORT=
SYSTEM_PROMPT=
```

## Deployment

* Frontend deployed at: [https://ai-ethics-academy.vercel.app/](https://ai-ethics-academy.vercel.app/)
* Backend deployed on Render ([https://ai-ethics-academy.onrender.com](https://ai-ethics-academy.onrender.com))
  You can also deploy the static version on GitHub Pages or Netlify.

## Educational Purpose

AI-Ethics-Academy encourages civic engagement by helping users question how technology shapes society.
It equips students and communities with the knowledge needed to design ethical, transparent, and fair AI systems.