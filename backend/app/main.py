import uuid
from datetime import datetime, timedelta
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database.db import init_db, SessionLocal
from app.database.models import ForensicAnalysis
from app.api.routes import image, video, audio, multimodal, history, models, reports

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Enterprise-grade AI Media Forensics Platform for synthetic media and deepfake detection."
)

# CORS setup for seamless React frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Database Schema
init_db()

# Seed initial representative history items if database is freshly initialized
def seed_default_history():
    db = SessionLocal()
    try:
        count = db.query(ForensicAnalysis).count()
        if count == 0:
            samples = [
                ForensicAnalysis(
                    id="dfs-rec-9821a",
                    filename="evidence_portrait_speech.mp4",
                    media_type="video",
                    file_size_bytes=14200000,
                    verdict="DEEPFAKE",
                    probability=91.7,
                    confidence=89.4,
                    model_name="RetinaFace + SpatialViT + TemporalTransformer-v3",
                    model_version="3.1.0",
                    processing_time_ms=1640.0,
                    is_demo="true",
                    created_at=datetime.utcnow() - timedelta(hours=2, minutes=15),
                    metadata_json={"fps": 30, "duration": 42.0, "resolution": "1920x1080"},
                    explainability_json={"suspicious_segments": ["00:13 - 00:17", "00:24 - 00:28"]}
                ),
                ForensicAnalysis(
                    id="dfs-rec-8843b",
                    filename="press_briefing_audio.wav",
                    media_type="audio",
                    file_size_bytes=4800000,
                    verdict="AI-GENERATED",
                    probability=88.4,
                    confidence=91.2,
                    model_name="AASIST-SpectroGraph-v2 + RawNet2",
                    model_version="2.2.0",
                    processing_time_ms=880.0,
                    is_demo="true",
                    created_at=datetime.utcnow() - timedelta(hours=5, minutes=40),
                    metadata_json={"duration_sec": 18.5, "sample_rate": 44100},
                    explainability_json={"acoustic_anomalies": ["Vocoder phase cancellation at 3.2kHz"]}
                ),
                ForensicAnalysis(
                    id="dfs-rec-7712c",
                    filename="executive_id_photo.jpg",
                    media_type="image",
                    file_size_bytes=2400000,
                    verdict="AUTHENTIC",
                    probability=6.8,
                    confidence=94.2,
                    model_name="EfficientNet-B4 + ForensicViT-v2",
                    model_version="2.4.1",
                    processing_time_ms=420.0,
                    is_demo="true",
                    created_at=datetime.utcnow() - timedelta(days=1, hours=3),
                    metadata_json={"width": 1920, "height": 1080, "format": "JPEG"},
                    explainability_json={"anomalies_detected": 0}
                ),
                ForensicAnalysis(
                    id="dfs-rec-6590d",
                    filename="wire_transfer_verification.mp3",
                    media_type="audio",
                    file_size_bytes=3100000,
                    verdict="UNCERTAIN",
                    probability=51.2,
                    confidence=54.0,
                    model_name="AASIST-SpectroGraph-v2 + RawNet2",
                    model_version="2.2.0",
                    processing_time_ms=750.0,
                    is_demo="true",
                    created_at=datetime.utcnow() - timedelta(days=2, hours=1),
                    metadata_json={"duration_sec": 12.0, "sample_rate": 22050},
                    explainability_json={"notes": "Low SNR and compression noise prevents definitive attribution."}
                )
            ]
            db.add_all(samples)
            db.commit()
    finally:
        db.close()

seed_default_history()

# Register API Routers
app.include_router(image.router, prefix=settings.API_PREFIX)
app.include_router(video.router, prefix=settings.API_PREFIX)
app.include_router(audio.router, prefix=settings.API_PREFIX)
app.include_router(multimodal.router, prefix=settings.API_PREFIX)
app.include_router(history.router, prefix=settings.API_PREFIX)
app.include_router(models.router, prefix=settings.API_PREFIX)
app.include_router(reports.router, prefix=settings.API_PREFIX)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "operational",
        "service": "DeepFakeShield API",
        "version": settings.APP_VERSION,
        "models_status": {
            "image_model": "active",
            "video_model": "active",
            "audio_model": "active",
            "multimodal_fusion": "active"
        },
        "system_time": datetime.utcnow().isoformat() + "Z"
    }

@app.get("/", tags=["Root"])
def root():
    return {
        "platform": "DeepFakeShield AI Media Forensics Platform",
        "documentation": "/docs",
        "version": settings.APP_VERSION
    }
