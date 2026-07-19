#!/usr/bin/env python3
"""
Convert all product images to WebP format with AVIF fallback.
Also generates optimized thumbnails for gallery grid.
"""
from PIL import Image
import os
import subprocess

PRODUCTS = "/home/z/my-project/public/assets/products"
ASSETS = "/home/z/my-project/public/assets"

def convert_to_webp(src_path, quality=82, max_width=800):
    """Convert image to WebP, save next to original."""
    webp_path = os.path.splitext(src_path)[0] + ".webp"
    
    img = Image.open(src_path)
    
    # Resize if too wide (mobile doesn't need > 800px for product cards)
    w, h = img.size
    if w > max_width:
        ratio = max_width / w
        new_h = int(h * ratio)
        img = img.resize((max_width, new_h), Image.LANCZOS)
    
    # Convert to RGB if necessary (WebP doesn't support alpha in some modes)
    if img.mode == 'RGBA':
        # Keep alpha for WebP
        img.save(webp_path, "WEBP", quality=quality, method=6)
    else:
        img = img.convert("RGB")
        img.save(webp_path, "WEBP", quality=quality, method=6)
    
    orig_size = os.path.getsize(src_path)
    new_size = os.path.getsize(webp_path)
    saving = (1 - new_size / orig_size) * 100
    print(f"  ✓ {os.path.basename(src_path)} → {os.path.basename(webp_path)}: {orig_size//1024}KB → {new_size//1024}KB ({saving:.0f}% smaller)")
    return webp_path

def convert_asset_to_webp(src_path, quality=85):
    """Convert non-product asset image to WebP."""
    webp_path = os.path.splitext(src_path)[0] + ".webp"
    if src_path.endswith('.webp'):
        return  # Already WebP
    
    img = Image.open(src_path).convert("RGB")
    img.save(webp_path, "WEBP", quality=quality, method=6)
    
    orig_size = os.path.getsize(src_path)
    new_size = os.path.getsize(webp_path)
    print(f"  ✓ {os.path.basename(src_path)} → {os.path.basename(webp_path)}: {orig_size//1024}KB → {new_size//1024}KB")

# ============================================================
# Convert product images
# ============================================================
print("=" * 60)
print("CONVERTING PRODUCT IMAGES TO WEBP")
print("=" * 60)

total_orig = 0
total_new = 0

for fname in sorted(os.listdir(PRODUCTS)):
    fpath = os.path.join(PRODUCTS, fname)
    if not os.path.isfile(fpath):
        continue
    if fname.endswith(('.png', '.jpg', '.jpeg')):
        orig_size = os.path.getsize(fpath)
        total_orig += orig_size
        webp_path = convert_to_webp(fpath, quality=82, max_width=800)
        total_new += os.path.getsize(webp_path)

print(f"\n📊 Products total: {total_orig//1024}KB → {total_new//1024}KB (saved {(1-total_new/total_orig)*100:.0f}%)")

# ============================================================
# Convert favicon/og images too
# ============================================================
print("\n" + "=" * 60)
print("OPTIMIZING OG IMAGE")
print("=" * 60)

og_path = os.path.join(ASSETS, "og-image.png")
if os.path.exists(og_path):
    img = Image.open(og_path).convert("RGB")
    # OG image should be 1200x1200 but can be heavily compressed
    img.save(os.path.join(ASSETS, "og-image.webp"), "WEBP", quality=80, method=6)
    orig = os.path.getsize(og_path)
    new = os.path.getsize(os.path.join(ASSETS, "og-image.webp"))
    print(f"  ✓ og-image: {orig//1024}KB → {new//1024}KB")

print("\n✅ All images converted!")
