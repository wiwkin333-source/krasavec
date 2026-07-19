#!/usr/bin/env python3
"""Generate full favicon pack from source image for all browsers/devices."""
from PIL import Image
import os
import struct
import io

SRC = "/home/z/my-project/upload/ChatGPT Image 19 июл. 2026 г., 02_44_06.png"
OUT = "/home/z/my-project/public"

img = Image.open(SRC).convert("RGBA")

def save_png(size, filename):
    resized = img.resize((size, size), Image.LANCZOS)
    path = os.path.join(OUT, filename)
    resized.save(path, "PNG")
    print(f"  ✓ {filename} ({size}x{size})")

def save_ico(sizes, filename):
    """Generate multi-size ICO file."""
    ico_images = []
    for s in sizes:
        resized = img.resize((s, s), Image.LANCZOS)
        buf = io.BytesIO()
        resized.save(buf, "PNG")
        ico_images.append((s, buf.getvalue()))
    
    path = os.path.join(OUT, filename)
    with open(path, "wb") as f:
        f.write(struct.pack("<HHH", 0, 1, len(ico_images)))
        offset = 6 + len(ico_images) * 16
        for s, data in ico_images:
            w = s if s < 256 else 0
            h = s if s < 256 else 0
            f.write(struct.pack("<BBBBHHII", w, h, 0, 0, 1, 32, len(data), offset))
            offset += len(data)
        for s, data in ico_images:
            f.write(data)
    print(f"  ✓ {filename} (ICO: {sizes})")

def save_svg_mask(filename):
    svg_content = '''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <image href="/favicon-96x96.png" width="512" height="512" />
</svg>'''
    path = os.path.join(OUT, filename)
    with open(path, "w") as f:
        f.write(svg_content)
    print(f"  ✓ {filename} (SVG mask)")

def save_webmanifest():
    manifest = """{
  "name": "ГРАВИКОТ — Лазерное ателье",
  "short_name": "ГРАВИКОТ",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-256x256.png",
      "sizes": "256x256",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#050510",
  "background_color": "#050510",
  "display": "standalone",
  "start_url": "/"
}"""
    path = os.path.join(OUT, "site.webmanifest")
    with open(path, "w") as f:
        f.write(manifest)
    print("  ✓ site.webmanifest")

def save_browserconfig():
    xml = """<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square70x70logo src="/mstile-70x70.png"/>
      <square150x150logo src="/mstile-150x150.png"/>
      <square310x310logo src="/mstile-310x310.png"/>
      <wide310x150logo src="/mstile-310x150.png"/>
      <TileColor>#050510</TileColor>
    </tile>
  </msapplication>
</browserconfig>"""
    path = os.path.join(OUT, "browserconfig.xml")
    with open(path, "w") as f:
        f.write(xml)
    print("  ✓ browserconfig.xml")

def save_apple_touch(size, filename):
    """Apple touch icon with slight padding on dark background for iOS."""
    pad = int(size * 0.08)
    canvas = Image.new("RGBA", (size, size), (5, 5, 16, 255))
    inner_size = size - 2 * pad
    resized = img.resize((inner_size, inner_size), Image.LANCZOS)
    canvas.paste(resized, (pad, pad), resized if resized.mode == "RGBA" else None)
    path = os.path.join(OUT, filename)
    canvas.save(path, "PNG")
    print(f"  ✓ {filename} ({size}x{size} with padding)")

print("Generating complete favicon pack...\n")

print("Browser tab icons:")
save_ico([16, 32, 48], "favicon.ico")
save_png(16, "favicon-16x16.png")
save_png(32, "favicon-32x32.png")
save_png(96, "favicon-96x96.png")

print("\niOS / Safari:")
save_apple_touch(180, "apple-touch-icon.png")
save_apple_touch(180, "apple-touch-icon-precomposed.png")

print("\nAndroid / PWA:")
save_png(192, "android-chrome-192x192.png")
save_png(256, "android-chrome-256x256.png")
save_png(512, "android-chrome-512x512.png")

print("\nWindows tiles:")
save_png(70, "mstile-70x70.png")
save_png(144, "mstile-144x144.png")
save_png(150, "mstile-150x150.png")
save_png(310, "mstile-310x150.png")
save_png(310, "mstile-310x310.png")

print("\nSafari pinned tab:")
save_svg_mask("safari-pinned-tab.svg")

print("\nConfig files:")
save_webmanifest()
save_browserconfig()

print("\nAll favicons generated successfully!")
