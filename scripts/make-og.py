"""
Generate a placeholder Open Graph card (1200x630) for harborlauncher.com.

Mirrors the live landing page style: deep #0a0c10 background, teal->blue halo,
subtle dot grid, gradient-border logo mark, and the hero headline. This is a
PLACEHOLDER — replace with a designed card (and the real Syne typeface) later.

Run: python scripts/make-og.py  ->  writes public/og.png
"""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
PAD = 80

# --- tokens (from src/styles/tokens.css) ---
DEEP = (10, 12, 16)          # --harbor-deep #0a0c10
TEXT = (240, 242, 245)       # --text #f0f2f5
TEXT2 = (139, 144, 153)      # --text2 #8b9099
TEAL = (31, 207, 142)        # --teal #1fcf8e
BLUE = (94, 200, 255)        # #5ec8ff (logo gradient end / halo)

FONTS = "C:/Windows/Fonts"
f_black = lambda s: ImageFont.truetype(f"{FONTS}/ariblk.ttf", s)   # heavy display ~ Syne 800
f_semi = lambda s: ImageFont.truetype(f"{FONTS}/seguisb.ttf", s)   # Segoe UI Semibold


def radial(cx, cy, rx, ry):
    """Normalized radial falloff (1 at center -> 0 at edge of the ellipse)."""
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    nx = (xx / W - cx) / rx
    ny = (yy / H - cy) / ry
    d = np.sqrt(nx * nx + ny * ny)
    return np.clip(1.0 - d, 0.0, 1.0) ** 1.5


# --- base + centered halo ---
base = np.zeros((H, W, 3), np.float32) + np.array(DEEP, np.float32)
teal_f = radial(0.50, 0.50, 0.45, 0.55)[..., None]   # centered teal glow
blue_f = radial(0.50, 0.50, 0.70, 0.85)[..., None]   # softer, wider blue for depth
base += np.array(TEAL, np.float32) * 0.20 * teal_f
base += np.array(BLUE, np.float32) * 0.06 * blue_f
img = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8), "RGB").convert("RGBA")

# --- dot grid (radial-gradient dots, 24px, ~5% white * 0.6 layer opacity) ---
dots = Image.new("RGBA", (W, H), (0, 0, 0, 0))
dd = ImageDraw.Draw(dots)
a = int(255 * 0.05 * 0.6)
for y in range(0, H, 24):
    for x in range(0, W, 24):
        dd.point((x, y), fill=(255, 255, 255, a))
img = Image.alpha_composite(img, dots)


def gradient_square(size, border, radius):
    """Hollow rounded square with a 135deg teal->blue border (logo-mark)."""
    grad = np.zeros((size, size, 3), np.float32)
    yy, xx = np.mgrid[0:size, 0:size].astype(np.float32)
    t = ((xx + yy) / (2 * size))[..., None]          # 135deg diagonal
    grad += np.array(TEAL, np.float32) * (1 - t) + np.array(BLUE, np.float32) * t
    tile = Image.fromarray(grad.astype(np.uint8), "RGB").convert("RGBA")

    outer = Image.new("L", (size, size), 0)
    ImageDraw.Draw(outer).rounded_rectangle([0, 0, size - 1, size - 1], radius, fill=255)
    mark = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    mark.paste(tile, (0, 0), outer)

    # cut a deep-bg rounded square in the middle -> gradient reads as a border
    inner = Image.new("L", (size, size), 0)
    ImageDraw.Draw(inner).rounded_rectangle(
        [border, border, size - 1 - border, size - 1 - border],
        max(radius - border, 1), fill=255,
    )
    mark.paste(Image.new("RGBA", (size, size), DEEP + (255,)), (0, 0), inner)
    return mark


draw = ImageDraw.Draw(img)

# --- centered logo: gradient mark + "Harbor" wordmark ---
MARK = 132
GAP = 40
word = "Harbor"
logo_font = f_black(112)

word_w = draw.textlength(word, font=logo_font)
group_w = MARK + GAP + word_w
x0 = (W - group_w) / 2
cy = H / 2

mark = gradient_square(MARK, 14, 38)
img.alpha_composite(mark, (int(x0), int(cy - MARK / 2)))
draw.text((x0 + MARK + GAP, cy), word, font=logo_font, fill=TEXT, anchor="lm")

os.makedirs("public", exist_ok=True)
img.convert("RGB").save("public/og.png", "PNG")
print("wrote public/og.png", img.size)
