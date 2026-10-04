export interface DistrictInfo {
  lat: number;
  lon: number;
  is_validated: boolean;
  validation_note?: string;
  towns: string[];
}

export interface SoilData {
  ph?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  zinc?: number;
  iron?: number;
  test_date?: string;
}

export interface SatelliteAnalysisResult {
  modality: string;
  evidence_level: "Full" | "Partial" | "Insufficient";
  evidence_note?: string;
  reason?: string;
  cloud_coverage_pct: number;
  usable_pixels: number;
  total_field_pixels: number;
  mean_ndvi: number | null;
  mean_ndwi: number | null;
  stress_detected: boolean | null;
  stress_type: string | null;
  anomaly_detected: boolean;
  trigger_leaf_reason: string | null;
  acquisition_date?: string;
  satellite_source?: string;
  sar_rvi?: number | null;
  sar_cross_ratio?: number | null;
  sar_fallback_active?: boolean;
  cloud_penetrated?: boolean;
  sar_status_note?: string | null;
  multi_constellation_hls?: {
    enabled: boolean;
    cadence_days: number;
    standard_cadence_days: number;
    cadence_reduction_pct: number;
    next_overpass: string;
    active_constellations: Array<{
      name: string;
      type: string;
      agency: string;
      revisit_status: string;
      status_badge: string;
    }>;
  };
  sar_radar_system?: {
    satellite: string;
    frequency_ghz: number;
    polarization: string;
    cloud_penetration_capability: string;
    vegetation_metric: string;
    cross_polarization_ratio_formula: string;
    active_now: boolean;
  };
}

export interface LeafClassificationResult {
  filename?: string;
  predicted_class: "Healthy" | "BacterialBlight" | "Blast" | "BrownSpot" | "Tungro";
  confidence: number;
  class_probabilities: Record<string, number>;
  is_healthy: boolean;
}

export interface ModalityQuality {
  level: "Full" | "Partial" | "Insufficient";
  note: string;
}

export interface QualityGateResult {
  overall_evidence_level: "FULL" | "PARTIAL" | "INSUFFICIENT";
  can_diagnose: boolean;
  modalities: {
    satellite: ModalityQuality;
    soil: ModalityQuality;
    leaf: ModalityQuality;
  };
  full_modalities_count: number;
  partial_modalities_count: number;
  insufficient_modalities_count: number;
  refusal_reason?: string | null;
}

export interface FusedVerdictResult {
  verdict: "Abiotic stress" | "Biotic stress" | "Mixed stress" | "Insufficient evidence" | "Healthy";
  verdict_category: "ABIOTIC_STRESS" | "BIOTIC_STRESS" | "MIXED_STRESS" | "INSUFFICIENT_EVIDENCE" | "HEALTHY";
  confidence_score: number;
  primary_cause: string;
  evidence_sources: string[];
  quality_gate: QualityGateResult;
  remedies: string[];
  soil_deficiencies_detected?: string[];
  leaf_disease_detected?: string | null;
  satellite_ndvi?: number | null;
  satellite_ndwi?: number | null;
}

export interface AdvisoryResult {
  source: string;
  language: string;
  advisory_text: string;
  status: string;
}

export interface MLMetricsResult {
  architecture: string;
  classes: string[];
  validation_samples: number;
  validation_accuracy: number;
  per_class_metrics: Record<string, {
    precision: number;
    recall: number;
    f1_score: number;
    validation_support: number;
  }>;
  confusion_matrix: number[][];
  evaluation_mode?: string;
}
