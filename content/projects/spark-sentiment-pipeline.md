---
title: "Sentiment Analysis at Scale — PySpark on AWS"
date: 2025-03-01
draft: false
weight: 5
tags: ["PySpark", "AWS Glue", "S3", "ML Pipeline", "MLlib", "Parquet"]
categories: ["Analytics Engineering"]
summary: "A distributed ML pipeline processing 17M Amazon reviews with PySpark MLlib on AWS Glue — including S3 medallion storage, feature engineering, and model serialization for batch inference."
featured: false
---

## The problem

Train a binary sentiment classifier on the full Amazon Reviews dataset (~17M reviews) using PySpark MLlib on AWS Glue, with the trained pipeline persisted to S3 for downstream batch inference.

## Architecture

**Two-notebook split** — training (notebook 1) and inference (notebook 2) separated by the S3 model artifact.

```
┌─────────────────────────────┐
│ amazon-reviews-pds-parquet  │
│ (~17M reviews, partitioned) │
└──────────────┬──────────────┘
               ▼
       ┌──────────────────┐
       │  Electronics     │  .filter(product_category == "Electronics")
       │  subset (3.1M)   │  .repartition(32)
       └─────────┬────────┘
                 ▼ (write to own S3 bucket)
       ┌──────────────────┐
       │  s3://.../       │
       │  electronics/    │
       └─────────┬────────┘
                 ▼
     ┌────────────────────┐
     │ Feature pipeline   │  Tokenizer → StopWordsRemover
     │                    │  → HashingTF + IDF (or Word2Vec)
     └─────────┬──────────┘
               ▼
     ┌────────────────────┐
     │  LogisticRegression│  → fit, evaluate on 30% test split
     │  or DecisionTree   │
     └─────────┬──────────┘
               ▼
     ┌────────────────────┐
     │  Model serialized  │
     │  to S3 (.save)     │
     └─────────┬──────────┘
               ▼
     ┌────────────────────┐
     │ Inference notebook │  → load model from S3
     │                    │  → batch score test set
     │                    │  → AUC evaluation
     └────────────────────┘
```

## Key decisions

### Filter and repartition before caching

Starting from 17M rows, the work happens on a 3.1M Electronics slice. Filtering reduces scan volume; `repartition(32)` sets a reasonable file size for re-reads. Only *after* those two operations does the DataFrame get cached — avoids caching data we'll never touch.

### Write filtered data to our own S3 bucket

Public datasets have latency and throughput constraints. Writing the filtered slice to our own bucket gives stable, fast reads for all downstream work.

### Binary target from the ordinal star rating

`star_rating >= 3 → sentiment = 1`, else 0. Simple definition that lets us use standard binary classification metrics (AUC, precision/recall at thresholds).

### Split the pipeline at the serialization boundary

Training and inference notebooks are deliberately separate. The only dependency between them is the serialized model artifact in S3 — same contract a production system would have. Training can be retrained independently; inference can be re-run for new data without retraining.

### Evaluate on a persisted test set, not a fresh split

Before training, the 30% test partition is written to `electronics_test/` in S3. That guarantees training and inference notebooks see the same held-out data — reproducible evaluation even across separate sessions.

## Stack

- **Compute**: AWS Glue (Spark)
- **Storage**: S3 Parquet
- **Framework**: PySpark MLlib (`Tokenizer`, `StopWordsRemover`, `HashingTF`, `IDF`, `Word2Vec`, `LogisticRegression`)
- **Evaluation**: `BinaryClassificationEvaluator` → AUC

## Links

- [📓 Training notebook](https://github.com/luis-fer-333/portfolio/blob/main/capstones/Capstone_XII/Sentiment_Analysis_Spark_Training.ipynb)
- [📓 Inference notebook](https://github.com/luis-fer-333/portfolio/blob/main/capstones/Capstone_XII/Sentiment_Analysis_Spark_Inference.ipynb)
- [📁 Project folder](https://github.com/luis-fer-333/portfolio/tree/main/capstones/Capstone_XII)
