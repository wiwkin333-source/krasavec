#!/usr/bin/env python3
"""
Generate THE MOST COMPLETE favicon pack possible from source image.
Covers: all browsers, all devices, all OS, all contexts.
"""
from PIL import Image, ImageDraw
import os
import struct
import io
import base64
import json

SRC = "/home/z/my-project/upload/ChatGPT Image 19 июл. 2026 г., 11_48_07.png"
OUT = "/home/z/my-project/public"

img = Image.open(SRC).convert("RGBA")

# Brand colors
BG_DARK = (5, 5, 16, 255)  # #050510
BG_WHITE = (255, 255, 255, 255)

def save_png(size, filename, padding=0, bg_color=None):
    """Save a PNG at given size with optional padding and background."""
    if padding > 0 and bg_color:
        pad = int(size * padding)
        canvas = Image.new("RGBA", (size, size), bg_color)
        inner_size = size - 2 * pad
        resized = img.resize((inner_size, inner_size), Image.LANCZOS)
        canvas.paste(resized, (pad, pad), resized if resized.mode == "RGBA" else None)
        canvas.save(os.path.join(OUT, filename), "PNG")
    else:
        resized = img.resize((size, size), Image.LANCZOS)
        resized.save(os.path.join(OUT, filename), "PNG")
    print(f"  ✓ {filename} ({size}x{size})")

def save_ico(sizes, filename):
    """Generate multi-size ICO file with PNG encoding."""
    ico_images = []
    for s in sizes:
        resized = img.resize((s, s), Image.LANCZOS)
        buf = io.BytesIO()
        resized.save(buf, "PNG")
        ico_images.append((s, buf.getvalue()))
    
    path = os.path.join(OUT, filename)
    with open(path, "wb") as f:
        # ICO header: reserved(2) + type(2)=1 + count(2)
        f.write(struct.pack("<HHH", 0, 1, len(ico_images)))
        offset = 6 + len(ico_images) * 16
        for s, data in ico_images:
            w = s if s < 256 else 0
            h = s if s < 256 else 0
            # Directory entry: w, h, colors, reserved, planes, bpp, size, offset
            f.write(struct.pack("<BBBBHHII", w, h, 0, 0, 1, 32, len(data), offset))
            offset += len(data)
        for s, data in ico_images:
            f.write(data)
    print(f"  ✓ {filename} (ICO: {sizes})")

def save_svg_favicon(filename):
    """Generate inline SVG favicon for modern browsers."""
    # Create a small PNG for embedding in SVG
    small = img.resize((64, 64), Image.LANCZOS)
    buf = io.BytesIO()
    small.save(buf, "PNG")
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    
    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 64 64">
  <image width="64" height="64" xlink:href="data:image/png;base64,{b64}"/>
</svg>'''
    with open(os.path.join(OUT, filename), "w") as f:
        f.write(svg)
    print(f"  ✓ {filename} (SVG inline)")

def save_svg_mask(filename):
    """Generate SVG mask icon for Safari pinned tab / macOS Touch Bar."""
    # Convert to high contrast silhouette for Safari mask
    gray = img.convert("L")
    # Threshold to create mask
    threshold = 30
    mask = gray.point(lambda x: 255 if x > threshold else 0)
    mask_rgba = mask.convert("RGBA")
    
    # Save as SVG with embedded image
    small = mask_rgba.resize((512, 512), Image.LANCZOS)
    buf = io.BytesIO()
    small.save(buf, "PNG")
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    
    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 512 512">
  <image width="512" height="512" xlink:href="data:image/png;base64,{b64}"/>
</svg>'''
    with open(os.path.join(OUT, filename), "w") as f:
        f.write(svg)
    print(f"  ✓ {filename} (SVG mask for Safari)")

def save_apple_touch(size, filename, precomposed=False):
    """Apple touch icon with rounded corners and slight padding on dark bg."""
    pad = int(size * 0.08)
    canvas = Image.new("RGBA", (size, size), BG_DARK)
    inner_size = size - 2 * pad
    resized = img.resize((inner_size, inner_size), Image.LANCZOS)
    canvas.paste(resized, (pad, pad), resized if resized.mode == "RGBA" else None)
    canvas.save(os.path.join(OUT, filename), "PNG")
    label = "precomposed" if precomposed else "regular"
    print(f"  ✓ {filename} ({size}x{size} Apple touch {label})")

def save_android_notification(filename):
    """Android notification icon - white silhouette on transparent (API 21+)."""
    white = Image.new("RGBA", img.size, (0, 0, 0, 0))
    # Make white version
    datas = img.getdata()
    new_data = []
    for item in datas:
        if item[3] > 30:  # if not very transparent
            new_data.append((255, 255, 255, item[3]))
        else:
            new_data.append((0, 0, 0, 0))
    white.putdata(new_data)
    resized = white.resize((96, 96), Image.LANCZOS)
    resized.save(os.path.join(OUT, filename), "PNG")
    print(f"  ✓ {filename} (96x96 Android notification)")

def save_og_image(filename):
    """Open Graph / social media sharing image (1200x1200)."""
    size = 1200
    pad = int(size * 0.05)
    canvas = Image.new("RGBA", (size, size), BG_DARK)
    inner_size = size - 2 * pad
    resized = img.resize((inner_size, inner_size), Image.LANCZOS)
    canvas.paste(resized, (pad, pad), resized if resized.mode == "RGBA" else None)
    canvas.save(os.path.join(OUT, filename), "PNG")
    print(f"  ✓ {filename} (1200x1200 OG image)")

def save_webmanifest():
    """PWA manifest with all icon sizes."""
    manifest = {
        "name": "ГРАВИКОТ — Лазерное ателье",
        "short_name": "ГРАВИКОТ",
        "description": "Светящиеся бокалы, сувениры и аксессуары по вашим фото",
        "icons": [
            {"src": "/android-chrome-36x36.png", "sizes": "36x36", "type": "image/png"},
            {"src": "/android-chrome-48x48.png", "sizes": "48x48", "type": "image/png"},
            {"src": "/android-chrome-72x72.png", "sizes": "72x72", "type": "image/png"},
            {"src": "/android-chrome-96x96.png", "sizes": "96x96", "type": "image/png"},
            {"src": "/android-chrome-144x144.png", "sizes": "144x144", "type": "image/png"},
            {"src": "/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"},
            {"src": "/android-chrome-256x256.png", "sizes": "256x256", "type": "image/png"},
            {"src": "/android-chrome-384x384.png", "sizes": "384x384", "type": "image/png"},
            {"src": "/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable"},
            {"src": "/favicon.svg", "sizes": "any", "type": "image/svg+xml", "purpose": "any"},
        ],
        "theme_color": "#050510",
        "background_color": "#050510",
        "display": "standalone",
        "start_url": "/",
        "scope": "/",
        "orientation": "portrait-primary",
        "lang": "ru",
        "categories": ["shopping", "lifestyle"]
    }
    path = os.path.join(OUT, "site.webmanifest")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    print("  ✓ site.webmanifest (full PWA manifest)")

def save_browserconfig():
    """Windows tile config."""
    xml = '''<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square70x70logo src="/mstile-70x70.png"/>
      <square150x150logo src="/mstile-150x150.png"/>
      <square310x310logo src="/mstile-310x310.png"/>
      <wide310x150logo src="/mstile-310x150.png"/>
      <TileColor>#050510</TileColor>
    </tile>
    <notification>
      <polling-uri src="/notifications.xml"/>
      <frequency>30</frequency>
      <cycle>1</cycle>
    </notification>
  </msapplication>
</browserconfig>'''
    with open(os.path.join(OUT, "browserconfig.xml"), "w") as f:
        f.write(xml)
    print("  ✓ browserconfig.xml")


# ============================================================
# GENERATE EVERYTHING
# ============================================================
print("=" * 60)
print("GENERATING COMPLETE FAVICON PACK v3 — MAXIMUM COVERAGE")
print("=" * 60)

# --- 1. Browser tab icons (most critical) ---
print("\n📱 Browser tab icons (ICO + PNG):")
save_ico([16, 24, 32, 48, 64], "favicon.ico")
save_png(16, "favicon-16x16.png")
save_png(24, "favicon-24x24.png")       # Windows pinned tab
save_png(32, "favicon-32x32.png")
save_png(48, "favicon-48x48.png")       # Windows taskbar
save_png(64, "favicon-64x64.png")       # Windows site icon
save_png(96, "favicon-96x96.png")       # Google TV, Chrome
save_png(128, "favicon-128x128.png")    # Chrome Web Store
save_png(196, "favicon-196x196.png")    # Chrome for Android

# --- 2. SVG favicon (modern browsers) ---
print("\n🖼️ SVG favicon (modern browsers):")
save_svg_favicon("favicon.svg")

# --- 3. iOS / Safari ---
print("\n🍎 iOS / Safari:")
save_apple_touch(120, "apple-touch-icon-120x120.png")
save_apple_touch(152, "apple-touch-icon-152x152.png")
save_apple_touch(167, "apple-touch-icon-167x167.png")   # iPad Pro
save_apple_touch(180, "apple-touch-icon.png")            # iPhone 6+
save_apple_touch(180, "apple-touch-icon-precomposed.png", precomposed=True)
save_svg_mask("safari-pinned-tab.svg")

# --- 4. Android / PWA ---
print("\n🤖 Android / PWA:")
for s in [36, 48, 72, 96, 144, 192, 256, 384, 512]:
    save_png(s, f"android-chrome-{s}x{s}.png")
save_android_notification("android-notification-96x96.png")

# --- 5. Windows tiles ---
print("\n🪟 Windows tiles:")
save_png(70, "mstile-70x70.png")
save_png(144, "mstile-144x144.png")
save_png(150, "mstile-150x150.png")
save_png(310, "mstile-310x310.png")
# Wide tile with aspect ratio 310x150
resized_wide = img.resize((310, 150), Image.LANCZOS)
canvas_wide = Image.new("RGBA", (310, 150), BG_DARK)
canvas_wide.paste(resized_wide, (0, 0))
canvas_wide.save(os.path.join(OUT, "mstile-310x150.png"), "PNG")
print(f"  ✓ mstile-310x150.png (310x150 wide tile)")

# --- 6. Open Graph / Social sharing ---
print("\n🔗 Social / Open Graph:")
save_og_image("og-image.png")

# --- 7. Config files ---
print("\n📋 Config files:")
save_webmanifest()
save_browserconfig()

print("\n" + "=" * 60)
print("✅ ALL FAVICONS GENERATED SUCCESSFULLY!")
print("=" * 60)
