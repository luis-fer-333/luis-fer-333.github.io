#!/usr/bin/env bash
# Local preview helper
# - installs hugo via brew if missing
# - clones the PaperMod theme if not already present
# - launches hugo server on http://localhost:1313

set -euo pipefail

cd "$(dirname "$0")"

# 1. Hugo installed?
if ! command -v hugo >/dev/null 2>&1; then
  echo "Hugo is not installed."
  if command -v brew >/dev/null 2>&1; then
    echo "Installing via Homebrew..."
    brew install hugo
  else
    echo "Please install Hugo from https://gohugo.io/installation/"
    exit 1
  fi
fi

# 2. Theme installed?
if [ ! -d "themes/PaperMod" ]; then
  echo "Installing PaperMod theme..."
  git clone --depth=1 https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
fi

# 3. Launch dev server
echo ""
echo "Starting Hugo dev server at http://localhost:1313"
echo "Press Ctrl+C to stop."
echo ""
hugo server -D --disableFastRender
