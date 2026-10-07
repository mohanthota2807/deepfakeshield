from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Text, JSON
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class ForensicAnalysis(Base):
    __tablename__ = "analyses"

    id = Column(String, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    media_type = Column(String, nullable=False) # 'image', 'video', 'audio', 'multimodal'
    file_size_bytes = Column(Float, default=0.0)
    verdict = Column(String, nullable=False) # 'AUTHENTIC', 'DEEPFAKE', 'UNCERTAIN'
    probability = Column(Float, nullable=False) # 0.0 to 100.0
    confidence = Column(Float, nullable=False) # 0.0 to 100.0
    model_name = Column(String, nullable=False)
    model_version = Column(String, default="1.0.0")
    processing_time_ms = Column(Float, default=0.0)
    is_demo = Column(String, default="true")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Forensic detail JSON payloads
    metadata_json = Column(JSON, default={})
    explainability_json = Column(JSON, default={})
    report_hash = Column(String, nullable=True)
