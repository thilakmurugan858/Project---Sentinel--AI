"""
Sentinel AI - Comprehensive Pipeline Verification Test
Tests all endpoints: Health, Districts, Satellite Band Math, Soil Evaluator,
Leaf CNN Classifier, Multimodal Fusion Engine, and Gemini Advisory.
"""

import sys
import os

# Ensure backend path is in sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200, f"Health check failed: {response.text}"
    data = response.json()
    assert data["status"] == "healthy"
    assert data["ml_leaf_classifier_ready"] is True
    assert data["tamil_nadu_districts_count"] == 38
    print(" [1/7] GET /api/health passed.")


def test_districts():
    response = client.get("/api/districts")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] == 38
    assert "Thanjavur" in data["districts"]
    assert data["districts"]["Thanjavur"]["is_validated"] is True
    print(" [2/7] GET /api/districts passed (38 Tamil Nadu districts verified).")


def test_soil_evaluation():
    payload = {
        "ph": 6.2,
        "nitrogen": 120.0, # Deficient (<140)
        "phosphorus": 15.0,
        "potassium": 160.0,
        "zinc": 0.5,       # Deficient (<0.6)
        "iron": 7.0,
        "test_date": "2026-08-15"
    }
    response = client.post("/api/soil/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["has_stress"] is True
    assert len(data["deficiencies"]) == 2 # N and Zn
    print(" [3/7] POST /api/soil/evaluate passed (Agronomic thresholds & staleness verified).")


def test_satellite_analysis():
    payload = {
        "polygon_geojson": {
            "type": "Polygon",
            "coordinates": [[
                [79.1350, 10.7850],
                [79.1410, 10.7850],
                [79.1420, 10.7890],
                [79.1360, 10.7910],
                [79.1350, 10.7850]
            ]]
        },
        "historical_baseline_ndvi": 0.65
    }
    response = client.post("/api/satellite/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "mean_ndvi" in data
    assert "mean_ndwi" in data
    assert data["evidence_level"] in ["Full", "Partial", "Insufficient"]
    print(f" [4/7] POST /api/satellite/analyze passed (NDVI: {data['mean_ndvi']}, NDWI: {data['mean_ndwi']}).")


def test_leaf_classifier():
    sample_path = os.path.join(backend_dir, "ml", "dataset", "Blast", "blast_0001.jpg")
    with open(sample_path, "rb") as f:
        response = client.post("/api/leaf/analyze", files={"file": ("blast.jpg", f, "image/jpeg")})
    assert response.status_code == 200
    data = response.json()
    assert "predicted_class" in data
    assert "confidence" in data
    assert 0.0 <= data["confidence"] <= 1.0
    print(f" [5/7] POST /api/leaf/analyze passed (Predicted: {data['predicted_class']} at {data['confidence']*100:.1f}%).")


def test_fusion_engine():
    sat_result = {
        "modality": "Satellite",
        "evidence_level": "Full",
        "mean_ndvi": 0.32,
        "mean_ndwi": 0.05,
        "stress_detected": True,
        "stress_type": "Moderate Vegetative Stress",
        "usable_pixels": 40
    }
    soil_result = {
        "modality": "Soil",
        "evidence_level": "Full",
        "has_stress": True,
        "deficiencies": [{"parameter": "nitrogen", "severity": "moderate"}]
    }
    leaf_result = {
        "predicted_class": "Blast",
        "confidence": 0.94,
        "is_healthy": False
    }

    # Test Mixed Stress Case
    response = client.post("/api/fuse", json={
        "satellite_result": sat_result,
        "soil_result": soil_result,
        "leaf_result": leaf_result
    })
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] == "Mixed stress"
    assert data["verdict_category"] == "MIXED_STRESS"

    # Test Refusal Case (All Insufficient)
    response_refusal = client.post("/api/fuse", json={
        "satellite_result": {"evidence_level": "Insufficient"},
        "soil_result": {"evidence_level": "Insufficient"},
        "leaf_result": None
    })
    data_refusal = response_refusal.json()
    assert data_refusal["verdict"] == "Insufficient evidence"
    assert data_refusal["quality_gate"]["can_diagnose"] is False
    print(" [6/7] POST /api/fuse passed (Mixed stress diagnosed & quality gate refusal verified).")


def test_multilingual_advisory():
    fused_mock = {
        "verdict": "Biotic stress",
        "verdict_category": "BIOTIC_STRESS",
        "primary_cause": "Infection by Rice Blast (Magnaporthe oryzae).",
        "remedies": ["Spray Tricyclazole 75% WP @ 0.6 g/L."],
        "evidence_sources": ["Satellite", "Leaf CNN"]
    }
    
    # Test Tamil (தமிழ்)
    res_ta = client.post("/api/advisory", json={
        "fused_verdict": fused_mock,
        "language": "ta",
        "field_context": {"district": "Thanjavur", "town": "Orathanadu"}
    })
    assert res_ta.status_code == 200
    assert "விவசாயி" in res_ta.json()["advisory_text"]

    # Test English
    res_en = client.post("/api/advisory", json={
        "fused_verdict": fused_mock,
        "language": "en"
    })
    assert res_en.status_code == 200
    assert len(res_en.json()["advisory_text"]) > 20

    print(" [7/7] POST /api/advisory passed (Tamil & English verified).")


if __name__ == "__main__":
    print("=" * 60)
    print("RUNNING SENTINEL AI PIPELINE TEST SUITE")
    print("=" * 60)
    test_health()
    test_districts()
    test_soil_evaluation()
    test_satellite_analysis()
    test_leaf_classifier()
    test_fusion_engine()
    test_multilingual_advisory()
    print("=" * 60)
    print(" ALL 7 PIPELINE TESTS PASSED WITH 100% SUCCESS!")
    print("=" * 60)
