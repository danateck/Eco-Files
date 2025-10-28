import re
import os
from pdf2image import convert_from_path
import pytesseract
from PIL import Image, ImageFilter
import cv2
import numpy as np
import dateparser
from datetime import timedelta

# ---- SYSTEM CONFIG ----
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
POPLER_PATH = r"C:\Users\danag\Downloads\Release-25.07.0-0\poppler-25.07.0\Library\bin"

PDF_LIST = [
    r"אחריות - אייפד.pdf",
    r"אחריות - טלויזיה.pdf",
    r"תעודת משלוח.pdf"
]

# ---- OCR PREPROCESS ----
def preprocess_for_ocr(pil_img):
    # grayscale
    img = np.array(pil_img.convert("L"))
    # blur
    img = cv2.GaussianBlur(img, (3,3), 0)
    # adaptive threshold
    img = cv2.adaptiveThreshold(
        img, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        11, 2
    )
    # unsharp (חדות)
    pil_out = Image.fromarray(img)
    pil_out = pil_out.filter(ImageFilter.UnsharpMask(radius=1, percent=200, threshold=3))
    return pil_out

def ocr_try_all(img_pil):
    """
    נריץ OCR עם heb, heb+eng, eng.
    נחזיר:
    - full_text_merged: כל הטקסטים מחוברים (כדי שנחלץ מהם תאריך וכו')
    - per_lang: מילון לפי שפה, אם תרצי לדבג
    """
    config = r'--oem 1 --psm 3'
    langs = ['heb', 'heb+eng', 'eng']
    texts = []
    per_lang = {}

    for lang in langs:
        try:
            txt = pytesseract.image_to_string(img_pil, lang=lang, config=config)
            per_lang[lang] = txt
            texts.append(txt)
        except Exception:
            per_lang[lang] = ""
            continue

    merged = "\n\n".join(texts)
    return merged, per_lang

# ---- PDF -> images with dynamic DPI ----
def pdf_to_images(pdf_path):
    base_name = os.path.basename(pdf_path)
    if "אייפד" in base_name or "משלוח" in base_name:
        dpi = 500
    else:
        dpi = 300
    return convert_from_path(pdf_path, dpi=dpi, poppler_path=POPLER_PATH)

# ---- FIELD EXTRACTION HELPERS ----

DATE_PATTERNS = [
    r'\b(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})\b',
    r'\b(\d{1,2}\s+[\/\-]\s*\d{1,2}\s+[\/\-]\s*\d{2,4})\b',
    r'\b(\d{1,2}\s+(?:ב|ל)?\s*(?:ינואר|פברואר|מרץ|אפריל|מאי|יוני|יולי|אוגוסט|ספטמבר|אוקטובר|נובמבר|דצמבר)\s*\d{2,4})\b',
    r'\b(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s*\d{2,4})\b',
]

def clean_date_candidates(raw_text):
    # שלב 1: לאסוף כל מה שנראה כמו תאריך
    raw_candidates = set()
    for pat in DATE_PATTERNS:
        for m in re.findall(pat, raw_text, flags=re.IGNORECASE | re.UNICODE):
            raw_candidates.add(m.strip())

    parsed = []

    # שלב 2: לכל מועמד, ננסה גם לתקן אותו אם הוא שבור
    for cand in raw_candidates:
        # מייצרים רשימת גרסאות אפשריות: המקור + תיקונים חכמים
        to_try = try_fix_broken_date(cand)

        for candidate_version in to_try:
            dt = dateparser.parse(
                candidate_version,
                languages=['he','en'],
                settings={'PREFER_DAY_OF_MONTH': 'first'}
            )
            if not dt:
                continue

            day = dt.day
            month = dt.month
            year = dt.year

            # sanity filter כדי לא לתפוס שטויות אמיתיות
            if day < 1 or day > 31:
                continue
            if month < 1 or month > 12:
                continue
            if year > 2035:
                continue

            parsed.append({
                "raw": candidate_version,
                "date": dt.date().isoformat()
            })

    # להסיר כפולים
    unique = []
    seen = set()
    for item in parsed:
        key = (item["raw"], item["date"])
        if key not in seen:
            seen.add(key)
            unique.append(item)

    # למיין לפי תאריך כרונולוגי
    unique = sorted(unique, key=lambda x: x["date"])
    return unique


WARRANTY_KEYWORDS = [
    'אחריות', 'תקופת האחריות', 'תוקף', 'תוקף האחריות',
    'Warranty', 'Valid until', 'Warranty until'
]

def find_warranty_context(full_text):
    lines = full_text.splitlines()
    found = []
    for i, line in enumerate(lines):
        for kw in WARRANTY_KEYWORDS:
            if kw.lower() in line.lower():
                ctx = "\n".join(lines[max(0,i-2):min(len(lines),i+3)])
                found.append({"line": line, "context": ctx})
    return found

VENDOR_KEYWORDS = [
    'KSP', 'AUTHORIZED', 'Authorised', 'Reseller', 'Invoice', 'חשבונית',
    'תעודת משלוח', 'ספק', 'חנות', 'חברת', 'שם חברה', 'מוכר', 'ספקית',
    'Distributor','Sold by','From','טלפון','phone','www','http','@'
]

def find_vendor(full_text):
    lines = [l.strip() for l in full_text.splitlines() if l.strip()]
    header_lines = lines[:20]

    best_line = None
    best_score = 0.0

    for ln in header_lines:
        score = 0
        for kw in VENDOR_KEYWORDS:
            if kw.lower() in ln.lower():
                score += 1
        if re.search(r'(טלפון|phone|www|http|@)', ln, flags=re.IGNORECASE):
            score += 0.5
        if not ln.startswith("---PAGE"):
            score += 0.2

        if score > best_score:
            best_score = score
            best_line = ln

    if best_line:
        return {
            "vendor_line": best_line,
            "confidence": min(0.9, 0.4 + best_score/3)
        }

    if header_lines:
        return {"vendor_line": header_lines[0], "confidence": 0.3}

    return None

OWNER_KEYWORDS = [
    'לכבוד','לקוח','שם','לקוח:','ללקוח','Customer','Name'
]

def find_owner(full_text):
    for ln in full_text.splitlines():
        for kw in OWNER_KEYWORDS:
            if kw.lower() in ln.lower():
                val = ln.split(':')[-1].strip()
                return {
                    "owner": val or ln.strip(),
                    "confidence": 0.8
                }
    return None


def try_fix_broken_date(raw_candidate: str):
    """
    מקבל מחרוזת שה-OCR חשב שהיא תאריך (למשל '10/40/23'),
    ומנסה לתקן מקרים נפוצים כמו החלפת 0 ב-4 או ערבוב ספרות.

    מחזיר רשימה של מועמדים חלופיים (כולל המקורי בסוף).
    """
    cands = [raw_candidate]

    # ננסה רק על פורמט dd/mm/yy או dd/mm/yyyy
    m = re.match(r'^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$', raw_candidate)
    if not m:
        return cands

    d, mth, y = m.group(1), m.group(2), m.group(3)

    # אם החודש גדול מ-12, ננסה לתקן
    try:
        month_int = int(mth)
    except:
        month_int = 99

    if month_int > 12:
        # טריק נפוץ: OCR קרא '10/40/23' במקום '10/10/23'
        # במקרה כזה, אם שתי הספרות של החודש הן '40',
        # ננסה להחליף ל'10'
        if mth == "40":
            fixed = f"{d}/10/{y}"
            cands.insert(0, fixed)

        # עוד מקרה: אם החודש בנוי משתי ספרות והשנייה '0',
        # ננסה להחליף את הראשונה ל'1'
        if len(mth) == 2 and mth[1] == "0":
            alt = f"{d}/1{mth[1]}/{y}"  # נניח '10' -> '10', '40' -> '10', '90' -> '10'
            if alt not in cands:
                cands.insert(0, alt)

        # מקרה דומה: אם החודש נראה כמו '41' או '49' וכו', ננסה להחליף '4' ב'1'
        if mth.startswith("4"):
            alt2 = f"{d}/1{mth[1:]}/{y}"
            if alt2 not in cands:
                cands.insert(0, alt2)

    return cands



def compute_expiry_if_possible(full_text, parsed_dates):
    if not parsed_dates:
        return None

    # נניח שהתאריך הראשון הוא תאריך קנייה
    buy_dt = dateparser.parse(
        parsed_dates[0]["raw"],
        languages=['he','en'],
        settings={'PREFER_DAY_OF_MONTH': 'first'}
    )
    if not buy_dt:
        return None

    m = re.search(
        r'(\d{1,3})\s*(חודש|חודשים|חוד’|חוד׳|חוד\"|שנה|שנים|month|months|year|years)',
        full_text,
        flags=re.IGNORECASE | re.UNICODE
    )
    if not m:
        return None

    try:
        num = int(m.group(1))
    except:
        return None

    unit = m.group(2)

    if 'שנה' in unit or 'year' in unit:
        expiry = buy_dt + timedelta(days=365 * num)
    else:
        expiry = buy_dt + timedelta(days=30 * num)

    return expiry.date().isoformat()

# ---- MAIN EXTRACT ----
def extract_from_pdf(pdf_path):
    result = {
        "file": os.path.basename(pdf_path),
        "summary": {},
        "pages": []
    }

    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"לא נמצא הקובץ: {pdf_path}")

    # הפוך PDF -> תמונות -> OCR לכל עמוד
    images = pdf_to_images(pdf_path)

    all_text_merged = ""  # נאסוף פה את כל העמודים
    for idx, img in enumerate(images):
        prepped = preprocess_for_ocr(img)
        merged_text, per_lang = ocr_try_all(prepped)

        # נשמור טקסט של העמוד (merged בין השפות)
        all_text_merged += f"\n\n---PAGE {idx+1}---\n\n{merged_text}"

        # נשמור גם דוגמית לעמוד
        result["pages"].append({
            "page": idx+1,
            "raw_text_excerpt": merged_text[:1000]
        })

    # עכשיו חילוץ השדות על הטקסט המשולב של כל העמודים וכל השפות
    parsed_dates = clean_date_candidates(all_text_merged)
    warranty_blurbs = find_warranty_context(all_text_merged)
    vendor_guess = find_vendor(all_text_merged)
    owner_guess = find_owner(all_text_merged)
    expiry_guess = compute_expiry_if_possible(all_text_merged, parsed_dates)

    purchase_date = parsed_dates[0]["date"] if parsed_dates else None

    confidence_notes = []
    if not purchase_date:
        confidence_notes.append("לא נמצאה תאריך קנייה חד משמעית")
    if vendor_guess and vendor_guess.get("confidence",0) < 0.5:
        confidence_notes.append("זיהוי ספק לא בטוח, צריך עין של בנאדם")
    if not expiry_guess and not warranty_blurbs:
        confidence_notes.append("לא מצאתי אחריות בטקסט")

    result["summary"] = {
        "purchase_date": purchase_date,
        "all_dates_found": parsed_dates,
        "warranty_until_calculated": expiry_guess,
        "warranty_mentions": warranty_blurbs,
        "vendor": vendor_guess,
        "owner": owner_guess,
        "confidence_notes": confidence_notes
    }

    # אפשר לשמור גם טקסט מלא לדיבוג אם תרצי בעתיד
    # result["debug_full_text"] = all_text_merged[:6000]

    return result

# ---- RUN ----
if __name__ == "__main__":
    import json
    for pdf_file in PDF_LIST:
        print("=============================================")
        print("Scanning:", pdf_file)
        data = extract_from_pdf(pdf_file)
        print(json.dumps(data["summary"], ensure_ascii=False, indent=2))
        print("=============================================\n")
