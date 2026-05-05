---
title: "Garmin Virtual Coach — AI-Powered Training Insights from Wearable Data"
date: 2026-05-01
draft: false
weight: 0
tags: ["Python", "LLM", "API", "Streamlit", "ETL", "Data Pipeline", "Garmin", "AI"]
categories: ["Data Engineering", "AI/ML"]
summary: "Full-stack data pipeline that ingests Garmin wearable data (25+ endpoints), computes training analytics, and serves personalized AI coaching via a Streamlit web app."
featured: true
---

## The problem

Athletes using Garmin devices generate rich health and performance data — activities, heart rate, sleep stages, HRV, stress, body battery — but Garmin Connect only shows raw metrics without actionable coaching. Build a system that ingests this data, computes meaningful training analytics, and delivers personalized coaching advice through a conversational AI interface.

## Solution architecture

```
User (browser) → Streamlit Cloud (free)
                    │
                    ├── Garmin Connect API (v0.3.3, JWT auth)
                    │     └── 25+ endpoints: activities, sleep, HRV,
                    │         stress, body battery, training readiness,
                    │         race predictions, body composition, etc.
                    │
                    ├── Feature Engine (Python)
                    │     ├── Training load (TRIMP, ACWR)
                    │     ├── HR zone time distribution
                    │     ├── Weekly volume trends
                    │     └── Recovery score (sleep + HRV composite)
                    │
                    ├── LLM Coach (Groq / Gemini / OpenAI)
                    │     ├── Structured prompt with athlete context
                    │     ├── Multi-turn conversation memory
                    │     └── Custom plan builder (interactive Q&A)
                    │
                    └── Dashboard (matplotlib/seaborn)
                          ├── HR zone distribution
                          ├── Training load per activity
                          ├── Sleep architecture (donut)
                          └── Overnight HRV with baseline bands
```

## Key decisions and trade-offs

### Stateless multi-user architecture

Rather than building a database, auth system, and user management, the app fetches data live from Garmin on each session. Users enter their credentials, data is pulled and processed in-memory, and nothing is persisted. This eliminates infrastructure cost and complexity at the expense of session persistence — acceptable for an MVP where the goal is to validate the product with real users.

### Feature layer does the thinking, not the LLM

Raw Garmin JSON is too noisy and token-expensive to feed directly to an LLM. Instead, a Python feature engine pre-computes meaningful metrics (ACWR, recovery scores, zone distributions) and feeds structured context to the LLM. This keeps prompts focused (~800 tokens of context vs ~50K of raw JSON) and produces more specific coaching advice.

### Multi-provider LLM abstraction

The `LLMClient` class supports Groq, Gemini, OpenAI, and AWS Bedrock through a single interface. Switching providers requires changing one environment variable. This future-proofs the app against API pricing changes and rate limits.

### Garmin API auth challenges

Garmin changed their OAuth flow in March 2026, breaking the standard `garth` library. The project uses `garminconnect` v0.3.3 which implements a new JWT-based auth flow with `curl_cffi` for TLS fingerprint impersonation. Tokens are cached locally to avoid rate limiting on subsequent requests.

## Results

- **Live product**: Deployed on Streamlit Cloud, publicly accessible, used by real athletes
- **25+ data endpoints** ingested per user session
- **8 chart types** generated from real wearable data
- **9 suggested coaching prompts** across 3 categories (evaluate, improve, plan)
- **Interactive plan builder**: LLM asks clarifying questions before generating a custom training plan
- **Google Analytics 4** integrated for usage tracking
- **Zero cost**: Entire stack runs on free tiers (Streamlit Cloud + Groq + GitHub)

## Stack

- **Backend/Frontend**: Streamlit (Python)
- **Data ingestion**: `garminconnect` v0.3.3 (Garmin Connect API)
- **Analytics**: pandas, numpy, custom TRIMP/ACWR calculations
- **Visualization**: matplotlib, seaborn
- **LLM**: Groq (Llama 3.3 70B) — sub-second responses
- **Configuration**: pydantic-settings, Streamlit secrets
- **Deployment**: Streamlit Cloud (auto-deploy from GitHub)
- **Analytics**: Google Analytics 4

## Links

- [🚀 Live App](https://garmin-virtual-coach.streamlit.app)
- [📁 GitHub Repository](https://github.com/luis-fer-333/garmin-virtual-coach)
