import uuid
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from app.config import settings
from app.database.db import get_db
from app.database.models import ForensicAnalysis
from app.preprocessing.image import preprocess_image_file
from app.inference.image_inference import run_image_inference

router = APIRouter(prefix="/analyze/image", tags=["Image Forensics"])

ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

@router.post("")
async def analyze_image_endpoint(
    file: UploadFile = File(...),
    demo_mode: bool = Form(True),
    db: Session = Depends(get_db)
):
    # Validate extension
    filename = file.filename or "unknown.jpg"
    ext = "." + filename.split(".")[-1].lower() if "." in filename else ""
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Allowed formats: JPG, JPEG, PNG, WEBP."
        )

    # Read and validate size
    content = await file.read()
    size_mb = len(content) / (1024 * 1024)
    if size_mb > settings.MAX_IMAGE_SIZE_MB:
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds maximum allowed size of {settings.MAX_IMAGE_SIZE_MB} MB."
        )

    try:
        image, meta = preprocess_image_file(content)
        result = run_image_inference(image, meta, is_demo=demo_mode)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis couldn't be completed. The image preprocessing service encountered an error: {str(e)}"
        )

    # Save to forensic audit log
    analysis_id = str(uuid.uuid4())
    record = ForensicAnalysis(
        id=analysis_id,
        filename=filename,
        media_type="image",
        file_size_bytes=len(content),
        verdict=result["verdict"],
        probability=result["deepfake_probability"],
        confidence=result["authenticity_confidence"],
        model_name=result["model_name"],
        model_version=result["model_version"],
        processing_time_ms=result["processing_time_ms"],
        is_demo="true" if demo_mode else "false",
        metadata_json=meta,
        explainability_json={
            "anomalies": result["anomalies"],
            "suspicious_regions": result["suspicious_regions"]
        }
    )
    db.add(record)
    db.commit()

    return {
        "analysis_id": analysis_id,
        "filename": filename,
        "media_type": "image",
        "metadata": meta,
        **result
    }
