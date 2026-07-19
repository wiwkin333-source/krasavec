#!/bin/bash
# ============================================================
# Video optimization script for ГРАВИКОТ
# 1. Replace click video with uploaded one (matching original resolution ~602x766)
# 2. Remove audio from ALL videos
# 3. Optimize for web: faststart, proper CRF, webm VP9/opus-free
# ============================================================

set -e

PUBLIC="/home/z/my-project/public/assets"
UPLOADED="/tmp/uploaded_assets/видео click"
BACKUP="$PUBLIC/backup_original"

# Create backup of original videos
mkdir -p "$BACKUP"
echo "📦 Backing up original videos..."
cp -n "$PUBLIC/click.mp4" "$BACKUP/" 2>/dev/null || true
cp -n "$PUBLIC/click.webm" "$BACKUP/" 2>/dev/null || true
cp -n "$PUBLIC/hero.mp4" "$BACKUP/" 2>/dev/null || true
cp -n "$PUBLIC/hero.webm" "$BACKUP/" 2>/dev/null || true
echo "  ✓ Originals backed up to $BACKUP"

# ============================================================
# STEP 1: Process CLICK video from uploaded file
# ============================================================
echo ""
echo "🎬 Processing CLICK video (replace + remove audio + optimize)..."

# Use the 720p version as source (closest to original 602x766)
# It's 636x612 — we'll keep aspect ratio as-is since original was also ~portrait
CLICK_SRC="$UPLOADED/IMG_8432_720p.mp4"

echo "  Source: $(basename "$CLICK_SRC")"

# click.mp4 — H.264, no audio, web-optimized (faststart), CRF 23 for good quality/size balance
echo "  Creating click.mp4 (H.264, no audio, faststart)..."
ffmpeg -y -i "$CLICK_SRC" \
  -an \
  -c:v libx264 \
  -profile:v high \
  -level 4.1 \
  -pix_fmt yuv420p \
  -crf 23 \
  -preset slow \
  -movflags +faststart \
  -g 30 \
  -keyint_min 15 \
  -refs 3 \
  "$PUBLIC/click.mp4" 2>/dev/null

# click.webm — VP9, no audio, web-optimized
echo "  Creating click.webm (VP9, no audio)..."
ffmpeg -y -i "$CLICK_SRC" \
  -an \
  -c:v libvpx-vp9 \
  -crf 32 \
  -b:v 0 \
  -quality good \
  -cpu-used 2 \
  -row-mt 1 \
  -pix_fmt yuv420p \
  -g 30 \
  "$PUBLIC/click.webm" 2>/dev/null

echo "  ✓ CLICK video done"

# ============================================================
# STEP 2: Process HERO video — remove audio, optimize
# ============================================================
echo ""
echo "🎬 Processing HERO video (remove audio + optimize)..."

# hero.mp4 — re-encode without audio, add faststart if missing
echo "  Creating hero.mp4 (H.264, no audio, faststart)..."
ffmpeg -y -i "$PUBLIC/hero.mp4" \
  -an \
  -c:v libx264 \
  -profile:v high \
  -level 4.1 \
  -pix_fmt yuv420p \
  -crf 23 \
  -preset slow \
  -movflags +faststart \
  -g 15 \
  -keyint_min 5 \
  -refs 3 \
  "$PUBLIC/hero_new.mp4" 2>/dev/null
mv "$PUBLIC/hero_new.mp4" "$PUBLIC/hero.mp4"

# hero.webm — VP9, no audio
echo "  Creating hero.webm (VP9, no audio)..."
ffmpeg -y -i "$BACKUP/hero.webm" \
  -an \
  -c:v libvpx-vp9 \
  -crf 32 \
  -b:v 0 \
  -quality good \
  -cpu-used 2 \
  -row-mt 1 \
  -pix_fmt yuv420p \
  -g 15 \
  "$PUBLIC/hero_new.webm" 2>/dev/null
mv "$PUBLIC/hero_new.webm" "$PUBLIC/hero.webm"

echo "  ✓ HERO video done"

# ============================================================
# SUMMARY
# ============================================================
echo ""
echo "=========================================="
echo "📊 RESULTS:"
echo "=========================================="
for f in click.mp4 click.webm hero.mp4 hero.webm; do
  SIZE=$(stat -f%z "$PUBLIC/$f" 2>/dev/null || stat -c%s "$PUBLIC/$f" 2>/dev/null)
  KB=$((SIZE / 1024))
  
  # Get video info
  INFO=$(ffprobe -v quiet -print_format json -show_format -show_streams "$PUBLIC/$f" 2>/dev/null | python3 -c "
import sys,json
d=json.load(sys.stdin)
s=d['streams'][0]
f2=d['format']
audio = 'HAS AUDIO!' if any(st['codec_type']=='audio' for st in d['streams']) else 'no audio ✓'
print(f'{s[\"width\"]}x{s[\"height\"]}, {f2[\"duration\"]}s, {s[\"codec_name\"]}, {audio}')
" 2>/dev/null)
  
  echo "  $f: ${KB}KB — $INFO"
done

echo ""
echo "✅ All videos processed successfully!"
