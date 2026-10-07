from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.database.models import ForensicAnalysis
from app.services.report_service import generate_forensic_report

router = APIRouter(prefix="/report", tags=["Reports"])

@router.get("/{analysis_id}")
def get_forensic_report_endpoint(analysis_id: str, db: Session = Depends(get_db)):
    record = db.query(ForensicAnalysis).filter(ForensicAnalysis.id == analysis_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Forensic record not found.")

    record_dict = {
        "id": record.id,
        "filename": record.filename,
        "media_type": record.media_type,
        "file_size_bytes": record.file_size_bytes,
        "verdict": record.verdict,
        "probability": record.probability,
        "confidence": record.confidence,
        "model_name": record.model_name,
        "model_version": record.model_version,
        "processing_time_ms": record.processing_time_ms,
        "metadata_json": record.metadata_json or {},
        "explainability_json": record.explainability_json or {}
    }

    report = generate_forensic_report(record_dict)
    return report
