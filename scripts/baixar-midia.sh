#!/usr/bin/env bash
# Baixa a mídia gerada no Higgsfield para assets/, para o site não depender do CDN.
# O main.js tenta assets/ primeiro e só usa o CDN se o arquivo local não existir.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p assets
BASE="https://d2ol7oe51mr4n9.cloudfront.net/user_3KNCDGnVBc8BiyDkmJmsXiR5Lae"
curl -fL -o assets/hero-scrub.mp4  "$BASE/718c18ec-20e6-47af-b077-cc42e295dd51.mp4"
curl -fL -o assets/hero-start.webp "$BASE/3c9f542d-8d1d-47b6-9e7d-1056bcb927a3.webp"
ls -lh assets/
