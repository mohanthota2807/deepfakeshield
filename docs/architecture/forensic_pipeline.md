# DeepFakeShield — Forensic Architecture & Pipeline Specification

## 1. Image Forensic Pipeline

```
Raw Image (JPG/PNG/WEBP)
      │
      ▼
Spatial Preprocessing & Color Calibration
      │
      ├──────────────────────────────┬──────────────────────────────┐
      ▼                              ▼                              ▼
Facial Landmark Extractor     PRNU Noise Residual           2D DCT Frequency
(RetinaFace 5-point)          (Sensor Fingerprint)          (Compression Check)
      │                              │                              │
      └──────────────────────────────┼──────────────────────────────┘
                                     ▼
                     EfficientNet-B4 + ViT Attention
                                     │
                                     ▼
                       Grad-CAM Backpropagation
                                     │
                                     ▼
                Probability, Confidence, Anomaly Vectors
```

## 2. Video Temporal Forensic Pipeline

```
Video Stream (MP4/MOV/WEBM)
      │
      ▼
Frame Extraction (30 FPS)
      │
      ▼
Face Landmark Alignment & Cropping
      │
      ▼
Spatial Feature Extraction per Frame
      │
      ▼
Temporal Coherence Network (Bi-LSTM / Temporal Transformer)
      │
      ▼
Frame-Level Predictions (Timestamped Array)
      │
      ▼
Temporal Timeline Windowing (e.g. 00:13 - 00:17)
      │
      ▼
Bayesian Aggregation & Final Video Verdict
```

## 3. Audio Forensic Pipeline

```
Audio Signal (WAV/MP3/M4A/FLAC)
      │
      ▼
16kHz Resampling & Peak Normalization
      │
      ▼
Log-Mel Spectrogram (64 filterbanks) + CQT
      │
      ▼
AASIST Graph Neural Network
      │
      ▼
Phase Continuity & Vocoder Artifact Detection
      │
      ▼
Segment-Level Anomaly Mapping
```

## 4. Multimodal Fusion Engine

```
Visual Anomaly Vector (87%) ────────┐
                                    ▼
                         Cross-Modal Attention
                         (Backend-Owned Fusion)
                                    ▲
Audio Synthesis Vector (72%) ───────┘
                                    │
                                    ▼
Combined Verdict: DEEPFAKE (91% Combined Probability)
```
