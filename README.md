# AI-Powered Agriculture Marketplace

A full-stack marketplace platform connecting farmers directly with consumers, powered by AI-driven product recommendations and a conversational shopping assistant. Built to improve market access for farmers and deliver personalized experiences for buyers.

---

## What it does

- **AI recommendations** — LLM-powered engine suggests relevant products based on user preferences and browsing behavior
- **Conversational AI assistant** — Chat interface lets consumers ask questions about products, get farming context, and receive personalized suggestions
- **Real-time order processing** — Backend APIs handle live inventory, orders, and data workflows
- **Farmer & consumer dashboards** — Separate views optimized for each user type
- **Responsive UI** — Mobile-friendly design built with React and Next.js

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js, React, Responsive UI, CSS |
| Backend | REST APIs, Node.js, data workflows |
| AI / LLM | LLM APIs, Prompt Engineering, conversational AI |
| Data | Real-time order processing, product data pipelines |

---

## Architecture Overview

```
Consumer / Farmer → Next.js Frontend
                          ↓
                    REST API Layer
                    ↙           ↘
          Order Processing    LLM Recommendation Engine
                                       ↓
                          Personalized product insights
                          + conversational AI responses
```

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/pranavgadde12/AI-Powered-Agriculture-Marketplace.git
cd AI-Powered-Agriculture-Marketplace

# Install dependencies
npm install

# Add your LLM API key to .env
OPENAI_API_KEY=your_key_here

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Key Features

- Dual-role platform: separate farmer and consumer experiences
- LLM integration for product Q&A and smart recommendations
- Real-time order and inventory management via REST APIs
- Fully responsive, production-ready UI

---

## Author

**Pranav Gadde** — AI Full-Stack Engineer  
[LinkedIn](https://www.linkedin.com/in/pranav-gadde12) · [Email](mailto:pranavchowdarygadde@gmail.com)
