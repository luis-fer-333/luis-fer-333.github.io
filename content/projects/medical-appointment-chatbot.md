---
title: "Medical Appointment Chatbot — LLM + AWS + WhatsApp"
date: 2025-09-01
draft: false
weight: 3
tags: ["LLM", "AWS Lambda", "Serverless", "NLP", "WhatsApp", "DynamoDB", "Google Calendar"]
categories: ["Cloud & Backend", "NLP"]
summary: "Cloud-based WhatsApp chatbot for medical appointment management using LLaMA 3.3-70B for intent parsing, AWS Lambda for serverless orchestration, and Google Calendar as the scheduling backend."
---

## Overview

Master's thesis project: a fully functional WhatsApp chatbot that lets patients manage medical appointments — schedule, query, cancel, and reschedule — using natural language in Spanish. The system interprets free-text messages (including typos and ambiguous phrasing) and translates them into concrete calendar actions.

## Architecture

Six interconnected components:

1. **WhatsApp Business Cloud API** — patient-facing channel via Meta's Graph API
2. **FastAPI + Mangum on AWS Lambda** — serverless orchestration with a 12-state conversational state machine
3. **DynamoDB** — session storage with TTL-based expiry and message deduplication
4. **AWS Secrets Manager** — secure credential storage for all API keys and service accounts
5. **Google Calendar API** — appointment backend with availability checking, Spanish national holiday awareness, and patient-level event filtering
6. **Cerebras API (LLaMA 3.3-70B)** — semantic intent parser that classifies messages into intents and extracts dates/times from relative expressions ("tomorrow at 10", "next Monday")

## Key Technical Decisions

- **Hybrid intent routing**: deterministic keyword matching for common commands (fast, zero-cost) with LLM fallback for ambiguous or natural-language inputs — keeps latency low and API costs minimal
- **Structured JSON output from LLM**: prompt-engineered to return `{intent, date, time}` JSON, parsed and validated before any calendar action
- **State machine over pure LLM conversation**: predictable flow control for data capture (name, DNI, phone) and multi-step booking, with the LLM only handling semantic interpretation
- **Serverless-first**: entire stack runs on Lambda with no always-on infrastructure — cost scales to zero when idle
- **Session TTL + deduplication**: DynamoDB items auto-expire after 7 days; WhatsApp webhook messages are deduplicated to prevent double-processing

## Evaluation

- Latency benchmarked per intent type (schedule, cancel, reschedule, query)
- Intent confusion matrix measuring classification accuracy across categories
- Robustness testing against typos, incomplete sentences, and out-of-scope inputs
- AWS cost analysis: Lambda compute + DynamoDB read/write units per interaction

## Tech Stack

`Python` · `FastAPI` · `AWS Lambda` · `DynamoDB` · `Secrets Manager` · `Google Calendar API` · `WhatsApp Business Cloud API` · `LLaMA 3.3-70B (Cerebras)` · `Mangum` · `Pydantic`

## Source Code

- [📄 Thesis PDF (full document)](/Memoria_TFM_Luis.pdf)
- [GitHub Repository](https://github.com/luis-fer-333/portfolio/tree/main/capstones/Medical_Appointment_Chatbot)

---

> **Note:** All personal data in the code and examples is fictitious.
