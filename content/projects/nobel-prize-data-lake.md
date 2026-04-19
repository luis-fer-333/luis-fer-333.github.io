---
title: "Nobel Prize Data Lake — Medallion Architecture on AWS"
date: 2025-04-01
draft: false
weight: 1
tags: ["Data Lake", "AWS", "Lambda", "S3", "Prefect", "ETL", "Medallion", "Python"]
categories: ["Analytics Engineering"]
summary: "A medallion-architecture data lake on AWS S3 with Prefect-orchestrated ETL Lambdas — raw API responses → bronze joins → silver analytics table."
featured: true
---

## The problem

Build an end-to-end serverless data lake that ingests Nobel Prize data from a public REST API and progressively refines it through medallion layers until it's ready for analytics. The pipeline needs to run on a schedule, support bulk backfills, and survive intermittent failures.

## Solution architecture

**Medallion layout on S3**

- `raw/` — untouched API responses (or lightly flattened Parquet)
- `bronze/` — cleaned, joined, type-cast wide tables
- `silver/` — analytics-ready tables with derived features

**Component flow**

```
                    ┌───────────────────────────┐
                    │ Prefect Flow (daily 00:00)│
                    └──────────────┬────────────┘
                                   ▼
          ┌──────────────────────────────────────────┐
          │ extractNobelPrizes Lambda (per category) │
          │   → writes raw/nobelPrizes/<cat>-<yr>    │
          └──────────────────────┬───────────────────┘
                                 ▼ (map over laureate IDs)
          ┌──────────────────────────────────────────┐
          │ extractLaureate Lambda (per laureate)    │
          │   → writes raw/laureates/<id>.parquet    │
          └──────────────────────┬───────────────────┘
                                 ▼
                ┌────────────────────────────────┐
                │ bronze_laureates Lambda        │
                │   inner-join + explode + cast  │
                │   → bronze/bronze_laureates    │
                └────────────────┬───────────────┘
                                 ▼
                ┌────────────────────────────────┐
                │ silver_laureates Lambda        │
                │   snake_case + fraction parse  │
                │   + prize_amount_real feature  │
                │   → silver/silver_laureates    │
                └────────────────────────────────┘
```

**Idempotency**: Each Lambda is idempotent on its output path. Re-running the flow overwrites the same Parquet file rather than producing duplicates. Prefect's `map` operator fans out the per-laureate Lambda calls, so the backfill parallelizes naturally.

## Key decisions and trade-offs

### Parquet at the `raw/` layer instead of JSON

The Nobel API returns nested JSON. Parquet is the expected format in medallion architectures — but its Python writer doesn't handle arbitrary nested structures. Rather than dropping to JSON at `raw/` and adding a raw-to-raw_processed step, I applied light flattening *during* extraction and wrote Parquet directly. This keeps the layer count at three, at the cost of some fidelity loss at the raw layer.

In a more mature pipeline, the right answer is a `raw/` tier of immutable JSON plus a `raw_processed/` tier of Parquet. I flagged this explicitly in the notebook as a known simplification.

### Bronze uses inner join, silver applies schema evolution

The bronze layer drops prizes without laureates (data quality gate at the earliest possible layer). Silver-level renames happen here too — `prizeAmount` → `prize_amount`, `awardYear` → `year`, `fileName` → `file_name`. Doing the renames at silver instead of bronze lets bronze preserve raw-schema correspondence for debugging.

### `prize_amount_real` as a silver feature

Laureates share prizes in fractions (`1/3`, `1/4`). Parsing the fraction string via `fractions.Fraction` and multiplying gives each laureate's *real* prize amount — a more useful metric than the nominal total. This is the kind of business-logic feature that belongs in silver, not bronze.

### Backfill vs. incremental

The API exposes full-history endpoints, so initial load uses those (1901–2019 data as a single Parquet dump per table). After that, the Prefect flow runs daily for the previous year only. This split — one-time bulk load vs. incremental daily — is standard data-lake practice and dramatically reduces API load.

## Results

- **Silver table**: ~1,000 laureate-prize rows with clean types and the `prize_amount_real` feature
- **Analytics answered**: top-earning laureates, spending trends over time, multi-prize winners, category breakdowns
- **Insight**: Total Nobel Prize spending has trended upward, with a notable acceleration since the 1980s

## Stack

- **AWS**: S3 (data lake), Lambda (compute), EventBridge (scheduling)
- **Orchestration**: Prefect
- **Python**: pandas, pyarrow, awswrangler, boto3
- **Lambda layer**: `AWSSDKPandas-Python312`

## Links

- [📓 Notebook (portfolio version)](https://github.com/luis-fer-333/portfolio/blob/main/capstones/Capstone_XIII/Nobel_Prize_ETL_Datalake.ipynb)
- [📁 Full project folder](https://github.com/luis-fer-333/portfolio/tree/main/capstones/Capstone_XIII)
