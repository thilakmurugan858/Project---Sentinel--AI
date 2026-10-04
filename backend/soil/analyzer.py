"""
Sentinel AI - Soil Health Analyzer
Agronomic thresholds for Tamil Nadu paddy fields & staleness validation rules.
Complies strictly with Master Build Spec Section 6.
"""

from datetime import datetime, date
from typing import Dict, Any, Optional, List


# Standard agronomic thresholds for paddy cultivation (TNAU / ICAR recommendations)
SOIL_THRESHOLDS = {
    "ph": {
        "low_critical": 5.5,
        "optimal_min": 6.0,
        "optimal_max": 7.5,
        "high_critical": 8.5,
        "unit": "pH",
        "description": "Soil Reaction"
    },
    "nitrogen": {
        "low_critical": 140.0,   # Low / Deficient (kg/ha)
        "optimal_min": 140.0,
        "optimal_max": 280.0,   # Medium / Adequate
        "high_critical": 280.0,
        "unit": "kg/ha",
        "description": "Available Nitrogen (N)"
    },
    "phosphorus": {
        "low_critical": 11.0,    # Low < 11 kg/ha
        "optimal_min": 11.0,
        "optimal_max": 22.0,    # Medium
        "high_critical": 22.0,
        "unit": "kg/ha",
        "description": "Available Phosphorus (P2O5)"
    },
    "potassium": {
        "low_critical": 115.0,   # Low < 115 kg/ha
        "optimal_min": 115.0,
        "optimal_max": 280.0,   # Medium
        "high_critical": 280.0,
        "unit": "kg/ha",
        "description": "Available Potassium (K2O)"
    },
    "zinc": {
        "low_critical": 0.6,     # Low < 0.6 ppm / mg/kg (common in Cauvery delta)
        "optimal_min": 0.8,
        "optimal_max": 2.5,
        "high_critical": 5.0,
        "unit": "ppm",
        "description": "Available Zinc (Zn)"
    },
    "iron": {
        "low_critical": 4.5,     # Low < 4.5 ppm
        "optimal_min": 5.0,
        "optimal_max": 20.0,
        "high_critical": 50.0,
        "unit": "ppm",
        "description": "Available Iron (Fe)"
    }
}


def evaluate_soil_health(soil_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Evaluates soil parameters, checks staleness, and returns structured diagnosis.
    
    Expected keys in soil_data:
        - ph: Optional[float]
        - nitrogen: Optional[float]
        - phosphorus: Optional[float]
        - potassium: Optional[float]
        - zinc: Optional[float]
        - iron: Optional[float]
        - test_date: Optional[str] (YYYY-MM-DD)
    """
    test_date_str = soil_data.get("test_date")
    today = date.today()
    
    # Staleness evaluation
    days_old = None
    is_stale_entirely = False
    is_nitrogen_low_confidence = False
    staleness_warning = None
    
    if test_date_str:
        try:
            test_date = datetime.strptime(test_date_str, "%Y-%m-%d").date()
            days_old = (today - test_date).days
            
            if days_old > 180:  # > 6 months
                is_stale_entirely = True
                staleness_warning = (
                    f"Soil test is {days_old // 30} months old (>6 months). "
                    "Report is stale; re-testing recommended. Interpret with caution."
                )
            elif days_old > 90:  # > 3 months
                is_nitrogen_low_confidence = True
                staleness_warning = (
                    f"Soil test is {days_old // 30} months old (>3 months). "
                    "Nitrogen values may have depleted due to rapid leaching and volatilization."
                )
        except Exception:
            staleness_warning = "Invalid test date format. Assumed unverified age."

    # Assess parameter completeness
    tested_params = {}
    missing_params = []
    deficiencies = []
    toxicities = []
    normal_params = []

    for param, config in SOIL_THRESHOLDS.items():
        val = soil_data.get(param)
        if val is not None:
            try:
                f_val = float(val)
                tested_params[param] = f_val
                
                # Check status
                if f_val < config["low_critical"]:
                    severity = "severe" if f_val < (config["low_critical"] * 0.7) else "moderate"
                    note = f"{config['description']} deficient: {f_val} {config['unit']} (critical min: {config['low_critical']})"
                    if param == "nitrogen" and is_nitrogen_low_confidence:
                        note += " [Lower confidence due to test age >3 months]"
                    deficiencies.append({
                        "parameter": param,
                        "value": f_val,
                        "unit": config["unit"],
                        "severity": severity,
                        "status": "DEFICIENT",
                        "message": note
                    })
                elif f_val > config["high_critical"] and param in ["ph", "zinc", "iron"]:
                    toxicities.append({
                        "parameter": param,
                        "value": f_val,
                        "unit": config["unit"],
                        "status": "EXCESS",
                        "message": f"{config['description']} high/excess: {f_val} {config['unit']} (max recommended: {config['high_critical']})"
                    })
                else:
                    normal_params.append({
                        "parameter": param,
                        "value": f_val,
                        "unit": config["unit"],
                        "status": "OPTIMAL"
                    })
            except (ValueError, TypeError):
                missing_params.append(param)
        else:
            missing_params.append(param)

    # Determine Modality Evidence Level (Full / Partial / Insufficient)
    if is_stale_entirely:
        modality_level = "Insufficient"
        evidence_note = "Soil data rejected or marked insufficient due to staleness (>6 months old)."
    elif len(tested_params) >= 5:
        modality_level = "Full"
        evidence_note = f"Comprehensive soil test profile ({len(tested_params)} parameters tested)."
    elif len(tested_params) >= 2:
        modality_level = "Partial"
        evidence_note = f"Partial soil data provided ({len(tested_params)} parameters tested: {', '.join(tested_params.keys())})."
    elif len(tested_params) == 1:
        modality_level = "Partial"
        evidence_note = f"Single soil parameter tested ({list(tested_params.keys())[0]}). Minimal evidence."
    else:
        modality_level = "Insufficient"
        evidence_note = "No valid soil laboratory parameters supplied."

    has_abiotic_soil_stress = len(deficiencies) > 0 or len(toxicities) > 0

    return {
        "modality": "Soil",
        "evidence_level": modality_level,
        "evidence_note": evidence_note,
        "days_old": days_old,
        "is_stale_entirely": is_stale_entirely,
        "is_nitrogen_low_confidence": is_nitrogen_low_confidence,
        "staleness_warning": staleness_warning,
        "tested_parameters_count": len(tested_params),
        "missing_parameters": missing_params,
        "deficiencies": deficiencies,
        "toxicities": toxicities,
        "optimal_parameters": normal_params,
        "has_stress": has_abiotic_soil_stress,
        "summary": (
            f"Found {len(deficiencies)} deficiency(ies) and {len(toxicities)} excess(es)."
            if has_abiotic_soil_stress else "Soil parameters within recommended paddy agronomic ranges."
        )
    }
