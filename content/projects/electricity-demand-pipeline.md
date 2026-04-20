---
title: "Spanish Electricity Demand — Time-Series Pipeline with InfluxDB + Forecasting"
date: 2025-05-01
draft: false
weight: 6
tags: ["Time-series", "InfluxDB", "Forecasting", "ETL", "Docker", "Prophet", "Darts"]
categories: ["Analytics Engineering"]
summary: "A continuous ingestion pipeline for Spanish grid demand with InfluxDB storage and Prophet-based day-ahead forecasting. Includes a dashboard for real vs forecast visualization."
featured: false
---

## The problem

Build a prototype real-time electricity demand monitoring system. Extract hourly data from Spain's grid operator (Red Eléctrica de España), land it in InfluxDB, and produce day-ahead forecasts that feed back into the same dashboard.

## Architecture

**Two-part project** — Part 1 handles ingestion; Part 2 handles forecasting.

```
┌───────────────────────────────┐
│ Red Eléctrica public API      │
│ - /demandaGeneracionPeninsula │
│ - /prevProgPeninsula          │
└──────────────┬────────────────┘
               ▼ Python requests
     ┌─────────────────────────┐
     │  pandas transformation   │
     │  - parse JSON            │
     │  - Madrid → UTC          │
     │  - hourly aggregation    │
     └──────────────┬──────────┘
                    ▼
         ┌────────────────────┐
         │   InfluxDB 2.x     │
         │   bucket: capstone7│
         │   measurement:     │
         │      demand        │
         │   fields:          │
         │      RealDemand    │
         │      ForecastREE   │
         │      CP7Forecast   │
         └──────────┬─────────┘
                    ▼
         ┌────────────────────┐
         │ InfluxDB Dashboard │
         │ - Graph panel      │
         │ - Table panel      │
         │ - Gauge panel      │
         └────────────────────┘
```

## Key decisions

### Right tool for right data shape

Time-series databases aren't a novelty — they're purpose-built for high-cardinality append-heavy workloads with time-range queries. InfluxDB handles this hourly demand stream more efficiently than PostgreSQL would, and exposes Flux for window aggregation at query time.

### Timezone conversion at ingestion, not at query time

The API returns values in Madrid local time. DST transitions happen twice a year. Converting to UTC *during ingestion* means downstream queries don't have to think about timezones. InfluxDB stores everything in UTC; Flux queries are always consistent.

### Idempotent backfill via persisted `ingested` set

Daily ingestion is driven by a per-day loop. A `pickle` file stores the set of already-ingested days. The loop:

1. Reads the set
2. Fetches any missing days up to today (excluding today, which is partial)
3. Writes to InfluxDB (upserts by measurement/tag/timestamp anyway)
4. Updates the set and re-persists

If the loop crashes mid-run, restart is idempotent — already-ingested days are skipped, only missing days pull from the API.

### Forecast model writes back to the same series

Part 2 trains a [Darts](https://github.com/unit8co/darts) Prophet model on ingested `RealDemand` history, then writes day-ahead forecasts into the same `demand` measurement under field `CP7Forecast`. The existing dashboard just picks up the new field automatically — no schema change.

### Rolling-origin evaluation

The model is evaluated daily: for each test day, train on all data up to that day and forecast 24 hours ahead. This mirrors how the model would actually be used in production — always forecasting "tomorrow" from "everything we know today."

## Results

- **Ingestion**: stable continuous pull with automatic catch-up
- **Dashboard**: Real demand, REE's own forecast, and our forecast overlaid — lets us benchmark against the grid operator's model
- **Forecast quality**: comparable to REE's own forecast at short horizons

## Stack

- **Ingestion**: Python + `requests` + pandas (timezone-aware datetime handling)
- **Storage**: InfluxDB 2.x (Docker-composed locally)
- **Forecasting**: Darts + Prophet
- **Dashboarding**: InfluxDB UI (Flux queries for Graph/Table/Gauge panels)
- **Dev environment**: Docker Compose (InfluxDB + Jupyter)

## Links

- [📓 Part 1: Ingestion](https://github.com/luis-fer-333/portfolio/blob/main/capstones/Electricity_Demand_Forecasting/Electricity_Demand_InfluxDB_Ingestion.ipynb)
- [📓 Part 2: Forecasting](https://github.com/luis-fer-333/portfolio/blob/main/capstones/Electricity_Demand_Forecasting/Electricity_Demand_Forecasting.ipynb)
- [📁 Project folder](https://github.com/luis-fer-333/portfolio/tree/main/capstones/Electricity_Demand_Forecasting)
