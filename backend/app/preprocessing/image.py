import io
import math
from PIL import Image

def preprocess_image_file(file_bytes: bytes):
    """
    Validates, extracts metadata, and normalizes image for forensic tensor pipelines.
    """
    image = Image.open(io.BytesIO(file_bytes))
    format_name = image.format or "UNKNOWN"
    width, height = image.size
    mode = image.mode

    # Convert to RGB if needed
    if mode != "RGB":
        image = image.convert("RGB")

    metadata = {
        "width": width,
        "height": height,
        "format": format_name,
        "mode": mode,
        "megapixels": round((width * height) / 1_000_000, 2),
        "aspect_ratio": f"{round(width / max(height, 1), 2)}:1"
    }

    return image, metadata
