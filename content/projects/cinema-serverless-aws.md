---
title: "Cinema — Serverless AWS Application"
date: 2025-04-15
draft: false
weight: 12
tags: ["AWS", "Lambda", "DynamoDB", "API Gateway", "S3", "Serverless", "Event-driven"]
categories: ["Cloud & Backend"]
summary: "An event-driven serverless application on AWS: scheduled Lambda polling a third-party API, S3 event-triggered DynamoDB sync, and API Gateway endpoints for queries."
featured: false
---

## What it covers

A small-but-real serverless architecture on AWS tying together five services:

- **Scheduled Lambda** polls the TMDb `now_playing` endpoint every 24 hours via EventBridge
- **S3** stores each API response as a date-partitioned JSON object
- **S3 ObjectCreated trigger** fires a second Lambda that upserts into DynamoDB
- **DynamoDB table** with a Global Secondary Index on `(year_month, rating)` supports both lookup and range queries
- **API Gateway** exposes two REST endpoints (`/list/{year}/{month}`, `/movies/{id}`) backed by Lambda handlers
- **CloudWatch** dashboard for operational monitoring

## AE-adjacent takeaways

- **Medallion-style thinking** applies to event-driven data too — raw JSON in S3 is the "raw" layer, DynamoDB is the "silver" analytical layer
- **Lambda concurrency limits matter** — AWS Academy's 10-concurrent cap meant reserved concurrency of 1 per function. Production workloads have the same concern at a larger scale
- **Lambda layers for heavier dependencies** — the `requests` library isn't in Lambda's default runtime, so it ships as a layer

## Stack

- **AWS**: S3, DynamoDB, Lambda, API Gateway (REST), EventBridge, CloudWatch
- **Python**: `boto3`, `requests`
- **Validation**: IPyWidgets interactive tester hitting the deployed API

## Links

- [📓 Notebook](https://github.com/luis-fer-333/portfolio/blob/main/capstones/Capstone_XI/Cinema_Serverless_AWS_App.ipynb)
- [📁 Project folder](https://github.com/luis-fer-333/portfolio/tree/main/capstones/Capstone_XI)
