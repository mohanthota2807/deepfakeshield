import uuid
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from app.config import settings
from app.database.db import get_db
from app.database.models import ForensicAnalysis
from app.preprocessing.video import parse_video_metadata
from app.inference.video_inference import run_video_inference

router = APIRouter(prefix="/analyze/video", tags=["Video Forensics"])

ALLOWED_VIDEO_EXTENSIONS = {".mp4", ".mov", ".avi", ".webm"}

@router.post("")
async def analyze_video_endpoint(
    file: UploadFile = File(...),
    demo_mode: bool = Form(True),
    db: Session = Depends(get_db)
):
    filename = file.filename or "unknown.mp4"
    ext = "." + filename.split(".")[-1].lower() if "." in filename else ""
    if ext not in ALLOWED_VIDEO_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Allowed formats: MP4, MOV, AVI, WEBM."
        )

    content = await file.read()
    size_mb = len(content) / (1024 * 1024)
    if size_mb > settings.MAX_VIDEO_SIZE_MB:
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds maximum allowed size of {settings.MAX_VIDEO_SIZE_MB} MB."
        )

    meta = parse_video_metadata(content, filename)
    result = run_video_inference(meta, is_demo=demo_mode)

    analysis_id = str(uuid.uuid4())
    record = ForensicAnalysis(
        id=analysis_id,
        filename=filename,
        media_type="video",
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
            "timeline": result["suspicious_timeline"],
            "frames": result["frame_samples"],
            "pipeline": result["pipeline_stages"]
        }
    )
    db.add(record)
    db.commit()

    return {
        "analysis_id": analysis_id,
        "filename": filename,
        "media_type": "video",
        "metadata": meta,
        **result
    }
