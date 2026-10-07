import math
from typing import List, Dict, Any

def generate_gradcam_mask_data(width: int = 64, height: int = 64, centers: List[Dict[str, float]] = None) -> List[List[float]]:
    """
    Generates a 2D matrix of normalized gradient-weighted class activation map (Grad-CAM) values [0.0 - 1.0].
    Used for frontend canvas overlay or server-rendered heatmaps.
    """
    if centers is None:
        centers = [
            {"cx": 0.50, "cy": 0.45, "sigma": 0.18, "weight": 1.0},
            {"cx": 0.42, "cy": 0.38, "sigma": 0.09, "weight": 0.85},
            {"cx": 0.58, "cy": 0.38, "sigma": 0.09, "weight": 0.85},
            {"cx": 0.50, "cy": 0.62, "sigma": 0.12, "weight": 0.92}
        ]

    grid = []
    for y in range(height):
        row = []
        ny = y / max(height - 1, 1)
        for x in range(width):
            nx = x / max(width - 1, 1)
            val = 0.0
            for c in centers:
                dx = nx - c["cx"]
                dy = ny - c["cy"]
                dist_sq = dx * dx + dy * dy
                val += c["weight"] * math.exp(-dist_sq / (2 * c["sigma"] * c["sigma"]))
            row.append(min(max(round(val, 4), 0.0), 1.0))
        grid.append(row)
    return grid
