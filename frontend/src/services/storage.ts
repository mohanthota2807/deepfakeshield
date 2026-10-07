import { ForensicAnalysisResult } from '../types';
import { sampleDemonstrations } from './forensicEngine';

const STORAGE_KEY = 'deepfakeshield_analysis_history';

export const getStoredHistory = (): ForensicAnalysisResult[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse history from localStorage', e);
  }

  // Initial seed history matching professional digital forensic cases
  const initialHistory: ForensicAnalysisResult[] = [
    {
      id: 'dfs-rec-9821a',
      filename: 'evidence_portrait_speech.mp4',
      media_type: 'video',
      verdict: 'DEEPFAKE',
      probability: 91.7,
      confidence: 89.4,
      model_name: 'RetinaFace + SpatialViT + TemporalTransformer-v3',
      model_version: '3.1.0',
      processing_time_ms: 1840.0,
      is_demo: true,
      created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      disclaimer: 'AI-generated media detection is probabilistic. Results should be interpreted as forensic indicators rather than definitive proof.',
      suspicious_timeline: sampleDemonstrations.video_deepfake.suspicious_timeline,
      frame_samples: sampleDemonstrations.video_deepfake.frame_samples,
      pipeline_stages: sampleDemonstrations.video_deepfake.pipeline_stages
    },
    {
      id: 'dfs-rec-8843b',
      filename: 'press_briefing_audio.wav',
      media_type: 'audio',
      verdict: 'AI-GENERATED',
      probability: 88.4,
      confidence: 91.2,
      model_name: 'AASIST-SpectroGraph-v2 + RawNet2',
      model_version: '2.2.0',
      processing_time_ms: 780.0,
      is_demo: true,
      created_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
      disclaimer: 'AI-generated media detection is probabilistic. Results should be interpreted as forensic indicators rather than definitive proof.',
      suspicious_segments: sampleDemonstrations.audio_cloned.suspicious_segments,
      acoustic_features: sampleDemonstrations.audio_cloned.acoustic_features
    },
    {
      id: 'dfs-rec-7712c',
      filename: 'executive_id_photo.jpg',
      media_type: 'image',
      verdict: 'AUTHENTIC',
      probability: 4.2,
      confidence: 96.1,
      model_name: 'EfficientNet-B4 + ForensicViT-v2',
      model_version: '2.4.1',
      processing_time_ms: 388.0,
      is_demo: true,
      created_at: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
      disclaimer: 'AI-generated media detection is probabilistic. Results should be interpreted as forensic indicators rather than definitive proof.',
      anomalies: sampleDemonstrations.image_authentic.anomalies
    },
    {
      id: 'dfs-rec-6590d',
      filename: 'wire_transfer_verification.mp3',
      media_type: 'audio',
      verdict: 'UNCERTAIN',
      probability: 51.2,
      confidence: 54.0,
      model_name: 'AASIST-SpectroGraph-v2 + RawNet2',
      model_version: '2.2.0',
      processing_time_ms: 620.0,
      is_demo: true,
      created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      disclaimer: 'AI-generated media detection is probabilistic. Results should be interpreted as forensic indicators rather than definitive proof.',
      acoustic_features: sampleDemonstrations.audio_cloned.acoustic_features
    }
  ];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialHistory));
  } catch (e) {}

  return initialHistory;
};

export const saveHistoryRecord = (record: ForensicAnalysisResult): ForensicAnalysisResult[] => {
  const current = getStoredHistory();
  const filtered = current.filter(item => item.id !== record.id);
  const updated = [record, ...filtered];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save history to localStorage', e);
  }
  return updated;
};

export const deleteStoredHistoryRecord = (id: string): ForensicAnalysisResult[] => {
  const current = getStoredHistory();
  const updated = current.filter(item => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete history record', e);
  }
  return updated;
};

export const clearAllStoredHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
};
