# DeepFakeShield — Training and Benchmark Pipelines

This directory contains deep learning training, evaluation, and benchmark pipelines for DeepFakeShield.

## Supported Benchmark Datasets

1. **FaceForensics++ (FF++)**:
   - `c23` (High quality / mild compression)
   - `c40` (Low quality / heavy compression)
   - Methods: Deepfakes, Face2Face, FaceSwap, NeuralTextures, FaceShifter

2. **Deepfake Detection Challenge (DFDC)**:
   - 128,000+ videos across 8 acquisition cameras
   - Evaluated under frame jitter, cropping, and audio-video lip mismatch

3. **ASVspoof 2021 (Logical Access)**:
   - Voice cloning & speech synthesis (Tacotron, FastSpeech, WaveGlow, HiFi-GAN)

4. **In-The-Wild Evaluation**:
   - Diffusion face swaps, Midjourney v6 portraits, Sora / Kling synthetic video clips

## Training Scripts
- `training/train_classifier.py`: Trains spatial anomaly detector with Focal Loss and AdamW.
- `evaluation/evaluate_metrics.py`: Computes genuine ROC-AUC, Precision, Recall, F1, and EER curves.
