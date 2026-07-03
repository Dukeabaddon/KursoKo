#!/usr/bin/env python3
"""Build manifest.json and optionally sync q*.json copy from src/data/questions.json."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIR = ROOT / "docs/plans/asset-prompts/questionnaire"
QUESTIONS = ROOT / "src/data/questions.json"

SCENES = {
    "1.1": {"stance": "full body, side profile standing", "action": "assembling toy robot pieces with a small screwdriver", "hero_prop": "cute round toy robot kit with teal LED dots", "supporting_props": ["small screwdriver", "loose gear", "instruction booklet"], "mood": "friendly curious maker energy", "thumbnail_test": "person + robot kit"},
    "1.2": {"stance": "full body, standing 3/4 turn", "action": "holding two smartphones side by side, comparing screens thoughtfully", "hero_prop": "two smartphones held for comparison", "supporting_props": ["small notepad", "checkmark icon bubble"], "mood": "curious deciding energy", "thumbnail_test": "person + two phones"},
    "2.1": {"stance": "full body, standing at easel", "action": "drawing a colorful school program poster with markers", "hero_prop": "upright poster board with bright shapes", "supporting_props": ["marker set", "color swatches", "tape roll"], "mood": "playful creative energy", "thumbnail_test": "person + poster"},
    "2.2": {"stance": "full body, leaning over shared desk", "action": "pointing at a homework page while helping a classmate", "hero_prop": "open workbook with pencil marks", "supporting_props": ["pencil", "eraser", "sticky note"], "mood": "supportive helpful energy", "thumbnail_test": "person + workbook"},
    "3.1": {"stance": "full body, standing behind small table", "action": "calling out snack deals during a school fair", "hero_prop": "snack fair booth with treat display", "supporting_props": ["small cash box", "price tag shapes without text", "napkin stack"], "mood": "upbeat persuasive energy", "thumbnail_test": "person + fair booth"},
    "3.2": {"stance": "full body, seated upright", "action": "tracking who paid and who still owes for snacks on a clipboard list", "hero_prop": "clipboard with paid and unpaid snack rows", "supporting_props": ["pen", "coin tray", "checkmark icons"], "mood": "organized calm energy", "thumbnail_test": "person + clipboard"},
    "4.1": {"stance": "full body, standing focused", "action": "installing a replacement screen film and smoothing bubbles with a squeegee", "hero_prop": "smartphone with screen film being smoothed", "supporting_props": ["microfiber cloth", "squeegee card", "packaging sleeve"], "mood": "careful hands-on energy", "thumbnail_test": "person + phone"},
    "4.2": {"stance": "full body, leaning toward laptop", "action": "testing a viral online tip on a laptop screen", "hero_prop": "laptop showing a simple how-to graphic", "supporting_props": ["notebook", "phone", "question mark icon"], "mood": "curious skeptical energy", "thumbnail_test": "person + laptop"},
    "5.1": {"stance": "full body, seated relaxed", "action": "writing a short story in a notebook with a pen", "hero_prop": "open notebook with doodle margin", "supporting_props": ["pen", "coffee mug", "sticky idea note"], "mood": "imaginative playful energy", "thumbnail_test": "person + notebook"},
    "5.2": {"stance": "full body, seated turned toward friend", "action": "listening attentively with open posture", "hero_prop": "open hands resting on knees", "supporting_props": ["tissue pack", "water bottle", "soft bench"], "mood": "gentle caring energy", "thumbnail_test": "person listening pose"},
    "6.1": {"stance": "full body, standing beside tripod", "action": "filming a short club promo on a phone tripod", "hero_prop": "smartphone on small tripod", "supporting_props": ["club banner shape", "microphone", "poster board"], "mood": "outgoing creator energy", "thumbnail_test": "person + phone tripod"},
    "6.2": {"stance": "full body, standing at desk", "action": "sorting class names into the right order on a list", "hero_prop": "class list sheet with arrows", "supporting_props": ["pen", "index cards", "paper clips"], "mood": "methodical careful energy", "thumbnail_test": "person + class list"},
    "7.1": {"stance": "full body, bent over bicycle", "action": "repairing a bike whose gears keep slipping with a wrench", "hero_prop": "bicycle with slipping gears and wrench", "supporting_props": ["bike pump", "repair rag", "hex key"], "mood": "practical focused energy", "thumbnail_test": "person + bike gears"},
    "7.2": {"stance": "full body, kneeling near wall outlet", "action": "tracing why only one wall socket stopped working with a tester", "hero_prop": "outlet tester plug in one socket", "supporting_props": ["small screwdriver", "notepad", "flashlight icon"], "mood": "inquisitive careful energy", "thumbnail_test": "person + outlet"},
    "8.1": {"stance": "full body, standing with sketch raised", "action": "sketching a T-shirt design on paper", "hero_prop": "T-shirt flat sketch with bold shapes", "supporting_props": ["fabric markers", "color swatches", "tape roll"], "mood": "creative bold energy", "thumbnail_test": "person + tee sketch"},
    "8.2": {"stance": "full body, crouched demonstrating", "action": "showing younger kids how to kick a ball", "hero_prop": "soccer ball at feet", "supporting_props": ["orange cones", "whistle", "water bottle"], "mood": "encouraging patient energy", "thumbnail_test": "person + ball"},
    "9.1": {"stance": "full body, leaning forward animated", "action": "inviting friends toward a booth game", "hero_prop": "colorful ring-toss game prop", "supporting_props": ["ticket roll", "small prize box", "arrow icon"], "mood": "persuasive playful energy", "thumbnail_test": "person + game booth"},
    "9.2": {"stance": "full body, seated writing", "action": "marking paid vs unpaid on a snack money list", "hero_prop": "snack money ledger with paid and unpaid marks", "supporting_props": ["pen", "coin tray", "receipt slips"], "mood": "responsible organized energy", "thumbnail_test": "person + ledger"},
    "10.1": {"stance": "full body, mounting shelf on wall", "action": "putting up a DIY shelf from a flat-pack kit", "hero_prop": "flat-pack shelf kit with brackets on wall", "supporting_props": ["hand drill", "screws", "measuring tape"], "mood": "handy confident energy", "thumbnail_test": "person + shelf kit"},
    "10.2": {"stance": "full body, walking on trail", "action": "noticing tiny details on plants during a hike", "hero_prop": "small plant sprig held up for inspection", "supporting_props": ["magnifying glass", "field notebook", "backpack"], "mood": "curious peaceful energy", "thumbnail_test": "person + plant sprig"},
    "11.1": {"stance": "full body, seated cross-legged", "action": "building a party playlist on a phone", "hero_prop": "phone with music note icons", "supporting_props": ["headphones", "sticky song list", "speaker icon"], "mood": "cheerful thoughtful energy", "thumbnail_test": "person + headphones"},
    "11.2": {"stance": "full body, standing at health booth", "action": "handing out flyers at a local health fair booth", "hero_prop": "health fair flyer stack", "supporting_props": ["first-aid kit", "clipboard", "water cups"], "mood": "helpful calm energy", "thumbnail_test": "person + health booth"},
    "12.1": {"stance": "full body, standing center front", "action": "leading a group presentation with confident gesture", "hero_prop": "presentation board with simple charts", "supporting_props": ["note cards", "pointer stick", "team silhouette"], "mood": "confident leading energy", "thumbnail_test": "person + presentation board"},
    "12.2": {"stance": "full body, seated at desk", "action": "checking name spellings on a form with a pen", "hero_prop": "form on clipboard", "supporting_props": ["pen", "glasses", "dictionary book"], "mood": "meticulous careful energy", "thumbnail_test": "person + form"},
    "13.1": {"stance": "full body, standing on stool reaching up", "action": "tightening screws on a wobbly desk fan", "hero_prop": "desk fan with loose grille", "supporting_props": ["screwdriver", "small wrench", "safety goggles"], "mood": "practical steady energy", "thumbnail_test": "person + desk fan"},
    "13.2": {"stance": "full body, seated with phone", "action": "testing whether a phone hack online really works", "hero_prop": "phone showing tutorial steps", "supporting_props": ["notes", "timer icon", "charger cable"], "mood": "skeptical experimental energy", "thumbnail_test": "person + phone"},
    "14.1": {"stance": "full body, kneeling beside sibling", "action": "showing a younger sibling how to tap an app", "hero_prop": "tablet with simple app icons", "supporting_props": ["cushion", "stylus", "toy block"], "mood": "patient helpful energy", "thumbnail_test": "person + tablet"},
    "14.2": {"stance": "full body, arranging board", "action": "decorating a classroom bulletin board", "hero_prop": "bulletin board with colorful shapes", "supporting_props": ["scissors", "colored paper", "tape roll"], "mood": "festive creative energy", "thumbnail_test": "person + bulletin board"},
    "15.1": {"stance": "full body, behind fair snack table", "action": "serving snacks at a school fair booth", "hero_prop": "snack booth with treats", "supporting_props": ["cash box", "napkins", "fair banner shape"], "mood": "busy upbeat energy", "thumbnail_test": "person + snack booth"},
    "15.2": {"stance": "full body, counting at table", "action": "making sure every peso and coin adds up correctly", "hero_prop": "open cash box with coins being counted", "supporting_props": ["calculator", "receipt pad", "coin tray"], "mood": "careful responsible energy", "thumbnail_test": "person + cash box"},
    "16.1": {"stance": "full body, carrying event supplies", "action": "setting up chairs and a small event tent", "hero_prop": "folding chair in hands", "supporting_props": ["tent pole", "tool bag", "checklist clipboard"], "mood": "cooperative busy energy", "thumbnail_test": "person + chair"},
    "16.2": {"stance": "full body, seated on park bench", "action": "describing bird calls heard from a park bench into a small recorder", "hero_prop": "park bench with birds in nearby tree", "supporting_props": ["small audio recorder", "field notebook", "leaf bookmark"], "mood": "observant peaceful energy", "thumbnail_test": "person on bench + birds"},
    "17.1": {"stance": "full body, open welcoming posture", "action": "greeting new students with a friendly welcome sign", "hero_prop": "welcome sign with star icons only", "supporting_props": ["name tag stickers", "info leaflet without text", "small flower pot"], "mood": "gentle hopeful welcome energy", "thumbnail_test": "person + welcome sign", "symbolic": True},
    "17.2": {"stance": "full body, painting on wall", "action": "painting a bright school mural with a roller", "hero_prop": "paint roller with color stripe", "supporting_props": ["paint tray", "sketch outline", "step stool"], "mood": "vibrant inspired energy", "thumbnail_test": "person + mural"},
    "18.1": {"stance": "full body, pointing at task chart", "action": "planning who does what on a group project chart", "hero_prop": "clipboard with task columns", "supporting_props": ["sticky notes", "markers", "laptop shape"], "mood": "organized collaborative energy", "thumbnail_test": "person + task chart"},
    "18.2": {"stance": "full body, sorting at desk", "action": "stacking and sorting documents so nothing gets lost", "hero_prop": "organized document stack with folders", "supporting_props": ["file rack", "label tabs", "pen"], "mood": "orderly efficient energy", "thumbnail_test": "person + document stack"},
    "19.1": {"stance": "full body, kneeling beside chair", "action": "tightening loose screws on a wobbly classroom chair with a screwdriver", "hero_prop": "wobbly classroom chair being tightened", "supporting_props": ["screwdriver", "spare screws", "small wrench"], "mood": "helpful practical energy", "thumbnail_test": "person + chair"},
    "19.2": {"stance": "full body, seated on bench reading tablet", "action": "reading a science article about soap and germs on a tablet held toward their face", "hero_prop": "tablet with simple germ diagram facing character", "supporting_props": ["notebook", "soap bar", "pen"], "mood": "informed curious energy", "thumbnail_test": "person + tablet"},
    "20.1": {"stance": "full body, walking and pointing", "action": "guiding a new student around campus with a map", "hero_prop": "campus map unfolded", "supporting_props": ["backpack", "ID lanyard", "direction arrow icon"], "mood": "friendly helpful energy", "thumbnail_test": "person + map"},
    "20.2": {"stance": "full body, seated drawing", "action": "drawing pictures for a school handout", "hero_prop": "handout page with illustration", "supporting_props": ["colored pencils", "eraser", "ruler"], "mood": "cheerful creative energy", "thumbnail_test": "person + handout art"},
    "21.1": {"stance": "full body, reviewing sales chart", "action": "tracking which snack sold fastest at a fair", "hero_prop": "tablet with simple bar chart", "supporting_props": ["snack samples", "notebook", "timer icon"], "mood": "analytical curious energy", "thumbnail_test": "person + chart"},
    "21.2": {"stance": "full body, tallying at desk", "action": "tallying quiz scores without mistakes", "hero_prop": "score sheet with neat marks", "supporting_props": ["calculator", "red pen", "stopwatch"], "mood": "precise attentive energy", "thumbnail_test": "person + score sheet"},
    "22.1": {"stance": "full body, speaking to small group", "action": "inviting people to join a club booth", "hero_prop": "club flyer shape without text", "supporting_props": ["signup sheet", "lanyards", "smile sticker"], "mood": "convincing enthusiastic energy", "thumbnail_test": "person + flyer"},
    "22.2": {"stance": "full body, checking clipboard", "action": "double-checking every item on a checklist", "hero_prop": "checklist clipboard with checkboxes", "supporting_props": ["pen", "supply bag", "label stickers"], "mood": "thorough responsible energy", "thumbnail_test": "person + checklist"},
    "23.1": {"stance": "full body, assembling at table", "action": "building a basic robot car from a starter kit", "hero_prop": "small robot car kit with wheels and chassis", "supporting_props": ["assembly guide", "screwdriver", "battery pack"], "mood": "patient methodical energy", "thumbnail_test": "person + robot car kit"},
    "23.2": {"stance": "full body, seated reading magazine", "action": "reading how plants grow in a science magazine", "hero_prop": "science magazine with plant diagram", "supporting_props": ["bookmark", "leaf sprig", "pen"], "mood": "curious relaxed energy", "thumbnail_test": "person + magazine"},
    "24.1": {"stance": "full body, seated beside classmate", "action": "sitting quietly with a classmate who feels left out", "hero_prop": "shared sketchbook on bench", "supporting_props": ["warm drink cup", "soft blanket fold", "heart icon bubble"], "mood": "sensitive gentle energy", "thumbnail_test": "two figures on bench", "symbolic": True},
    "24.2": {"stance": "full body, sketching at desk", "action": "designing an accessible play zone with ramps and shade", "hero_prop": "sketchpad with inclusive playground plan showing ramps and shade", "supporting_props": ["pencil set", "color swatches", "measuring tape"], "mood": "hopeful imaginative energy", "thumbnail_test": "person + playground plan"},
    "25.1": {"stance": "full body, at small experiment table", "action": "recording how long bubbles last on each soap sample with a timer", "hero_prop": "three soap samples with bubble jars and timer", "supporting_props": ["soap bars", "stopwatch", "notepad"], "mood": "scientific playful energy", "thumbnail_test": "person + soap bubbles"},
    "25.2": {"stance": "full body, updating attendance", "action": "updating the class attendance sheet on a laptop", "hero_prop": "laptop with attendance grid", "supporting_props": ["pen", "roster booklet", "checkmark icons"], "mood": "dutiful focused energy", "thumbnail_test": "person + attendance sheet"},
    "26.1": {"stance": "full body, hammering stool", "action": "hammering nails to fix a loose wooden stool", "hero_prop": "wooden stool being repaired", "supporting_props": ["hammer", "nails", "work gloves"], "mood": "determined practical energy", "thumbnail_test": "person + stool"},
    "26.2": {"stance": "full body, sorting recyclables", "action": "sorting recyclables into the right bins", "hero_prop": "color-coded recycling bin", "supporting_props": ["plastic bottles", "paper stack", "recycle icon"], "mood": "responsible conscientious energy", "thumbnail_test": "person + recycle bins"},
    "27.1": {"stance": "full body, seated in friend circle", "action": "drawing together with friends to relax", "hero_prop": "shared sketchbook with doodles", "supporting_props": ["colored pencils", "snack plate", "soft mat"], "mood": "relaxed gentle energy", "thumbnail_test": "friend circle drawing", "symbolic": True},
    "27.2": {"stance": "full body, leaning over laptop", "action": "designing a logo for a school club", "hero_prop": "laptop with logo draft shapes", "supporting_props": ["sketchbook", "color swatches", "stylus"], "mood": "creative focused energy", "thumbnail_test": "person + logo draft"},
    "28.1": {"stance": "full body, front of class gesturing", "action": "pitching a project idea to the class", "hero_prop": "project board with simple icons", "supporting_props": ["note cards", "prototype box", "arrow icons"], "mood": "confident persuasive energy", "thumbnail_test": "person + project board"},
    "28.2": {"stance": "full body, seated troubleshooting phone", "action": "figuring out why a game lags on a phone", "hero_prop": "phone showing game with lag icon", "supporting_props": ["charger cable", "settings gear icon", "notebook"], "mood": "analytical patient energy", "thumbnail_test": "person + phone game"},
    "29.1": {"stance": "full body, carrying boxes", "action": "carrying supply boxes for a school event", "hero_prop": "stack of labeled supply boxes", "supporting_props": ["tape dispenser", "trolley", "label stickers"], "mood": "busy helpful energy", "thumbnail_test": "person + boxes"},
    "29.2": {"stance": "full body, kneeling in garden bed", "action": "planting vegetables in a school garden", "hero_prop": "seedling in hand", "supporting_props": ["trowel", "watering can", "seed packets"], "mood": "nurturing calm energy", "thumbnail_test": "person + seedling"},
    "30.1": {"stance": "full body, at podium gesturing", "action": "leading a class debate with confident posture", "hero_prop": "notecard with bullet icons", "supporting_props": ["timer", "microphone shape", "podium"], "mood": "assertive focused energy", "thumbnail_test": "person + podium"},
    "30.2": {"stance": "full body, writing rules", "action": "writing step-by-step rules for a club game", "hero_prop": "rule sheet with numbered steps", "supporting_props": ["pen", "diagram sketch", "game pieces"], "mood": "clear orderly energy", "thumbnail_test": "person + rule sheet"},
}

RIASEC_TYPES = {
    "R": "Realistic",
    "I": "Investigative",
    "A": "Artistic",
    "S": "Social",
    "E": "Enterprising",
    "C": "Conventional",
}

SENSITIVE_SLOTS = {"17.1", "19.2", "23.2", "24.1", "27.1"}



def load_question_choices() -> dict[str, dict]:
    data = json.loads(QUESTIONS.read_text(encoding="utf-8"))
    mapping: dict[str, dict] = {}
    for q in data["questions"]:
        qid = q["id"]
        mapping[f"{qid}.1"] = {
            "question_text": q["text"],
            "choice_text": q["optionA"]["text"],
            "hint": q["optionA"]["hint"],
            "code": q["optionA"]["code"],
        }
        mapping[f"{qid}.2"] = {
            "question_text": q["text"],
            "choice_text": q["optionB"]["text"],
            "hint": q["optionB"]["hint"],
            "code": q["optionB"]["code"],
        }
    return mapping


def describe_character(character: dict) -> str:
    return (
        f"{character.get('presentation', 'young person')}, "
        f"{character.get('skin_tone', 'medium')} skin, "
        f"{character.get('hair', 'short hair')}"
    )


def describe_clothes(clothes: dict) -> str:
    top = clothes.get("top", {})
    bottom = clothes.get("bottom", {})
    shoes = clothes.get("footwear", {})
    return (
        f"{top.get('garment', 'top')} {top.get('color_hex', '#4B2C7F')} with {top.get('detail', 'simple trim')}, "
        f"{bottom.get('garment', 'bottom')} {bottom.get('color_hex', '#2D2D2D')}, "
        f"{shoes.get('garment', 'shoes')} {shoes.get('color_hex', '#2D2D2D')}"
    )


def accent_phrase(color: dict, code: str) -> str:
    accent = color.get("riasec_accent", {})
    secondary = color.get("riasec_secondary", {})
    return (
        f"Subtle {RIASEC_TYPES[code]} RIASEC accent {accent.get('hex', '#4DB6AC')} on props and trim, "
        f"{secondary.get('hex', '#9575CD')} secondary accents."
    )


def build_prompt(data: dict, scene: dict, choice: dict) -> str:
    character = data["character"]
    clothes = data["clothes"]
    color = data["color"]
    code = choice["code"]
    props = ", ".join(scene["supporting_props"])
    return (
        "Flat vector full-body illustration, 640x640, solid page background fill exactly #FDFCF8 "
        "(warm off-white paper — must match KursoKo assessment UI, NOT pure white #FFFFFF). "
        "Style MUST match KursoKo reference assets 1.1.png and 1.2.png: unDraw-inspired edu character, "
        "thin 2px dark outline #2D2D2D, flat color fills, minimal dot-eye face. "
        f"Young SHS-age figure, {describe_character(character)}, {describe_clothes(clothes)}. "
        f"Pose: {scene['stance']}, {scene['action']}. "
        f"Hero prop: {scene['hero_prop']}. Supporting props: {props}. "
        "Entire canvas filled with flat #FDFCF8 background plus thin grey floor line and faint grey decorative circles — "
        "NO text, NO letter, NO border frame, NO transparency. "
        f"{accent_phrase(color, code)} {scene['mood'].capitalize()}. Full head-to-feet visible."
    )


def build_negative(code: str, sensitive: bool) -> str:
    base = (
        "face photograph, realistic skin pores, text, watermark, "
        f"letter {code}, border frame, sticker card, top-down POV hands only, "
        "white background fill, photorealistic, 3d render, cropped head, extra limbs"
    )
    if sensitive:
        base += ", distress, crying, sadness, crisis imagery, crowds, violence"
    return base


def sync_prompt_file(path: Path, choices: dict[str, dict]) -> None:
    data = json.loads(path.read_text(encoding="utf-8"))
    slot = data["questionnaire"]["slot"]
    choice = choices[slot]
    scene = SCENES[slot]
    code = choice["code"]
    qid = data["questionnaire"]["question_id"]
    opt = data["questionnaire"]["option_key"]

    data["asset_set"] = f"Questionnaire Q{qid} option {opt} — {choice['choice_text']}"
    qblock = data["questionnaire"]
    qblock["question_text"] = choice["question_text"]
    qblock["choice_text"] = choice["choice_text"]
    qblock["hint"] = choice["hint"]
    qblock["riasec_code"] = code
    qblock["riasec_type"] = RIASEC_TYPES[code]
    qblock["sensitive_topic"] = slot in SENSITIVE_SLOTS

    data["color"]["riasec_code"] = code
    data["art_style"]["mood"] = scene["mood"]

    narrative = (
        f"A diverse young student in a full-body flat vector scene: {scene['action']}. "
        f"Hero focus on {scene['hero_prop']}. "
        f"Activity matches \"{choice['choice_text']}\" — same KursoKo style as 01.1 and 01.2 references."
    )

    subject = data["subject"]
    subject["choice_label"] = choice["choice_text"]
    subject["activity_hint"] = choice["hint"]
    subject["scene_narrative"] = narrative
    subject["hero_prop"] = scene["hero_prop"]
    subject["supporting_props"] = scene["supporting_props"]
    subject["symbolic"] = scene.get("symbolic", slot in SENSITIVE_SLOTS)

    if slot in SENSITIVE_SLOTS:
        subject["sensitive_handling"] = (
            "Hopeful symbolic full-body scene only — calm smiling minimal face, "
            "no distress, crisis, or harsh imagery."
        )

    pose = data["pose"]
    pose["stance"] = scene["stance"]
    pose["action"] = scene["action"]

    comp = data["composition"]
    comp["thumbnail_test"] = f"silhouette of {scene['thumbnail_test']} readable at 160px"

    data["generation"]["negative_prompt"] = build_negative(code, slot in SENSITIVE_SLOTS)
    data["prompt_for_image_ai"] = build_prompt(data, scene, choice)

    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def sync_all_prompts() -> int:
    choices = load_question_choices()
    count = 0
    for path in sorted(DIR.glob("q*.json")):
        sync_prompt_file(path, choices)
        count += 1
    return count


def build_manifest() -> int:
    entries = []
    for path in sorted(DIR.glob("q*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        q = data["questionnaire"]
        entries.append(
            {
                "prompt_file": f"questionnaire/{path.name}",
                "schema_version": data.get("schema_version", 4),
                "slot": q["slot"],
                "question_id": q["question_id"],
                "option_key": q["option_key"],
                "choice_text": q["choice_text"],
                "riasec_code": q["riasec_code"],
                "output_png": data["deliverable"]["filename"],
                "sensitive": q.get("sensitive_topic", False),
            }
        )

    manifest = {
        "project": "KursoKo",
        "asset_set": "Questionnaire choice illustrations",
        "version": 4,
        "source_of_truth": "individual qNN.M.json files in this folder",
        "schema": "questionnaire/_schema-v4.json",
        "total_questions": 30,
        "total_choices": len(entries),
        "spec": {
            "style": "flat vector full-body v4",
            "size_px": "640x640",
            "output_dir": "src/assets/questionnaire/",
            "naming": "NN.M.png — e.g. 01.1.png = Q1 option A",
        },
        "choices": entries,
    }
    out = DIR / "manifest.json"
    out.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return len(entries)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--sync-copy", action="store_true", help="Sync q*.json from questions.json")
    args = parser.parse_args()

    if args.sync_copy:
        n = sync_all_prompts()
        print(f"Synced {n} prompt files from {QUESTIONS.relative_to(ROOT)}")
    count = build_manifest()
    print(f"Wrote manifest with {count} entries")


if __name__ == "__main__":
    main()
