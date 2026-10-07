# DeepFakeShield — AI Media Forensics Platform

DeepFakeShield is an enterprise-grade AI media forensics platform that analyzes **images, videos, and audio** to detect synthetic manipulation, face swapping, voice cloning, and AI-generated media.

Designed for digital forensic investigators, cybersecurity analysts, and media verification teams, DeepFakeShield combines spatial anomaly inspection, temporal consistency tracking, frequency-domain acoustic spectrogram modeling, and multimodal feature fusion.

---

## System Architecture

```
deepfakeshield/
├── frontend/               # React 18, TypeScript, Tailwind CSS, Canvas Forensics
│   ├── src/
│   │   ├── components/     # UI components (Uploader, HeatmapViewer, Timeline, etc.)
│   │   ├── pages/          # Landing, Dashboard, Image, Video, Audio, Multimodal, History, Reports, Models, Settings
│   │   ├── services/       # API client, Forensic Engine (Demo/Fallback), Local Storage
│   │   └── types/          # Forensic data contracts and types
│   └── index.html          # Standalone entry point & production build
├── backend/                # Python FastAPI, SQLite, OpenCV, Librosa, PyTorch
│   ├── app/
│   │   ├── api/routes/     # REST routes: image, video, audio, multimodal, history, models, reports
│   │   ├── preprocessing/  # Face alignment, frame extraction, mel-spectrogram extraction
│   │   ├── inference/      # Model forward passes & multimodal fusion
│   │   ├── explainability/ # Grad-CAM heatmaps & spatial anomaly detection
│   │   ├── services/       # Analysis coordination & digital forensics reporting
│   │   └── database/       # Forensic audit database & schema
│   ├── requirements.txt
│   └── run_backend.py
├── ml/                     # ML pipelines, training scripts, dataset specifications
│   ├── datasets/           # Dataset guidelines (FF++, DFDC, ASVspoof)
│   ├── training/           # PyTorch training pipelines
│   └── evaluation/         # Forensic evaluation & ROC-AUC verification
├── docs/                   # Engineering & forensic methodology documentation
│   ├── architecture/       # Forensic pipeline specs
│   ├── api/                # OpenAPI specification details
│   └── model/              # Model cards & evaluation metrics
└── README.md
```

---

## Forensic Pipeline Overview

1. **Image Forensics**:
   - Spatial Feature Extraction: EfficientNet-B4 / Vision Transformer (ViT)
   - Explainability: Grad-CAM gradient backpropagation for anomalous regions
   - Anomaly Checks: Facial boundary blending artifacts, sensor noise residual (PRNU), lighting inconsistencies, eye reflection symmetry

2. **Video Forensics**:
   - Multi-Frame Extraction & Alignment: MTCNN / RetinaFace face detection
   - Spatial Deepfake Analysis + Temporal LSTM / Transformer temporal coherency
   - Frame-Level Timeline Scrubbing: Suspicious window localization
   - Temporal consistency score across adjacent frames

3. **Audio Forensics**:
   - Acoustic Preprocessing: 16kHz resampled Log-Mel Spectrogram & Constant Q-Transform (CQT)
   - Voice Synthesis Detection: Spectral boundary discontinuities, phase irregularities, robotic vocoder artifacts
   - Suspicious Segment Mapping: Temporal frame-by-frame acoustic confidence

4. **Multimodal Fusion**:
   - Visual Anomaly Vector ($F_{vis}$) + Acoustic Synthesis Vector ($F_{aud}$)
   - Cross-Modal Attention & Fusion Classifier (Backend-owned fusion matrix)
   - Final Forensic Verdict: `AUTHENTIC`, `DEEPFAKE`, or `UNCERTAIN`

---

## Quick Start

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Alternatively, open `frontend/index.html` directly in any modern browser for immediate evaluation.

### 2. Backend Setup (Optional for Full API Mode)
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python run_backend.py
```
The FastAPI backend runs on `http://localhost:8000` with Swagger docs available at `http://localhost:8000/docs`.

---

## Ethical Disclosure & Forensic Disclaimer
AI-generated media detection is probabilistic. DeepFakeShield provides forensic indicators and anomaly explanations to assist human investigators, rather than definitive legal proof.
