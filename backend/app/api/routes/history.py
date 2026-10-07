from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from app.database.db import get_db
from app.database.models import ForensicAnalysis

router = APIRouter(prefix="/history", tags=["History"])

@router.get("")
def get_analysis_history(
    media_type: Optional[str] = Query(None),
    verdict: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
) -> List[Dict[str, Any]]:
    query = db.query(ForensicAnalysis)

    if media_type and media_type.lower() != "all":
        query = query.filter(ForensicAnalysis.media_type == media_type.lower())

    if verdict and verdict.lower() != "all":
        query = query.filter(ForensicAnalysis.verdict == verdict.upper())

    if search:
        query = query.filter(ForensicAnalysis.filename.contains(search))

    records = query.order_by(ForensicAnalysis.created_at.desc()).all()

    return [
        {
            "id": r.id,
            "filename": r.filename,
            "media_type": r.media_type,
            "verdict": r.verdict,
            "probability": r.probability,
            "confidence": r.confidence,
            "model_name": r.model_name,
            "processing_time_ms": r.processing_time_ms,
            "is_demo": r.is_demo == "true",
            "created_at": r.created_at.strftime("%Y-%m-%d %H:%M:%S UTC") if r.created_at else "Unknown",
            "metadata": r.metadata_json or {},
            "explainability": r.explainability_json or {}
        }
        for r in records
    ]

@router.delete("/{analysis_id}")
def delete_analysis_record(analysis_id: str, db: Session = Depends(get_db)):
    record = db.query(ForensicAnalysis).filter(ForensicAnalysis.id == analysis_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis record not found.")
    db.delete(record)
    db.commit()
    return {"message": "Record deleted successfully", "id": analysis_id}
