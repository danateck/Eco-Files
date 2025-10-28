from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import shutil
import uuid
import os

# חשוב: לייבא את המנוע שלך
# אם הקובץ שלך נקרא python.py ויש שם extract_from_pdf אז זה טוב.
# אם תשני את השם ל-extractor.py אז תעדכני כאן.
from python import extract_from_pdf

app = FastAPI()

# איפה לשמור את הקובץ רגע בזמן העיבוד
UPLOAD_DIR = "uploads_tmp"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/extract")
async def extract_info(file: UploadFile = File(...)):
    # נשמור זמנית (שם רנדומלי כדי למנוע התנגשות)
    _, ext = os.path.splitext(file.filename)
    tmp_name = f"{uuid.uuid4()}{ext}"
    tmp_path = os.path.join(UPLOAD_DIR, tmp_name)

    with open(tmp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # מריצים את ה-OCR והחילוץ
        data = extract_from_pdf(tmp_path)  # מחזיר dict עם "summary"
    except Exception as e:
        # אם יש כשל (למשל בעיית Poppler או Tesseract)
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )
    finally:
        # מוחקים את הקובץ, כי אמרת נכון: אנחנו לא שומרים מסמכים בשרת
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

    # מכינים אובייקט "נעים לפרונט"
    summary = data.get("summary", {})

    response_obj = {
        "purchase_date": summary.get("purchase_date"),
        "all_dates_found": summary.get("all_dates_found"),
        "warranty_until_calculated": summary.get("warranty_until_calculated"),
        "warranty_mentions": summary.get("warranty_mentions"),
        "vendor": summary.get("vendor"),
        "owner": summary.get("owner"),
        "confidence_notes": summary.get("confidence_notes"),
    }

    return JSONResponse(content=response_obj)
