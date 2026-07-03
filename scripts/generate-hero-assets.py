#!/usr/bin/env python3
"""Generate hero floating 2D props — star + lavender/teal blobs (transparent PNG)."""
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src/assets/landing/hero"

YELLOW = "#FFD54F"
YELLOW_HI = "#FFE082"
INK = "#2D2D2D"
LAVENDER = "#B39DDB"
LAVENDER_DEEP = "#9575CD"
TEAL = "#4DB6AC"
TEAL_DEEP = "#26A69A"


def hex_rgb(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


def star_points(cx: float, cy: float, outer: float, inner: float, n: int = 4, rot: float = -math.pi / 2) -> list[tuple[float, float]]:
    pts: list[tuple[float, float]] = []
    step = math.pi / n
    for i in range(n * 2):
        r = outer if i % 2 == 0 else inner
        a = rot + i * step
        pts.append((cx + math.cos(a) * r, cy + math.sin(a) * r))
    return pts


def save_star(size: int = 64) -> Path:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    cx, cy = size / 2, size / 2
    outer, inner = size * 0.38, size * 0.14
    pts = star_points(cx, cy, outer, inner, n=4, rot=-math.pi / 4)

    ink = hex_rgb(INK)
    fill = hex_rgb(YELLOW)
    hi = hex_rgb(YELLOW_HI)

    draw.polygon(pts, fill=fill + (255,), outline=ink + (255,), width=2)

    # lighter facet on upper-right point
    tip_x, tip_y = pts[1]
    draw.ellipse((tip_x - 5, tip_y - 5, tip_x + 5, tip_y + 5), fill=hi + (200,))

    path = OUT / "star-sparkle.png"
    img.save(path, "PNG")
    return path


def save_blob(size: int, primary: str, depth: str, seed_offsets: list[tuple[int, int, int, int]]) -> Image.Image:
    """Soft organic blob via blurred multi-ellipse mask."""
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    cx, cy = size // 2, size // 2

    for rx, ry, ox, oy in seed_offsets:
        draw.ellipse((cx - rx + ox, cy - ry + oy, cx + rx + ox, cy + ry + oy), fill=255)

    blur = max(8, size // 18)
    mask = mask.filter(ImageFilter.GaussianBlur(radius=blur))

    base = Image.new("RGBA", (size, size), hex_rgb(primary) + (255,))
    deep = Image.new("RGBA", (size, size), hex_rgb(depth) + (255,))
    deep_mask = mask.point(lambda p: int(p * 0.55))

    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    img.paste(base, mask=mask)
    img.paste(deep, mask=deep_mask)
    return img


def save_blobs() -> tuple[Path, Path]:
    lavender = save_blob(
        320,
        LAVENDER,
        LAVENDER_DEEP,
        [(118, 98, 12, -18), (102, 88, -28, 8), (92, 76, 22, 24), (80, 70, -8, -32)],
    )
    teal = save_blob(
        240,
        TEAL,
        TEAL_DEEP,
        [(88, 72, 8, -12), (76, 64, -18, 6), (68, 58, 14, 16)],
    )
    p1 = OUT / "blob-lavender.png"
    p2 = OUT / "blob-teal.png"
    lavender.save(p1, "PNG")
    teal.save(p2, "PNG")
    return p1, p2


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    star = save_star()
    lav, teal = save_blobs()
    print(f"Wrote hero assets → {OUT}")
    for p in (star, lav, teal):
        print(f"  {p.name} ({p.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
