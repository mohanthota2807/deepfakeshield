import uuid
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from app.config import settings
from app.database.db import get_db
from app.database.models import ForensicAnalysis
from app.preprocessing.audio import parse_audio_metadata
from app.inference.audio_inference import run_audio_inference

router = APIRouter(prefix="/analyze/audio", tags=["Audio Forensics"])

ALLOWED_AUDIO_EXTENSIONS = {".mp3", ".wav", ".m4a", ".flac"}

@router.post("")
async def analyze_audio_endpoint(
    file: UploadFile = File(...),
    demo_mode: bool = Form(True),
    db: Session = Depends(get_db)
):
    filename = file.filename or "unknown.wav"
    ext = "." + filename.split(".")[-1].lower() if "." in filename else ""
    if ext not in ALLOWED_AUDIO_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Allowed formats: MP3, WAV, M4A, FLAC."
        )

    content = await file.read()
    size_mb = len(content) / (1024 * 1024)
    if size_mb > settings.MAX_AUDIO_SIZE_MB:
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds maximum allowed size of {settings.MAX_AUDIO_SIZE_MB} MB."
        )

    meta = parse_audio_metadata(content, filename)
    result = run_audio_inference(meta, is_demo=demo_mode)

    analysis_id = str(uuid.uuid4())
    record = ForensicAnalysis(
        id=analysis_id,
        filename=filename,
        media_type="audio",
        file_size_bytes=len(content),
        verdict=result["verdict"],
        probability=result["ai_generated_probability"],
        confidence=result["authenticity_confidence"],
        model_name=result["model_name"],
        model_version=result["model_version"],
        processing_time_ms=result["processing_time_ms"],
        is_demo="true" if demo_mode else "false",
        metadata_json=meta,
        explainability_json={
            "suspicious_segments": result["suspicious_segments"],
            "acoustic_features": result["acoustic_features"]
        }
    )
    db.add(record)
    db.commit()

    return {
        "analysis_id": analysis_id,
        "filename": filename,
        "media_type": "audio",
        "metadata": meta,
        **result
    }
