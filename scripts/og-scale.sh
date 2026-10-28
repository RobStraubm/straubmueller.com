#!/bin/sh
# Scales the captures of scripts/og-capture.js (1600×840) to the 1200×630 preview cards in public/og/.
set -e
mkdir -p public/og
for f in befund/og-raw/*.png; do
  ffmpeg -loglevel error -y -i "$f" -vf scale=1200:630:flags=lanczos -q:v 3 "public/og/$(basename "$f" .png).jpg"
done
