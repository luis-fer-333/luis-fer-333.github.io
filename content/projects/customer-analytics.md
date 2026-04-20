---
title: "Customer Analytics — Churn, CLV & Segmentation"
date: 2024-11-15
draft: false
weight: 8
tags: ["scikit-learn", "Pipeline", "GridSearchCV", "KMeans", "RFM", "ML"]
categories: ["Machine Learning"]
summary: "Three ML-driven marketing projects in one notebook — telco churn classification, customer lifetime value regression, and RFM-based customer segmentation."
featured: false
---

## What it covers

Three ML use cases built on a shared scikit-learn foundation:

1. **Churn prevention** — binary classification to flag at-risk telco customers (logistic regression, decision tree, SVM with GridSearchCV hyperparameter tuning)
2. **Customer Lifetime Value** — regression to estimate long-term customer revenue (linear regression vs. depth-tuned decision tree)
3. **Customer segmentation** — KMeans clustering on RFM (Recency, Frequency, Monetary) features with elbow-method k selection

## AE-adjacent themes

- **ColumnTransformer** for parallel numeric/categorical preprocessing
- **Pipeline discipline** — separate pandas-level cleanup (type casts, ordinal encoding) from scikit-learn's fit-dependent transforms (imputation, scaling)
- **Classification threshold tuning** as a business decision, not a default
- **AUC** for threshold-independent model comparison

## Key decisions

- Split preprocessing between pandas (column-level, training-independent) and sklearn Pipeline (fit-dependent). Separation avoids subtle data leakage and makes the whole thing reproducible on new data.
- Manual threshold sweep (0.25, 0.5, 0.75) to discuss precision/recall tradeoffs in business terms — retention campaigns are cheaper than losing customers, so bias toward recall.
- RFM features were log-transformed and standardized before clustering — KMeans is distance-based, skew destroys cluster geometry.

## Results

- **Churn model**: SVM wins on AUC (~0.85)
- **CLV**: depth-tuned tree (10 → 0.78 test R²) beats unrestricted tree and linear regression
- **Segmentation**: k=4 clusters map cleanly to {premium / growing / occasional / churned}

## Links

- [📓 Notebook](https://github.com/luis-fer-333/portfolio/blob/main/capstones/Customer_Analytics_Churn_CLV/Customer_Analytics_Churn_CLV_Segmentation.ipynb)
- [📁 Project folder](https://github.com/luis-fer-333/portfolio/tree/main/capstones/Customer_Analytics_Churn_CLV)
