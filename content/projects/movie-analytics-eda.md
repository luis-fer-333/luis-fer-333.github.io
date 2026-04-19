---
title: "Movie Analytics — Deep EDA for Investment Decisions"
date: 2024-11-01
draft: false
weight: 4
tags: ["EDA", "SQL", "Pandas", "Statsmodels", "Seaborn", "Business Analysis"]
categories: ["Analytics Engineering"]
summary: "A deep exploratory analysis across 4,000 movies to identify the factors driving box-office success — framed around a low-budget-production investment scenario."
featured: false
---

## The problem

Given a dataset of movies enriched from IMDb and TMDb, identify which factors actually drive box-office success. Frame the analysis around a concrete business scenario: where should someone invest a limited production budget to maximize returns?

## Approach

The analysis is structured as an analyst's workflow, not a data-scientist's workflow — each section answers a specific business question with visualizations and concrete recommendations.

1. **Data inspection** — types, missingness patterns, outlier handling
2. **Budget vs. revenue** — OLS regression with statsmodels, residual diagnostics, heteroscedasticity discussion
3. **Temporal effects** — year-of-release as a latent confound, decision to restrict to post-2000 releases
4. **Genre analysis** — box plots ordered by median revenue, budget vs. revenue by genre
5. **People analysis** — directors and cast, revenue rankings, popularity correlations
6. **Low-budget segment** — genre ranking flips for budget-constrained productions

## Key analytical decisions

### Treat "popularity" as what it actually measures

`popularity` in the TMDb dataset is time-variable — recent movies score dramatically higher than older ones regardless of quality. The raw correlation with revenue is meaningful *only* when comparing films from the same time window.

**Takeaway**: Popularity is useful for cross-sectional comparison within a year, not for cumulative-career analysis.

### Rolling-window comparison to control for temporal confounds

The budget-revenue relationship has an R² of ~0.49 across the full dataset. But both variables grow with year of release. Re-running the analysis restricted to 2024 releases gives a cleaner read on the current market dynamics.

### Low-budget segment flips the genre ranking

Across all budgets, **Animation / Adventure / Family** dominate revenue. In the bottom 20% budget tier, that pattern inverts: **Horror / Thriller / Mystery** become the most profitable. High-budget genres need big marketing; low-budget genres live on concept and atmosphere.

One outlier carries much of the low-budget signal — *Paranormal Activity* achieved roughly 100x return-on-budget.

## Stack

- **Data**: 4,000+ movies from the enriched database (see [Movie Database ETL Pipeline](/projects/movie-database-etl/))
- **Analytics**: pandas, statsmodels, seaborn, scipy.stats (Mann-Whitney U)

## Links

- [📓 Notebook](https://github.com/luis-fer-333/portfolio/blob/main/capstones/Capstone_III/Movies_Exploratory_Data_Analysis.ipynb)
- [📁 Project folder](https://github.com/luis-fer-333/portfolio/tree/main/capstones/Capstone_III)
