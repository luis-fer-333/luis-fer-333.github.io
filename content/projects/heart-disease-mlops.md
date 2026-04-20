---
title: "Heart Disease MLOps — MLflow + Streamlit Deployment"
date: 2025-06-30
draft: false
weight: 13
tags: ["MLOps", "MLflow", "Streamlit", "FastAPI", "Deployment", "ML"]
categories: ["MLOps"]
summary: "A full MLOps cycle — dataset → MLflow-tracked experiments → production registry → Streamlit deployment in two patterns (embedded vs. API-backed)."
featured: false
---

## What it covers

The full lifecycle of a small ML model — from data prep through production deployment:

1. **Data prep** — heart disease dataset (918 patients, 7 features), train/test split
2. **Training with MLflow tracking** — two parallel approaches (Random Forest, Dense NN) both logged to MLflow with parameters, metrics, and model artifacts
3. **Model registry** — register the chosen model and promote to the `prod` alias
4. **Deployment in two patterns**:
   - **Embedded**: Streamlit loads the MLflow `prod` model directly into its process
   - **API-backed**: FastAPI wraps the model; Streamlit calls it over HTTP

## Why both patterns

- **Embedded** is simpler — one process, one deployment. Fine for demos, small-scale internal tools.
- **API-backed** is how production ML systems are usually structured — model service can scale independently from the UI, can be called by multiple clients, and decouples the model release cycle from the app release cycle.

Showing both side-by-side demonstrates that model serving isn't a single solved problem — it's a design decision.

## Stack

- **Training**: scikit-learn, TensorFlow / Keras
- **Experiment tracking / registry**: MLflow
- **Serving front-end**: Streamlit
- **Serving API**: FastAPI + Uvicorn

## Links

- [📓 Notebook](https://github.com/luis-fer-333/portfolio/blob/main/capstones/Heart_Disease_MLOps/Heart_Disease_MLOps_Deployment.ipynb)
- [📁 Project folder (includes `api.py`, `app_api.py`, `embedido.py`)](https://github.com/luis-fer-333/portfolio/tree/main/capstones/Heart_Disease_MLOps)
