import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "DeepFakeShield API"
    APP_VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
    DATABASE_URL: str = "sqlite:///./deepfakeshield.db"
    MAX_IMAGE_SIZE_MB: int = 20
    MAX_VIDEO_SIZE_MB: int = 150
    MAX_AUDIO_SIZE_MB: int = 50
    DEMO_MODE_DEFAULT: bool = True

settings = Settings()
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
