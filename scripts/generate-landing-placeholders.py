#!/usr/bin/env python3
"""
KursoKo landing placeholder assets — flat vector stickers on transparent PNG.
Replace files in src/assets/landing/placeholders/ with polished art (same paths + manifest).
"""
from __future__ import annotations

import json
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src/assets/landing/placeholders"

# Strict palette — matches src/styles/landing/tokens.css
PALETTE = {
    "ink": "#2D2D2D",
    "purple": "#4B2C7F",
    "purple_light": "#9575CD",
    "teal": "#4DB6AC",
    "yellow": "#FFD54F",
    "paper": "#FDFCF8",
    "white": "#FFFFFF",
    "outline": "#2D2D2D",
}

RIASEC = [
    ("r", "R", "Realistic", "#4DB6AC"),
    ("i", "I", "Investigative", "#4B2C7F"),
    ("a", "A", "Artistic", "#FFD54F"),
    ("s", "S", "Social", "#9575CD"),
    ("e", "E", "Enterprising", "#FF8A65"),
    ("c", "C", "Conventional", "#81D4FA"),
]

STEPS = [
    ("step-01-quiz", "1", "Sagot ka lang"),
    ("step-02-profile", "2", "Profile mo"),
    ("step-03-path", "3", "Alamin courses"),
]

BLOBS = [
    ("blob-lavender", "#9575CD"),
    ("blob-teal", "#4DB6AC"),
    ("blob-yellow", "#FFD54F"),
]


def hex_rgb(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


def sticker_canvas(size: int) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    return img, ImageDraw.Draw(img)


def draw_sticker_border(draw: ImageDraw.ImageDraw, box: tuple, fill: str, pad: int = 8) -> None:
    x0, y0, x1, y1 = box
    draw.rounded_rectangle(
        (x0, y0, x1, y1),
        radius=28,
        fill=hex_rgb(fill) + (255,),
        outline=hex_rgb(PALETTE["outline"]) + (255,),
        width=3,
    )
    draw.rounded_rectangle(
        (x0 + pad, y0 + pad, x1 - pad, y1 - pad),
        radius=22,
        fill=hex_rgb(PALETTE["white"]) + (255,),
        outline=hex_rgb(PALETTE["outline"]) + (200,),
        width=2,
    )


def draw_riasec_icon(draw: ImageDraw.ImageDraw, code: str, cx: int, cy: int, accent: str) -> None:
    s = 44
    a = hex_rgb(accent) + (255,)
    ink = hex_rgb(PALETTE["ink"]) + (255,)
    if code == "R":
        draw.rectangle((cx - s, cy - 8, cx + s, cy + 8), fill=a, outline=ink, width=2)
        draw.rectangle((cx - 8, cy - s, cx + 8, cy + s), fill=a, outline=ink, width=2)
    elif code == "I":
        draw.ellipse((cx - s, cy - s, cx + s, cy + s), outline=ink, width=3)
        draw.line((cx + 20, cy + 20, cx + 50, cy + 50), fill=ink, width=4)
    elif code == "A":
        pts = [(cx, cy - s), (cx - s, cy + s), (cx + s, cy + s)]
        draw.polygon(pts, fill=a, outline=ink)
        draw.ellipse((cx - 12, cy - 12, cx + 12, cy + 12), fill=hex_rgb(PALETTE["yellow"]) + (255,), outline=ink, width=2)
    elif code == "S":
        draw.ellipse((cx - 30, cy - 35, cx + 10, cy + 5), fill=a, outline=ink, width=2)
        draw.ellipse((cx - 10, cy - 35, cx + 30, cy + 5), fill=a, outline=ink, width=2)
        draw.arc((cx - 40, cy, cx + 40, cy + 50), 0, 180, fill=ink, width=3)
    elif code == "E":
        draw.rounded_rectangle((cx - s, cy - 30, cx + s, cy + 30), radius=8, fill=a, outline=ink, width=2)
        draw.polygon([(cx + 20, cy - 10), (cx + 55, cy), (cx + 20, cy + 10)], fill=hex_rgb(PALETTE["yellow"]) + (255,), outline=ink)
    else:  # C
        for i, row in enumerate([3, 4, 3]):
            for j in range(row):
                x = cx - 36 + j * 24 + (12 if i == 1 else 0)
                y = cy - 30 + i * 24
                draw.rounded_rectangle((x, y, x + 18, y + 14), radius=4, fill=a, outline=ink, width=1)


def draw_step_scene(draw: ImageDraw.ImageDraw, step_id: str, w: int, h: int) -> None:
    ink = hex_rgb(PALETTE["ink"]) + (255,)
    purple = hex_rgb(PALETTE["purple"]) + (255,)
    teal = hex_rgb(PALETTE["teal"]) + (255,)
    yellow = hex_rgb(PALETTE["yellow"]) + (255,)
    cx, cy = w // 2, h // 2

    if step_id == "step-01-quiz":
        draw.rounded_rectangle((cx - 70, cy - 90, cx + 70, cy + 90), radius=16, fill=purple, outline=ink, width=3)
        draw.rectangle((cx - 50, cy - 70, cx + 50, cy - 50), fill=yellow, outline=ink, width=2)
        for i, y in enumerate([-30, 0, 30]):
            draw.rounded_rectangle((cx - 45, cy + y - 8, cx + 45, cy + y + 8), radius=6, fill=(255, 255, 255, 255), outline=ink, width=2)
            if i < 2:
                draw.line((cx + 30, cy + y, cx + 38, cy + y - 6), fill=teal, width=3)
                draw.line((cx + 30, cy + y, cx + 38, cy + y + 6), fill=teal, width=3)
    elif step_id == "step-02-profile":
        r = 75
        draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(255, 255, 255, 255), outline=ink, width=3)
        for i in range(6):
            ang = math.radians(i * 60 - 90)
            x = cx + int(math.cos(ang) * 55)
            y = cy + int(math.sin(ang) * 55)
            col = hex_rgb(RIASEC[i][3]) + (255,)
            draw.ellipse((x - 14, y - 14, x + 14, y + 14), fill=col, outline=ink, width=2)
        draw.ellipse((cx - 18, cy - 18, cx + 18, cy + 18), fill=purple, outline=ink, width=2)
    else:
        draw.line((cx - 120, cy + 40, cx + 120, cy + 40), fill=ink, width=4)
        for i, xo in enumerate([-80, 0, 80]):
            x = cx + xo
            draw.line((x, cy + 40, x, cy - 20 - i * 15), fill=teal, width=4)
            draw.polygon([(x, cy - 35 - i * 15), (x - 12, cy - 10 - i * 15), (x + 12, cy - 10 - i * 15)], fill=yellow, outline=ink)


def try_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for name in ("Arial Bold.ttf", "Arial.ttf", "Helvetica.ttc", "DejaVuSans-Bold.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def save_riasec() -> list[dict]:
    meta = []
    (OUT / "riasec").mkdir(parents=True, exist_ok=True)
    size = 512
    font_l = try_font(36)
    font_s = try_font(18)
    for slug, letter, label, accent in RIASEC:
        img, draw = sticker_canvas(size)
        pad = 48
        draw_sticker_border(draw, (pad, pad, size - pad, size - pad), accent)
        draw_riasec_icon(draw, letter, size // 2, size // 2 - 20, accent)
        draw.text((size // 2, size - pad - 42), letter, fill=hex_rgb(PALETTE["ink"]) + (255,), font=font_l, anchor="mm")
        draw.text((size // 2, size - pad - 12), label[:6], fill=hex_rgb(PALETTE["ink"]) + (200,), font=font_s, anchor="mm")
        path = OUT / "riasec" / f"{slug}.png"
        img.save(path, "PNG")
        meta.append({"id": f"riasec-{slug}", "file": f"riasec/{slug}.png", "width": size, "height": size, "label": label})
    return meta


def save_steps() -> list[dict]:
    meta = []
    (OUT / "steps").mkdir(parents=True, exist_ok=True)
    w, h = 640, 480
    font = try_font(22)
    for step_id, num, caption in STEPS:
        img, draw = sticker_canvas(w)
        img = img.resize((w, h))  # noqa — fresh canvas
        img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        draw.rounded_rectangle((24, 24, w - 24, h - 24), radius=24, fill=hex_rgb(PALETTE["paper"]) + (255,), outline=hex_rgb(PALETTE["outline"]) + (255,), width=3)
        draw.ellipse((40, 40, 88, 88), fill=hex_rgb(PALETTE["purple"]) + (255,), outline=hex_rgb(PALETTE["outline"]) + (255,), width=2)
        draw.text((64, 64), num, fill=(255, 255, 255, 255), font=try_font(28), anchor="mm")
        draw_step_scene(draw, step_id, w, h)
        draw.text((w // 2, h - 48), caption, fill=hex_rgb(PALETTE["ink"]) + (255,), font=font, anchor="mm")
        path = OUT / "steps" / f"{step_id}.png"
        img.save(path, "PNG")
        meta.append({"id": step_id, "file": f"steps/{step_id}.png", "width": w, "height": h, "caption": caption})
    return meta


def save_blobs() -> list[dict]:
    meta = []
    (OUT / "blobs").mkdir(parents=True, exist_ok=True)
    size = 800
    for name, color in BLOBS:
        img, draw = sticker_canvas(size)
        cx, cy = size // 2, size // 2
        for scale, alpha in [(1.0, 90), (0.85, 70), (0.7, 50)]:
            r = int(280 * scale)
            col = hex_rgb(color) + (alpha,)
            draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=col)
        path = OUT / "blobs" / f"{name}.png"
        img.save(path, "PNG")
        meta.append({"id": name, "file": f"blobs/{name}.png", "width": size, "height": size, "opacity_css": "0.2"})
    return meta


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = {
        "version": 1,
        "style": "flat_vector_sticker",
        "palette": PALETTE,
        "replace_note": "Swap PNGs keeping same filenames; run build to verify layout.",
        "layout": {
            "riasec_grid": {"cols_mobile": 2, "cols_md": 3, "cols_lg": 6, "max_width_px": 120},
            "steps": {"max_width_px": 320, "aspect": "4:3"},
            "blobs": {"position": "absolute", "blur_css": "80px", "max_width_vw": 40},
        },
        "assets": {
            "riasec": save_riasec(),
            "steps": save_steps(),
            "blobs": save_blobs(),
        },
    }
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"Wrote {len(manifest['assets']['riasec'])} RIASEC + {len(manifest['assets']['steps'])} steps + {len(manifest['assets']['blobs'])} blobs → {OUT}")


if __name__ == "__main__":
    main()
