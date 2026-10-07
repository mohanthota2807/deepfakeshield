export type MediaType = 'image' | 'video' | 'audio' | 'multimodal';

export type ForensicVerdict = 'AUTHENTIC' | 'DEEPFAKE' | 'AI-GENERATED' | 'UNCERTAIN';

export interface ForensicAnomaly {
  id: string;
  name: string;
  detected: boolean;
  severity: 'High' | 'Moderate' | 'Low';
  score: number;
  description: string;
}

export interface SuspiciousRegion {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  intensity: number;
}

export interface VideoTimelineSegment {
  start_time: number;
  end_time: number;
  start_str: string;
  end_str: string;
  peak_probability: number;
  primary_anomaly: string;
  severity: 'Critical' | 'High' | 'Moderate';
}

export interface FrameSample {
  frame_index: number;
  timestamp: string;
  time_sec: number;
  fake_probability: number;
  confidence: number;
  verdict: 'AUTHENTIC' | 'DEEPFAKE' | 'UNCERTAIN';
  anomaly_detected: boolean;
  notes: string;
}

export interface PipelineStage {
  stage: string;
  status: string;
  details: string;
}

export interface AudioSegment {
  start_time: number;
  end_time: number;
  start_str: string;
  end_str: string;
  probability: number;
  anomaly: string;
  frequency_band: string;
}

export interface AcousticFeature {
  metric: string;
  value: string;
  benchmark: string;
  status: string;
  description: string;
}

export interface MultimodalFactor {
  factor: string;
  contribution: string;
  weight: string;
  status: string;
  observation: string;
}

export interface ForensicAnalysisResult {
  id: string;
  filename: string;
  media_type: MediaType;
  file_size_bytes?: number;
  verdict: ForensicVerdict;
  probability: number;
  confidence: number;
  model_name: string;
  model_version: string;
  processing_time_ms: number;
  is_demo: boolean;
  created_at: string;
  disclaimer: string;
  
  // Specific modality data
  metadata?: Record<string, any>;
  anomalies?: ForensicAnomaly[];
  suspicious_regions?: SuspiciousRegion[];
  suspicious_timeline?: VideoTimelineSegment[];
  frame_samples?: FrameSample[];
  pipeline_stages?: PipelineStage[];
  suspicious_segments?: AudioSegment[];
  acoustic_features?: AcousticFeature[];
  visual_probability?: number;
  audio_probability?: number;
  visual_confidence?: number;
  audio_confidence?: number;
  fusion_factors?: MultimodalFactor[];
  explanation?: string;
  preview_url?: string;
}

export interface ModelCard {
  id: string;
  name: string;
  media_type: string;
  architecture: string;
  version: string;
  training_dataset: string;
  status: string;
  input_resolution: string;
  metrics_available: boolean;
  metrics?: {
    precision: string;
    recall: string;
    f1_score: string;
    roc_auc: string;
    evaluation_protocol: string;
  } | null;
  evaluation_notice?: string;
  explainability_methods: string[];
}
