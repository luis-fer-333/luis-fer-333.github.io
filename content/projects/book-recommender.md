---
title: "Book Recommender — Hybrid Content + Collaborative Filtering"
date: 2025-06-15
draft: false
weight: 10
tags: ["Recommender", "TF-IDF", "Embeddings", "ChromaDB", "SVD", "NLP"]
categories: ["Machine Learning"]
summary: "A hybrid book recommender combining TF-IDF, sentence embeddings, and SVD-based collaborative filtering on the goodbooks-10k dataset."
featured: false
---

## What it covers

Three recommender approaches compared on the same 10,000-book dataset:

1. **TF-IDF similarity** — classical bag-of-words with spaCy lemmatization and cosine similarity
2. **Sentence embeddings via ChromaDB** — semantic similarity using `all-MiniLM-L6-v2`
3. **Hybrid** — content-based candidate retrieval (ChromaDB) ranked by collaborative filtering scores (`surprise` SVD)

## Key observations

- **TF-IDF matches specific terms**: Queries with strong proper nouns (e.g. "Twilight") return exact saga members
- **Embeddings capture theme**: Abstract queries like "Animal Farm" yield thematically related political allegories rather than surface-term matches
- **Hybrid beats both**: Content-based retrieval narrows the candidate set to relevant books; SVD personalizes the ranking to the target user's predicted preferences

## Stack

- **NLP preprocessing**: spaCy (`en_core_web_sm`)
- **Classical similarity**: scikit-learn `TfidfVectorizer` + `cosine_similarity`
- **Embedding search**: ChromaDB (sentence transformers under the hood)
- **Collaborative filtering**: `surprise` library — SVD matrix factorization

## Links

- [📓 Notebook](https://github.com/luis-fer-333/portfolio/blob/main/capstones/Capstone_VIII/Book_Recommender_System.ipynb)
- [📁 Project folder](https://github.com/luis-fer-333/portfolio/tree/main/capstones/Capstone_VIII)
