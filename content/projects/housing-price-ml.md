---
title: "Housing Price Analysis — Regression, Explainability, and Unsupervised Learning"
date: 2025-02-01
draft: false
weight: 9
tags: ["Regression", "Random Forest", "SHAP", "PCA", "t-SNE", "Feature Engineering", "ML"]
categories: ["Machine Learning"]
summary: "A two-part project on the Ames Housing dataset covering data prep, Ridge/Random Forest/KNN modeling, SHAP/PDP explainability, PCA/t-SNE, and Gaussian mixture clustering."
featured: false
---

## What it covers

Two-notebook project on the Ames Housing dataset:

- **Part 1 — Data Preparation & Exploration**: feature type classification, ordinal encoding, missing-value imputation, correlation analysis
- **Part 2 — Modeling & Analysis**: Ridge with hyperparameter tuning, Decision Tree regression, Random Forest with feature importance, KNN with standardization, log-transform feature engineering, outlier detection, SHAP force plots + global SHAP summary, Partial Dependence Plots, PCA, t-SNE, Gaussian Mixture clustering

## Why it matters

This is the methodological-depth piece of the portfolio — the project where every step is done by the book:

- Separate training-dependent preprocessing (scalers, imputers) from training-independent steps
- Ridge vs. RF vs. KNN with the same preprocessing pipeline — a clean comparison
- SHAP + PDP as complementary explainability techniques (global vs. local)
- Feature engineering (log transforms) drops RMSE visibly
- Unsupervised analysis (PCA, t-SNE, GMM) for outlier detection and regime analysis

## Links

- [📓 Part 1: Data Preparation & Exploration](https://github.com/luis-fer-333/portfolio/blob/main/Housing_Price_Analysis_Part1.ipynb)
- [📓 Part 2: Modeling & Analysis](https://github.com/luis-fer-333/portfolio/blob/main/Housing_Price_Analysis_Part2.ipynb)
