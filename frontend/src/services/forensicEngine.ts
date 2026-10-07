import { ForensicAnalysisResult, MediaType } from '../types';

export const sampleDemonstrations = {
  image_deepfake: {
    id: 'demo-img-01',
    filename: 'synthetic_gan_celebrity_portrait.jpg',
    media_type: 'image' as MediaType,
    file_size_bytes: 2840000,
    verdict: 'DEEPFAKE' as const,
    probability: 96.4,
    confidence: 94.8,
    model_name: 'EfficientNet-B4 + ForensicViT-v2',
    model_version: '2.4.1',
    processing_time_ms: 412.5,
    is_demo: true,
    created_at: new Date().toISOString(),
    disclaimer: 'AI-generated media detection is probabilistic. Results should be interpreted as forensic indicators rather than definitive proof.',
    metadata: {
      width: 1024,
      height: 1024,
      format: 'JPEG',
      megapixels: 1.05,
      aspect_ratio: '1:1',
      exif_stripped: true
    },
    anomalies: [
      {
        id: 'facial_boundary',
        name: 'Facial Boundary Inconsistencies',
        detected: true,
        severity: 'High',
        score: 94.2,
        description: 'Spatial blending gradients detected along perimeter of facial landmarks, indicating potential Poisson blending or GAN border artifact.'
      },
      {
        id: 'texture_anomalies',
        name: 'Texture Anomalies & Smoothing',
        detected: true,
        severity: 'High',
        score: 91.5,
        description: 'High-frequency texture loss in skin pores and unnatural smooth gradients consistent with neural generator upsampling.'
      },
      {
        id: 'lighting_inconsistencies',
        name: 'Lighting & Specular Inconsistencies',
        detected: true,
        severity: 'Moderate',
        score: 78.4,
        description: 'Global illumination vectors on nose and forehead diverge from background ambient light direction.'
      },
      {
        id: 'skin_artifacts',
        name: 'Skin Artifact Patterns',
        detected: true,
        severity: 'Moderate',
        score: 82.1,
        description: 'Sub-surface scattering irregularities and checkerboard deconvolution artifacts spotted under 2D FFT analysis.'
      },
      {
        id: 'eye_reflections',
        name: 'Corneal Reflection Inconsistencies',
        detected: true,
        severity: 'High',
        score: 88.9,
        description: 'Corneal specular highlight mismatch between left and right iris structures.'
      },
      {
        id: 'compression_anomalies',
        name: 'Compression & Quantization Residuals',
        detected: true,
        severity: 'Moderate',
        score: 73.0,
        description: 'Discrete Cosine Transform (DCT) coefficient distribution indicates secondary recompression pass around face bounding box.'
      }
    ],
    suspicious_regions: [
      { x: 0.30, y: 0.26, w: 0.40, h: 0.48, label: 'Synthetic Face Boundary', intensity: 0.96 },
      { x: 0.36, y: 0.32, w: 0.28, h: 0.15, label: 'Corneal Highlight Asymmetry', intensity: 0.88 },
      { x: 0.40, y: 0.52, w: 0.24, h: 0.18, label: 'Perioral Blending Seam', intensity: 0.82 }
    ]
  },

  image_authentic: {
    id: 'demo-img-02',
    filename: 'uncompressed_camera_capture.png',
    media_type: 'image' as MediaType,
    file_size_bytes: 5410000,
    verdict: 'AUTHENTIC' as const,
    probability: 4.2,
    confidence: 96.1,
    model_name: 'EfficientNet-B4 + ForensicViT-v2',
    model_version: '2.4.1',
    processing_time_ms: 388.0,
    is_demo: true,
    created_at: new Date().toISOString(),
    disclaimer: 'AI-generated media detection is probabilistic. Results should be interpreted as forensic indicators rather than definitive proof.',
    metadata: {
      width: 1920,
      height: 1080,
      format: 'PNG',
      megapixels: 2.07,
      aspect_ratio: '1.78:1',
      camera_model: 'Sony Alpha ILCE-7M4'
    },
    anomalies: [
      {
        id: 'facial_boundary',
        name: 'Facial Boundary Inconsistencies',
        detected: false,
        severity: 'Low',
        score: 8.4,
        description: 'Natural optical transition between subject and background.'
      },
      {
        id: 'texture_anomalies',
        name: 'Texture Anomalies & Smoothing',
        detected: false,
        severity: 'Low',
        score: 6.2,
        description: 'Natural high-frequency Bayer sensor pattern and skin micro-texture intact.'
      },
      {
        id: 'lighting_inconsistencies',
        name: 'Lighting & Specular Inconsistencies',
        detected: false,
        severity: 'Low',
        score: 9.1,
        description: 'Consistent key and rim lighting reflections across cornea and skin.'
      },
      {
        id: 'skin_artifacts',
        name: 'Skin Artifact Patterns',
        detected: false,
        severity: 'Low',
        score: 5.8,
        description: 'Zero checkerboard or generative upsampling artifacts detected.'
      },
      {
        id: 'eye_reflections',
        name: 'Corneal Reflection Inconsistencies',
        detected: false,
        severity: 'Low',
        score: 7.2,
        description: 'Symmetric reflection geometries conform to environmental light sources.'
      },
      {
        id: 'compression_anomalies',
        name: 'Compression & Quantization Residuals',
        detected: false,
        severity: 'Low',
        score: 11.0,
        description: 'Continuous lossless frequency distribution.'
      }
    ],
    suspicious_regions: []
  },

  video_deepfake: {
    id: 'demo-vid-01',
    filename: 'manipulated_testimony_stream.mp4',
    media_type: 'video' as MediaType,
    file_size_bytes: 38400000,
    verdict: 'DEEPFAKE' as const,
    probability: 91.7,
    confidence: 89.4,
    model_name: 'RetinaFace + SpatialViT + TemporalTransformer-v3',
    model_version: '3.1.0',
    processing_time_ms: 1840.0,
    is_demo: true,
    created_at: new Date().toISOString(),
    disclaimer: 'AI-generated media detection is probabilistic. Results should be interpreted as forensic indicators rather than definitive proof.',
    metadata: {
      duration_sec: 42.0,
      fps: 30.0,
      resolution: '1920x1080 (FHD)',
      total_frames: 1260,
      codec: 'H.264 / AVC'
    },
    suspicious_timeline: [
      {
        start_time: 13.0,
        end_time: 17.5,
        start_str: '00:13',
        end_str: '00:17',
        peak_probability: 96.2,
        primary_anomaly: 'Severe facial jitter & boundary desynchronization',
        severity: 'Critical'
      },
      {
        start_time: 24.2,
        end_time: 28.0,
        start_str: '00:24',
        end_str: '00:28',
        peak_probability: 88.5,
        primary_anomaly: 'Unnatural blink frequency & eyelid landmark distortion',
        severity: 'High'
      }
    ],
    frame_samples: [
      {
        frame_index: 120,
        timestamp: '00:04.0',
        time_sec: 4.0,
        fake_probability: 14.2,
        confidence: 93.1,
        verdict: 'AUTHENTIC',
        anomaly_detected: false,
        notes: 'Natural skin pores, consistent specular reflection.'
      },
      {
        frame_index: 396,
        timestamp: '00:13.2',
        time_sec: 13.2,
        fake_probability: 92.0,
        confidence: 94.5,
        verdict: 'DEEPFAKE',
        anomaly_detected: true,
        notes: 'Facial warping at jawline; boundary blur.'
      },
      {
        frame_index: 444,
        timestamp: '00:14.8',
        time_sec: 14.8,
        fake_probability: 96.0,
        confidence: 96.2,
        verdict: 'DEEPFAKE',
        anomaly_detected: true,
        notes: 'Severe identity swap artifact; pupil misalignment.'
      },
      {
        frame_index: 483,
        timestamp: '00:16.1',
        time_sec: 16.1,
        fake_probability: 89.0,
        confidence: 91.8,
        verdict: 'DEEPFAKE',
        anomaly_detected: true,
        notes: 'Temporal flicker between frame transitions.'
      },
      {
        frame_index: 630,
        timestamp: '00:21.0',
        time_sec: 21.0,
        fake_probability: 28.4,
        confidence: 88.0,
        verdict: 'AUTHENTIC',
        anomaly_detected: false,
        notes: 'Coherent head pose and natural shadow alignment.'
      },
      {
        frame_index: 765,
        timestamp: '00:25.5',
        time_sec: 25.5,
        fake_probability: 88.5,
        confidence: 92.4,
        verdict: 'DEEPFAKE',
        anomaly_detected: true,
        notes: 'Synthetically smoothed eyelid texture.'
      }
    ],
    pipeline_stages: [
      { stage: 'Frame Extraction', status: 'Completed', details: 'Extracted 30 FPS stream (1,260 total frames)' },
      { stage: 'Face Detection', status: 'Completed', details: 'RetinaFace detected 1 primary face track with 99.4% confidence' },
      { stage: 'Face Alignment & Cropping', status: 'Completed', details: 'Normalized 256x256 facial crops aligned by 5 landmark vectors' },
      { stage: 'Spatial Deepfake Model', status: 'Completed', details: 'EfficientNet-B4 spatial anomaly pass completed' },
      { stage: 'Temporal Analysis', status: 'Completed', details: 'Bi-LSTM temporal inconsistency score evaluated (0.84 residual)' },
      { stage: 'Frame Aggregation & Fusion', status: 'Completed', details: 'Bayesian temporal window aggregation applied' }
    ]
  },

  audio_cloned: {
    id: 'demo-aud-01',
    filename: 'synthesized_voice_cloning.wav',
    media_type: 'audio' as MediaType,
    file_size_bytes: 4200000,
    verdict: 'AI-GENERATED' as const,
    probability: 88.4,
    confidence: 91.2,
    model_name: 'AASIST-SpectroGraph-v2 + RawNet2',
    model_version: '2.2.0',
    processing_time_ms: 780.0,
    is_demo: true,
    created_at: new Date().toISOString(),
    disclaimer: 'AI-generated media detection is probabilistic. Results should be interpreted as forensic indicators rather than definitive proof.',
    metadata: {
      duration_sec: 18.5,
      sample_rate_hz: 44100,
      channels: 2,
      bit_depth: '16-bit PCM',
      codec: 'WAV'
    },
    suspicious_segments: [
      {
        start_time: 4.2,
        end_time: 7.8,
        start_str: '00:04.2',
        end_str: '00:07.8',
        probability: 94.6,
        anomaly: 'Neural vocoder phase cancellation & unnatural formant stability',
        frequency_band: '2.4 kHz - 4.8 kHz'
      },
      {
        start_time: 11.5,
        end_time: 14.1,
        start_str: '00:11.5',
        end_str: '00:14.1',
        probability: 89.1,
        anomaly: 'Synthetic silence floor (absence of micro-breath acoustic entropy)',
        frequency_band: '0 Hz - 8 kHz'
      }
    ],
    acoustic_features: [
      {
        metric: 'Phase Continuity Residual',
        value: '0.82 (High Anomaly)',
        benchmark: '< 0.25 (Natural Speech)',
        status: 'Flagged',
        description: 'High instantaneous phase variance typical of Griffin-Lim or HiFi-GAN synthesis.'
      },
      {
        metric: 'High-Frequency Harmonic Decay',
        value: '-42 dB / octave',
        benchmark: '-18 dB / octave',
        status: 'Flagged',
        description: 'Steep artificial cutoff above 7.2 kHz, indicating bandwidth truncation in training corpus.'
      },
      {
        metric: 'Formant Jitter & Shimmer',
        value: '0.18% (Unnaturally Flat)',
        benchmark: '0.8% - 2.4% (Biological)',
        status: 'Flagged',
        description: 'Vocal tract perturbation falls outside natural human physiological limits.'
      },
      {
        metric: 'Background Noise Entropy',
        value: 'Zero Ambient Noise Floor',
        benchmark: 'Stochastic Gaussian Profile',
        status: 'Flagged',
        description: 'Mathematical absolute zeroes detected between phoneme transitions.'
      }
    ]
  },

  multimodal_sample: {
    id: 'demo-multi-01',
    filename: 'press_statement_sync.mp4',
    media_type: 'multimodal' as MediaType,
    file_size_bytes: 28900000,
    verdict: 'DEEPFAKE' as const,
    probability: 91.0,
    confidence: 91.5,
    visual_probability: 87.0,
    audio_probability: 72.0,
    visual_confidence: 93.0,
    audio_confidence: 89.0,
    model_name: 'CrossModal-Attention-FusionNet-v2',
    model_version: '1.8.0',
    processing_time_ms: 1950.0,
    is_demo: true,
    created_at: new Date().toISOString(),
    disclaimer: 'AI-generated media detection is probabilistic. Results should be interpreted as forensic indicators rather than definitive proof.',
    explanation: 'The combined assessment is produced by the backend cross-modal attention fusion model, evaluating synchronized audio-visual embeddings rather than simple numerical averaging.',
    fusion_factors: [
      {
        factor: 'Visual Facial Anomaly Vector',
        contribution: '87.0%',
        weight: '51.1%',
        status: 'High Anomaly',
        observation: 'GAN artifact signatures localized around oral cavity and eye orbits.'
      },
      {
        factor: 'Acoustic Spectrogram Synthesis Vector',
        contribution: '72.0%',
        weight: '48.9%',
        status: 'Elevated Anomaly',
        observation: 'Vocoder spectral truncation and absence of physiological micro-tremors.'
      },
      {
        factor: 'Audio-Visual Lip-Sync Temporal Dissonance',
        contribution: '84.2%',
        weight: 'Cross-Modal Matrix',
        status: 'Desynchronized',
        observation: 'Phoneme-to-viseme timing divergence exceeds 140ms acoustic buffer threshold.'
      }
    ]
  }
};
