---
title: "Dog Breed Classification — CNN from Scratch vs. Transfer Learning"
date: 2025-01-15
draft: false
weight: 11
tags: ["Deep Learning", "CNN", "TensorFlow", "Transfer Learning", "Inception", "Computer Vision"]
categories: ["Deep Learning"]
summary: "74-class fine-grained dog breed classifier progressing from a VGG-style CNN to InceptionV3 with fine-tuning. Clear case study in why transfer learning wins on small datasets."
featured: false
---

## What it covers

A benchmarked comparison of four deep learning approaches on a 74-class fine-grained dog breed dataset (12,891 images):

1. **CNN from scratch** — VGG-style stacked convolutions + max pooling
2. **Tuned CNN** — adds Dropout regularization and an additional conv block
3. **Transfer learning with InceptionV3** — frozen ImageNet backbone with a trainable head
4. **Data augmentation** — flips and contrast on top of the scratch CNN

## Headline result

- **Scratch CNN**: ~5-7% validation accuracy (barely above chance on 74 classes)
- **Tuned CNN with Dropout**: ~11% validation accuracy
- **InceptionV3 fine-tuned**: **~96% validation accuracy**

## Takeaway

On a 13k-image dataset with 74 classes, transfer learning isn't an optimization — it's the only viable approach. The scratch CNN simply doesn't have enough capacity relative to the data to learn useful representations. ImageNet pretraining gives InceptionV3 the visual prior it needs to adapt quickly to the target task.

Data augmentation on the scratch CNN actually made things *worse* — because the model was too shallow to benefit from distributional variety. A cautionary tale on the "always augment" reflex.

## Stack

- **Framework**: TensorFlow / Keras
- **Data pipeline**: `tf.data.Dataset`
- **Environment**: Google Colab with GPU

## Links

- [📓 Notebook](https://github.com/luis-fer-333/portfolio/blob/main/capstones/Dog_Breed_Classification/Dog_Breed_Classification_Deep_Learning.ipynb)
- [📁 Project folder](https://github.com/luis-fer-333/portfolio/tree/main/capstones/Dog_Breed_Classification)
