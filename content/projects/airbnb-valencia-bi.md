---
title: "Airbnb Valencia — Cloud BI with Supabase + Preset"
date: 2025-06-01
draft: false
weight: 3
tags: ["BI", "Supabase", "Preset", "Superset", "PostgreSQL", "SQL", "Dashboards"]
categories: ["Analytics Engineering"]
summary: "A full BI stack analyzing 8,847 Airbnb listings — from raw CSV load through SQL modeling on Supabase to stakeholder dashboards in Preset."
featured: true
---

## The problem

Analyze the Valencia Airbnb market using production-style BI infrastructure: cloud PostgreSQL as the warehouse, a modern BI tool as the front-end. Two stakeholders — a prospective investor and an established property manager — each need a tailored dashboard answering their specific questions.

## Stack

- **Warehouse**: Supabase-hosted PostgreSQL (Session Pooler connection)
- **BI tool**: [Preset](https://preset.io/) (managed Apache Superset)
- **Source**: [Inside Airbnb](https://insideairbnb.com/get-the-data/) — 8,847 listings + 416,389 reviews for Valencia
- **Orchestration/ingest**: Python + `psycopg2` + pandas

## Architecture

```
┌──────────────────┐
│ Inside Airbnb    │
│ CSV.gz downloads │
└──────────┬───────┘
           ▼
┌──────────────────┐    COPY / psycopg2
│  Supabase Postgres│◄─────────────────
│  apartamentos    │
│  reviews         │
└──────────┬───────┘
           ▼      CREATE TABLE AS SELECT
   ┌──────────────────┐
   │ apartamentos_clean│    (proper types, selected cols)
   │ reviews_clean     │
   └──────────┬───────┘
              ▼
      ┌──────────────────┐
      │  Preset workspace │
      │  SQL Lab          │
      │  2 dashboards     │
      └──────────────────┘
```

## Key decisions and trade-offs

### Raw-to-clean modeled with `CREATE TABLE AS`

Instead of storing raw Airbnb data and wrangling types at query time in Preset, I materialized clean tables in Postgres via `CREATE TABLE AS SELECT`. Typed columns, scrubbed sentinels (`\N`, `nan`, empty strings), currency stripping from `price`, and `host_is_superhost` binarization all happen once at load rather than repeatedly per query.

```sql
CREATE TABLE public.apartamentos_clean AS
SELECT
    id::BIGINT AS id,
    neighbourhood_cleansed::VARCHAR(100) AS neighbourhood_cleansed,
    CAST(NULLIF(NULLIF(NULLIF(latitude, '\N'), ''), 'nan') AS FLOAT) AS latitude,
    CASE
        WHEN price IN ('\N', '', 'nan') THEN NULL
        ELSE CAST(REPLACE(REPLACE(price, '$', ''), ',', '') AS NUMERIC(10,2))
    END AS price,
    CASE
        WHEN host_is_superhost IN ('t', 'true', 'True', 'TRUE') THEN TRUE
        ELSE FALSE
    END AS host_is_superhost,
    -- ... 20+ other casts
FROM public.apartamentos;
```

This is the standard analytics-engineering pattern: **push data-quality logic as close to the source as possible**, so downstream queries (and BI tool users) get clean data by default.

### Business-question framing, not just "SQL practice"

Every analytical query answers a concrete business question:

- Where are the most expensive listings by property type?
- How has review volume evolved over time?
- Which neighborhoods offer the best value-for-money?
- Where are large-portfolio hosts concentrated?
- Which neighborhoods grew fastest in the last 3 years?

Each query is paired with a chart-type recommendation and a written analysis — because "what chart to build" is half the AE job.

### Two dashboard personas, two different lens

**Investor dashboard** answers "where to invest?":

- Revenue per listing by neighborhood (choropleth map)
- Review volume and average price over time (time series)
- Rating vs. review count by neighborhood (scatter)
- Year-over-year growth in supply (stacked bar)

**Property manager dashboard** answers "how is my portfolio performing?":

- Listing-level detail table with host filters
- Per-listing control panel (reviews, rating, price)
- Price vs. rating scatter to surface outliers

Same underlying dataset. Different aggregations. Different questions. Different storytelling.

## Notable findings

- **2020 COVID crater**: Review volume cratered mid-2020, recovered through 2021, and now exceeds pre-pandemic levels
- **Superhost paradox**: Superhosts charge *less* on average than non-Superhosts — possibly optimizing for occupancy over premium pricing
- **Fallas effect**: March is a consistent review-volume peak across all years — a measurable tourism signal for the local event

## Dashboard outputs

The final PDF exports of both dashboards are in the `Resultados/` folder alongside the notebook.

## Links

- [📓 Notebook (portfolio version)](https://github.com/luis-fer-333/portfolio/blob/main/capstones/Airbnb_Valencia_BI/Airbnb_Valencia_BI_Dashboards.ipynb)
- [📁 Full project folder (includes dashboard PDFs)](https://github.com/luis-fer-333/portfolio/tree/main/capstones/Airbnb_Valencia_BI)
