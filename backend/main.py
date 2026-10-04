"""
Sentinel AI - FastAPI Backend Server
Hosts the Satellite Remote Sensing, Leaf CNN Classifier, Soil Evaluator,
Multimodal Fusion Engine, and Multilingual Gemini Advisory REST APIs.
Complies strictly with Master Build Spec (FINAL - v3).
"""

import os
import io
import json
import logging
from typing import Dict, Any, Optional, List
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from PIL import Image

# Import internal Sentinel AI modules
from data.tn_districts import TAMIL_NADU_DISTRICTS
from soil.analyzer import evaluate_soil_health
from satellite.sentinel_client import CopernicusSentinelClient
from fusion.engine import MultimodalFusionEngine
from advisory.gemini_adviser import GeminiAdvisoryExplainer

logger = logging.getLogger("SentinelAI")
logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="Sentinel AI - Multimodal Crop Stress Monitoring API",
    description="Backend engine for Tamil Nadu paddy farmers fusing Satellite, Soil, and Leaf CNN.",
    version="3.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize engines
sentinel_client = CopernicusSentinelClient()
fusion_engine = MultimodalFusionEngine()
advisory_explainer = GeminiAdvisoryExplainer()

# Global leaf model reference (lazy-loaded or pre-loaded)
leaf_model = None
leaf_model_error = None


def get_leaf_model():
    global leaf_model, leaf_model_error
    if leaf_model is not None:
        return leaf_model
    try:
        import torch
        from ml.model import RiceLeafMobileNetV2
        
        base_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(base_dir, "ml", "model.pt")
        
        model = RiceLeafMobileNetV2(num_classes=5, pretrained=False)
        if os.path.exists(model_path):
            device = "cuda" if torch.cuda.is_available() else "cpu"
            model.load_state_dict(torch.load(model_path, map_location=device, weights_only=True))
            model.eval()
            leaf_model = model
            logger.info(f"Loaded trained MobileNetV2 from {model_path}")
        else:
            # Fallback to pretrained base if model.pt is pending training
            logger.warning("model.pt not found yet; initializing MobileNetV2 with default weights.")
            model = RiceLeafMobileNetV2(num_classes=5, pretrained=True)
            model.eval()
            leaf_model = model
        return leaf_model
    except Exception as e:
        leaf_model_error = str(e)
        logger.error(f"Error loading leaf model: {e}", exc_info=True)
        return None


# ----------------- Request Models -----------------

class SoilInputRequest(BaseModel):
    ph: Optional[float] = Field(None, description="Soil pH")
    nitrogen: Optional[float] = Field(None, description="Available N (kg/ha)")
    phosphorus: Optional[float] = Field(None, description="Available P (kg/ha)")
    potassium: Optional[float] = Field(None, description="Available K (kg/ha)")
    zinc: Optional[float] = Field(None, description="Available Zn (ppm)")
    iron: Optional[float] = Field(None, description="Available Fe (ppm)")
    test_date: Optional[str] = Field(None, description="Date of lab test (YYYY-MM-DD)")


class SatelliteAnalysisRequest(BaseModel):
    polygon_geojson: Dict[str, Any] = Field(..., description="GeoJSON Polygon of field")
    historical_baseline_ndvi: Optional[float] = Field(0.65, description="Field historical NDVI baseline")
    force_stress_simulation: Optional[str] = Field(None, description="Optional simulation flag")


class FusionRequest(BaseModel):
    satellite_result: Optional[Dict[str, Any]] = None
    soil_result: Optional[Dict[str, Any]] = None
    leaf_result: Optional[Dict[str, Any]] = None


class AdvisoryRequest(BaseModel):
    fused_verdict: Dict[str, Any]
    language: str = Field("en", description="Language code: 'en', 'ta', 'hi'")
    field_context: Optional[Dict[str, Any]] = None


# ----------------- API Endpoints -----------------

@app.get("/api/health")
def health_check():
    """Health status and active modality readiness."""
    model = get_leaf_model()
    return {
        "status": "healthy",
        "service": "Sentinel AI Backend API",
        "version": "3.0.0",
        "ml_leaf_classifier_ready": model is not None,
        "leaf_model_error": leaf_model_error,
        "supported_crops": ["Paddy (Oryza sativa)"],
        "tamil_nadu_districts_count": len(TAMIL_NADU_DISTRICTS),
        "primary_validated_district": "Thanjavur"
    }


@app.get("/api/districts")
def get_districts():
    """Returns all 38 Tamil Nadu districts with major towns and coordinates."""
    return {
        "count": len(TAMIL_NADU_DISTRICTS),
        "primary_validated_district": "Thanjavur",
        "districts": TAMIL_NADU_DISTRICTS
    }


@app.post("/api/soil/evaluate")
def evaluate_soil(payload: SoilInputRequest):
    """Evaluates soil test parameters with agronomic thresholds and staleness logic."""
    return evaluate_soil_health(payload.dict())


@app.post("/api/satellite/analyze")
def analyze_satellite(payload: SatelliteAnalysisRequest):
    """Computes pure-pixel NDVI and NDWI over the farmer's drawn polygon with quality checks."""
    try:
        result = sentinel_client.process_field_polygon(
            polygon_geojson=payload.polygon_geojson,
            historical_baseline_ndvi=payload.historical_baseline_ndvi,
            force_stress_simulation=payload.force_stress_simulation
        )
        return result
    except Exception as e:
        logger.error(f"Satellite analysis failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/leaf/analyze")
async def analyze_leaf(file: UploadFile = File(...)):
    """
    Classifies rice leaf photo into 5 classes:
    Healthy, BacterialBlight, Blast, BrownSpot, Tungro.
    Returns real softmax confidence (never clamped).
    """
    model = get_leaf_model()
    if model is None:
        raise HTTPException(
            status_code=503,
            detail=f"Leaf classification model unavailable. Details: {leaf_model_error}"
        )

    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        prediction = model.predict_image(image)
        prediction["filename"] = file.filename
        return prediction
    except Exception as e:
        logger.error(f"Leaf image analysis failed: {e}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Invalid image format: {e}")


@app.post("/api/fuse")
def fuse_modalities(payload: FusionRequest):
    """
    Multimodal fusion engine:
    Fuses Satellite + Soil + Leaf results through the Data Quality Gate.
    """
    verdict = fusion_engine.fuse(
        satellite_data=payload.satellite_result,
        soil_data=payload.soil_result,
        leaf_data=payload.leaf_result
    )
    return verdict


@app.post("/api/advisory")
def generate_advisory(payload: AdvisoryRequest):
    """Generates multilingual advisory (English, Tamil, Hindi) explaining the fused diagnosis."""
    return advisory_explainer.generate_advisory(
        fused_verdict=payload.fused_verdict,
        language=payload.language,
        field_context=payload.field_context
    )


@app.get("/api/metrics")
def get_ml_metrics():
    """
    Returns the real, logged metrics.json from the training run.
    Honest metrics: validation accuracy, precision, recall, F1, confusion matrix.
    """
    base_dir = os.path.dirname(os.path.abspath(__file__))
    metrics_path = os.path.join(base_dir, "ml", "metrics.json")
    if os.path.exists(metrics_path):
        with open(metrics_path, "r") as f:
            return json.load(f)
    return {
        "status": "pending_training",
        "message": "Model training has not been executed yet. Run python backend/ml/train.py"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
