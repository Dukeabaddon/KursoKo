#!/usr/bin/env python3
"""
Frontend Cinematic Studio — Asset Preparation Script

Removes background from images using rembg.
Used when a design needs a character/object composited over a custom background.

Install:
    pip install "rembg[cli]"

Usage:
    python scripts/prepare-assets.py input.png                     # → input_nobg.png
    python scripts/prepare-assets.py input.png output.png          # → output.png
    python scripts/prepare-assets.py input.png output.png --no-bg  # remove bg (default)
    python scripts/prepare-assets.py input.png output.png --keep-bg # keep bg, just copy
    python scripts/prepare-assets.py ./folder/ ./out/              # batch process folder
"""
import subprocess
import sys
import shutil
from pathlib import Path


def check_rembg():
    """Check if rembg is installed."""
    try:
        subprocess.run(["rembg", "--version"], capture_output=True, check=True)
        return True
    except (FileNotFoundError, subprocess.CalledProcessError):
        return False


def remove_bg(input_path: Path, output_path: Path, alpha_matting: bool = True):
    """Remove background from a single image."""
    cmd = ["rembg", "i"]
    if alpha_matting:
        cmd.append("-a")
    cmd.extend([str(input_path), str(output_path)])
    subprocess.run(cmd, check=True)
    print(f"  ✓ {output_path.name} — background removed")


def batch_remove_bg(input_dir: Path, output_dir: Path, alpha_matting: bool = True):
    """Remove background from all images in a directory."""
    output_dir.mkdir(parents=True, exist_ok=True)
    extensions = {".png", ".jpg", ".jpeg", ".webp", ".bmp"}
    images = [f for f in input_dir.iterdir() if f.suffix.lower() in extensions]

    if not images:
        print(f"  ⚠ No images found in {input_dir}")
        return

    print(f"  Processing {len(images)} images...")
    for img in images:
        out = output_dir / img.with_suffix(".png").name
        remove_bg(img, out, alpha_matting)

    print(f"  ✓ All {len(images)} images processed → {output_dir}")


def main():
    if not check_rembg():
        print("❌ rembg not installed. Run: pip install \"rembg[cli]\"")
        sys.exit(1)

    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(0)

    input_path = Path(sys.argv[1])
    keep_bg = "--keep-bg" in sys.argv

    if input_path.is_dir():
        # Batch mode
        output_dir = Path(sys.argv[2]) if len(sys.argv) > 2 and not sys.argv[2].startswith("--") else input_path / "nobg"
        if keep_bg:
            print("  Batch copy (no bg removal)")
            output_dir.mkdir(parents=True, exist_ok=True)
            for f in input_path.iterdir():
                if f.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}:
                    shutil.copy2(f, output_dir / f.name)
        else:
            batch_remove_bg(input_path, output_dir)
    else:
        # Single file mode
        if len(sys.argv) > 2 and not sys.argv[2].startswith("--"):
            output_path = Path(sys.argv[2])
        else:
            output_path = input_path.with_stem(input_path.stem + "_nobg").with_suffix(".png")

        if keep_bg:
            shutil.copy2(input_path, output_path)
            print(f"  ✓ {output_path.name} — copied (bg kept)")
        else:
            remove_bg(input_path, output_path)


if __name__ == "__main__":
    main()
