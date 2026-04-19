---
title: "Formula 1 Data Analysis — Multi-Table Pandas Pipeline"
date: 2024-10-01
draft: false
weight: 7
tags: ["Pandas", "SQL-style", "Data Modeling", "Folium", "Visualization"]
categories: ["Analytics Engineering"]
summary: "A pandas-driven analysis across 13 relational CSVs (75 years of F1 history) with multi-way joins, filtering, and map-based visualization."
featured: false
---

## The problem

Analyze 75 years of Formula 1 history — drivers, races, constructors, circuits, lap times. The raw data is 13 CSV files with primary/foreign-key relationships. Answer a mix of general competitive questions plus a focused career study of driver Fernando Alonso.

## What makes this AE-relevant

Despite being a pandas project (not SQL), the work is fundamentally relational:

- **13 source tables** with PK/FK relationships
- **Multi-way joins** (driver × race × results × constructors × circuits)
- **Head-to-head analytical tables** built via `stack`/`unstack` — equivalent to pivoting in SQL
- **Filtering and aggregation** across joined result sets

The same analytical work would slot directly into a SQL warehouse. The pandas form is a stepping stone — if this project were "real," the next move would be loading the CSVs into Postgres and rewriting the analyses as CTEs.

## Representative analyses

- **All-time top 5** winners / pole-sitters / fastest-lappers
- **Average positions gained per race** (filtered by minimum-race-completions — classic pre-aggregation filter to remove small-sample noise)
- **Most-frequent DNF causes** via DataFrame × status-code lookup
- **Head-to-head: Fernando Alonso vs. rivals** — each row a race, each column a rival, each cell their position
- **Circuit-level speed ranking** via groupby-then-`apply` (top-100 fastest laps per circuit)
- **Folium map** of all circuit locations

## Key decisions

### Multi-table joins in pandas need explicit index handling

When merging with `pd.merge`, which indices carry through matters. Being explicit about `left_on` / `right_on` / `right_index=True` up front avoids end-of-query surprises — same philosophy as being explicit about JOIN predicates in SQL.

### Filter before aggregating

`df_results[df_results['statusId'] == 1]` before groupby is cheaper than groupby-then-filter. Same optimization principle as pushing `WHERE` before `GROUP BY`.

### Method chaining over intermediate variables

Several of the more complex aggregations (top-5 pole positions, average positions gained) are written as a single fluent chain. More readable than a stack of intermediate DataFrames, and mirrors how the same query would look in SQL.

## Stack

- **Data**: 13 CSVs from ergast.com, ~20MB on disk
- **Analytics**: pandas, matplotlib, Folium
- **Visualization**: horizontal bar charts, pie charts, KDE, geographic map

## Links

- [📓 Notebook](https://github.com/luis-fer-333/portfolio/blob/main/capstones/Capstone_I/Formula1_Data_Analysis.ipynb)
- [📁 Project folder](https://github.com/luis-fer-333/portfolio/tree/main/capstones/Capstone_I)
