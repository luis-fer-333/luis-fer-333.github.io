---
title: "Movie Database ETL Pipeline — Multi-Source Ingestion to SQLite"
date: 2024-12-01
draft: false
weight: 2
tags: ["ETL", "REST API", "MongoDB", "SQLite", "SQL", "Python", "Pandas"]
categories: ["Analytics Engineering"]
summary: "An end-to-end ETL pipeline that ingests movie metadata from IMDb bulk files and a REST API, stages it in MongoDB, and lands it in a normalized relational schema with foreign keys."
featured: true
---

## The problem

Build a movie analytics database from scratch by combining two very different data sources: IMDb's bulk TSV exports and TMDb's REST API. The output needs to be a properly normalized relational schema with foreign keys — queryable by any standard BI tool.

## Architecture

```
┌──────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ IMDb TSV.GZ  │    │   TMDb REST API  │    │  CIDaeN Mongo    │
│  (8M titles) │    │ (movies, credits)│    │  Data API (people)│
└──────┬───────┘    └────────┬─────────┘    └─────────┬────────┘
       │                     │                        │
       ▼                     ▼                        ▼
   ┌─────────────────────────────────────────────────────┐
   │   Python + pandas (extraction, flattening, filter)  │
   └───────────────────────────┬─────────────────────────┘
                               ▼
                   ┌───────────────────────┐
                   │  MongoDB Atlas staging │
                   │   (dbmovies database)  │
                   │   movies / credits /   │
                   │        people          │
                   └───────────┬────────────┘
                               ▼
                   ┌───────────────────────┐
                   │  pandas normalization  │
                   │  (explode, merge, FK)  │
                   └───────────┬────────────┘
                               ▼
                   ┌───────────────────────┐
                   │  SQLite relational DB  │
                   │   MOVIES (PK)          │
                   │   PEOPLE (PK)          │
                   │   CREDITS (FK × 2)     │
                   └────────────────────────┘
```

## Key decisions and trade-offs

### Filter early, enrich later

The IMDb dump has ~8M titles. Filtering to `titleType == 'movie'` and `numVotes > 50,000` gets us to ~4,000 movies before making a single API call. Each TMDb call takes ~0.5s — skipping this filter would mean a 4,000-minute enrichment run.

### Cache API responses to JSON

The TMDb enrichment loop caches results to `data/backup/movie_data.json`. If the file exists, load from disk; if not, fetch and persist. This turns a one-off 30-minute run into a 2-second no-op on re-execution.

### Two IDs, one source of truth

TMDb exposes both its own `id` and the IMDb `id` per movie. Throughout the pipeline I standardize on `imdb_id` — one less source of join-key confusion downstream. Replacing TMDb IDs at ingestion time saves hours of debugging later.

### SQLite can't `ALTER TABLE ADD CONSTRAINT`

Foreign keys need to exist at table-creation time in SQLite. pandas' `to_sql` can't declare them. Solution: raw SQL `CREATE TABLE` statements define the schema (including FK constraints), then `to_sql(if_exists='append')` bulk-loads from DataFrames. The constraint validation happens at load time — rows with orphan foreign keys fail fast.

### Reference integrity enforcement

Before the SQL load, `df_credits` is filtered to drop any row whose `people_id` isn't present in `df_people`. This is data-quality-gate-at-the-layer-boundary thinking — bronze to silver should catch referential issues, not push them downstream.

## Example analytical queries

```sql
-- Top 10 highest-rated 2023 movies
SELECT primaryTitle, averageRating, numVotes
FROM MOVIES
WHERE startYear = 2023 AND averageRating > 7.5
ORDER BY averageRating DESC
LIMIT 10;

-- Director per movie
SELECT m.primaryTitle, p.name AS director
FROM MOVIES m
JOIN CREDITS c ON c.imdb_id = m.imdb_id AND c.rol = 'director'
JOIN PEOPLE p ON p.people_id = c.people_id
ORDER BY m.startYear DESC;

-- Top 10 cast members by total revenue
SELECT p.name, SUM(m.revenue) AS total_revenue
FROM CREDITS c
JOIN MOVIES m ON m.imdb_id = c.imdb_id
JOIN PEOPLE p ON p.people_id = c.people_id
WHERE c.rol = 'cast'
GROUP BY p.people_id, p.name
ORDER BY total_revenue DESC
LIMIT 10;
```

## Results

- **Pipeline output**: 3 normalized SQL tables (`MOVIES`, `PEOPLE`, `CREDITS`) with FK integrity
- **Scale**: ~4,000 movies, ~10,000 people, ~18,000 credit relationships
- **Query latency**: sub-second for the analytical queries above

## Stack

- **Ingestion**: Python + `requests` + pandas
- **Staging**: MongoDB Atlas (document store for raw API responses)
- **Normalization**: pandas (explode, merge, type coercion)
- **Warehouse**: SQLite with SQLAlchemy (FK constraints enforced)

## Links

- [📓 Notebook (portfolio version)](https://github.com/luis-fer-333/portfolio/blob/main/capstones/Capstone_II/Movie_Database_ETL_Pipeline.ipynb)
- [📁 Full project folder](https://github.com/luis-fer-333/portfolio/tree/main/capstones/Capstone_II)
