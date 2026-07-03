#!/usr/bin/env python3
"""ChatGPT inbox workflow for questionnaire choice PNGs.

Copy a Project-style prompt, save downloads to _inbox/, then install to final path.
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROMPT_DIR = ROOT / "docs/plans/asset-prompts/questionnaire"
ASSET_DIR = ROOT / "src/assets/questionnaire"
INBOX_DIR = ASSET_DIR / "_inbox"
RAW_DIR = INBOX_DIR / "raw"
MANIFEST = PROMPT_DIR / "manifest.json"
STYLE_REFS = [
    ASSET_DIR / "01.1.png",
    ASSET_DIR / "01.2.png",
]
SENSITIVE_SLOTS = {"17.1", "19.2", "23.2", "24.1", "27.1"}
SLOT_RE = re.compile(r"^q?(\d{1,2})\.(\d)$")


def die(message: str, code: int = 1) -> None:
    print(message, file=sys.stderr)
    raise SystemExit(code)


def normalize_slot(raw: str) -> tuple[str, str]:
    """Return (slot '6.1', file stem '06.1')."""
    cleaned = raw.strip().lower().removeprefix("q").removesuffix(".json")
    match = SLOT_RE.match(f"q{cleaned}" if not cleaned.startswith("q") else cleaned)
    if not match:
        die(f"Invalid slot {raw!r}. Use forms like 6.1, 06.1, or q06.1.json.")
    q_num, opt = match.groups()
    slot = f"{int(q_num)}.{opt}"
    stem = f"{int(q_num):02d}.{opt}"
    return slot, stem


def load_manifest() -> list[dict]:
    if not MANIFEST.exists():
        die(f"Missing manifest: {MANIFEST}\nRun: python3 scripts/build-questionnaire-manifest.py")
    data = json.loads(MANIFEST.read_text(encoding="utf-8"))
    return data["choices"]


def prompt_path_for_stem(stem: str) -> Path:
    return PROMPT_DIR / f"q{stem}.json"


def output_path_for_stem(stem: str) -> Path:
    return ASSET_DIR / f"{stem}.png"


def inbox_path_for_stem(stem: str) -> Path:
    return INBOX_DIR / f"{stem}.png"


def slot_done(stem: str) -> bool:
    return output_path_for_stem(stem).is_file()


def parse_stem_from_png(name: str) -> str | None:
    match = re.match(r"^(\d{2}\.\d)\.png$", name)
    return match.group(1) if match else None


def copy_to_clipboard(text: str) -> bool:
    if sys.platform == "darwin":
        try:
            subprocess.run(["pbcopy"], input=text, text=True, check=True)
            return True
        except (OSError, subprocess.CalledProcessError):
            return False
    return False


def open_paths(paths: list[Path]) -> None:
    existing = [p for p in paths if p.exists()]
    if not existing:
        return
    if sys.platform == "darwin":
        subprocess.run(["open", "-R", str(existing[0])], check=False)
        for path in existing[1:]:
            subprocess.run(["open", str(path)], check=False)


def chatgpt_command(prompt_file: Path) -> str:
    line_count = len(prompt_file.read_text(encoding="utf-8").splitlines())
    return f"Create image @{prompt_file.name} (1-{line_count})"


def load_prompt_json(stem: str) -> dict:
    path = prompt_path_for_stem(stem)
    if not path.is_file():
        die(f"Prompt file not found: {path}")
    return json.loads(path.read_text(encoding="utf-8"))


def stem_from_manifest_entry(entry: dict) -> str:
    name = Path(entry["output_png"]).name
    return name.removesuffix(".png")


def next_missing_entry() -> dict | None:
    for entry in load_manifest():
        stem = stem_from_manifest_entry(entry)
        if not slot_done(stem):
            return entry
    return None


def print_slot_brief(stem: str, data: dict) -> None:
    q = data["questionnaire"]
    slot = q["slot"]
    print(f"Slot:      {slot}")
    print(f"Choice:    {q['choice_text']}")
    print(f"Prompt:    {prompt_path_for_stem(stem).relative_to(ROOT)}")
    print(f"Inbox:     {inbox_path_for_stem(stem).relative_to(ROOT)}")
    print(f"Output:    {output_path_for_stem(stem).relative_to(ROOT)}")
    if slot in SENSITIVE_SLOTS or q.get("sensitive_topic"):
        print("Sensitive: review carefully before install")


def cmd_prep(slot_arg: str | None, *, open_refs: bool) -> int:
    if slot_arg is None:
        entry = next_missing_entry()
        if entry is None:
            print("All questionnaire slots already have PNGs.")
            return 0
        stem = stem_from_manifest_entry(entry)
    else:
        _, stem = normalize_slot(slot_arg)

    prompt_file = prompt_path_for_stem(stem)
    data = load_prompt_json(stem)
    command = chatgpt_command(prompt_file)

    INBOX_DIR.mkdir(parents=True, exist_ok=True)

    print_slot_brief(stem, data)
    print()
    print("ChatGPT message (also copied to clipboard when available):")
    print(command)
    print()
    print("Attach in ChatGPT Project:")
    for ref in STYLE_REFS:
        mark = "ok" if ref.is_file() else "MISSING"
        print(f"  [{mark}] {ref.relative_to(ROOT)}")
    print(f"  [upload once] {prompt_file.relative_to(ROOT)}")
    print()
    print("After generation, save/download to inbox path above, then run:")
    print(f"  npm run assets:install -- {data['questionnaire']['slot']}")

    if copy_to_clipboard(command):
        print()
        print("Clipboard: ready")

    if open_refs:
        open_paths(STYLE_REFS + [prompt_file])

    return 0


def cmd_install(slot_arg: str | None, *, all_inbox: bool) -> int:
    INBOX_DIR.mkdir(parents=True, exist_ok=True)
    installed = 0

    if all_inbox:
        stems = []
        for path in sorted(INBOX_DIR.glob("*.png")):
            stem = parse_stem_from_png(path.name)
            if stem:
                stems.append(stem)
        if not stems:
            print(f"No PNG files in {INBOX_DIR.relative_to(ROOT)}")
            return 0
    elif slot_arg is None:
        die("Pass a slot (e.g. 6.1) or use --all.")
    else:
        _, stems = normalize_slot(slot_arg)
        stems = [stems]

    for stem in stems:
        src = inbox_path_for_stem(stem)
        dst = output_path_for_stem(stem)
        if not src.is_file():
            print(f"Skip {stem}: inbox file missing ({src.relative_to(ROOT)})")
            continue
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(src), str(dst))
        print(f"Installed {dst.relative_to(ROOT)}")
        installed += 1

    if installed == 0:
        return 1
    print(f"Done: {installed} file(s)")
    return 0


def run_rembg(src: Path, dst: Path) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    try:
        from rembg import remove
        from PIL import Image
    except ImportError as exc:
        die(
            "rembg not installed. Run: .venv-assets/bin/pip install 'rembg[cpu]' pillow\n"
            f"Import error: {exc}",
        )
    with Image.open(src) as img:
        result = remove(img)
        if isinstance(result, Image.Image):
            result.save(dst, format="PNG")
        else:
            Image.open(result).save(dst, format="PNG")


def cmd_strip(slot_arg: str | None, *, all_raw: bool) -> int:
    """Remove background from raw inbox PNGs → _inbox/NN.M.png."""
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    INBOX_DIR.mkdir(parents=True, exist_ok=True)
    stripped = 0

    if all_raw:
        stems = []
        for path in sorted(RAW_DIR.glob("*.png")):
            stem = parse_stem_from_png(path.name)
            if stem:
                stems.append(stem)
        if not stems:
            print(f"No PNG files in {RAW_DIR.relative_to(ROOT)}")
            return 0
    elif slot_arg is None:
        die("Pass a slot (e.g. 6.1) or use --all.")
    else:
        _, stems = normalize_slot(slot_arg)
        stems = [stems]

    for stem in stems:
        src = RAW_DIR / f"{stem}.png"
        dst = inbox_path_for_stem(stem)
        if not src.is_file():
            print(f"Skip {stem}: raw file missing ({src.relative_to(ROOT)})")
            continue
        run_rembg(src, dst)
        print(f"Stripped {dst.relative_to(ROOT)}")
        stripped += 1

    if stripped == 0:
        return 1
    print(f"Done: {stripped} file(s)")
    return 0


def cmd_process(slot_arg: str | None, *, all_raw: bool) -> int:
    """strip then install in one step."""
    code = cmd_strip(slot_arg, all_raw=all_raw)
    if code != 0:
        return code
    return cmd_install(None, all_inbox=True)


def cmd_status() -> int:
    done = 0
    missing = 0
    inbox_waiting = 0

    print("slot   status    choice")
    print("----   ------    ------")
    for entry in load_manifest():
        stem = stem_from_manifest_entry(entry)
        slot = entry["slot"]
        choice = entry["choice_text"]
        if len(choice) > 42:
            choice = choice[:39] + "..."

        if slot_done(stem):
            status = "done"
            done += 1
        elif inbox_path_for_stem(stem).is_file():
            status = "inbox"
            inbox_waiting += 1
        else:
            status = "missing"
            missing += 1

        flag = " !" if slot in SENSITIVE_SLOTS else ""
        print(f"{slot:<6} {status:<9} {choice}{flag}")

    print()
    print(f"done={done}  inbox={inbox_waiting}  missing={missing}  total={done + inbox_waiting + missing}")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="ChatGPT inbox workflow for questionnaire assets.",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    prep = sub.add_parser("prep", help="Print/copy ChatGPT command for a slot")
    prep.add_argument("slot", nargs="?", help="e.g. 6.1 (default: next missing)")
    prep.add_argument("--no-open", action="store_true", help="Do not open refs in Finder")

    sub.add_parser("next", help="Prep the next missing slot")

    install = sub.add_parser("install", help="Move inbox PNG to final asset path")
    install.add_argument("slot", nargs="?", help="e.g. 6.1")
    install.add_argument("--all", action="store_true", dest="all_inbox", help="Install every PNG in _inbox")

    strip = sub.add_parser("strip", help="rembg raw inbox PNG → _inbox/NN.M.png")
    strip.add_argument("slot", nargs="?", help="e.g. 6.1")
    strip.add_argument("--all", action="store_true", dest="all_raw", help="Strip every PNG in _inbox/raw")

    process = sub.add_parser("process", help="strip --all then install --all")
    process.add_argument("slot", nargs="?", help="e.g. 6.1")
    process.add_argument("--all", action="store_true", dest="all_raw", help="Process every PNG in _inbox/raw")

    sub.add_parser("status", help="Show done / inbox / missing slots")
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    if args.command == "prep":
        return cmd_prep(args.slot, open_refs=not args.no_open)
    if args.command == "next":
        return cmd_prep(None, open_refs=True)
    if args.command == "install":
        return cmd_install(args.slot, all_inbox=args.all_inbox)
    if args.command == "strip":
        return cmd_strip(args.slot, all_raw=args.all_raw)
    if args.command == "process":
        return cmd_process(args.slot, all_raw=args.all_raw)
    if args.command == "status":
        return cmd_status()

    parser.print_help()
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
