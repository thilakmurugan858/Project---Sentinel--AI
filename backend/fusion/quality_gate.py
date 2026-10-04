"""
Sentinel AI - Data Quality Gate
Evaluates evidence levels for all three modalities (Satellite, Soil, Leaf).
Determines overall cycle evidence level and enforces failsafe refusal if insufficient.
Complies strictly with Master Build Spec Section 1C & Section 5.
"""

from typing import Dict, Any, Tuple, Optional

Optional_Dict = Optional[Dict[str, Any]]


def evaluate_modality_quality(
    satellite_result: Optional_Dict = None,
    soil_result: Optional_Dict = None,
    leaf_result: Optional_Dict = None
) -> Dict[str, Any]:
    """
    Evaluates data quality across the 3 independent modalities:
    
    1. Satellite:
       - Full: Cloud-free, pure pixel count >= 20.
       - Partial: Pure pixel count between 8 and 19.
       - Insufficient: Cloud cover > 20% on field, scene cloud > 30%, or pixels < 8.
       
    2. Soil:
       - Full: >= 5 parameters tested, test age <= 6 months.
       - Partial: 1 to 4 parameters tested, or test age 3-6 months.
       - Insufficient: Stale > 6 months, or no parameters provided.
       
    3. Leaf:
       - Full: Leaf image classified with model confidence >= 0.70.
       - Partial: Model confidence between 0.45 and 0.69.
       - Insufficient: Model confidence < 0.45 or no leaf photo provided.
    """
    # 1. Satellite quality
    sat_level = "Insufficient"
    sat_note = "No satellite acquisition available."
    if satellite_result:
        sat_level = satellite_result.get("evidence_level", "Insufficient")
        sat_note = satellite_result.get("evidence_note", "") or satellite_result.get("reason", "")

    # 2. Soil quality
    soil_level = "Insufficient"
    soil_note = "No soil laboratory data provided."
    if soil_result:
        soil_level = soil_result.get("evidence_level", "Insufficient")
        soil_note = soil_result.get("evidence_note", "")

    # 3. Leaf quality
    leaf_level = "Insufficient"
    leaf_note = "No leaf photo provided."
    if leaf_result and leaf_result.get("predicted_class"):
        conf = leaf_result.get("confidence", 0.0)
        if conf >= 0.70:
            leaf_level = "Full"
            leaf_note = f"High confidence leaf diagnosis ({conf*100:.1f}%)."
        elif conf >= 0.45:
            leaf_level = "Partial"
            leaf_note = f"Moderate confidence leaf diagnosis ({conf*100:.1f}%). Foliar symptoms subtle."
        else:
            leaf_level = "Insufficient"
            leaf_note = f"Low model confidence ({conf*100:.1f}% < 45%). Unreliable foliar evidence."

    # Overall cycle determination
    modalities = [sat_level, soil_level, leaf_level]
    full_count = modalities.count("Full")
    partial_count = modalities.count("Partial")
    insufficient_count = modalities.count("Insufficient")

    if full_count >= 2 or (full_count == 1 and partial_count >= 1):
        overall_level = "FULL"
    elif full_count == 1 or partial_count >= 1:
        overall_level = "PARTIAL"
    else:
        overall_level = "INSUFFICIENT"

    can_proceed_to_diagnosis = overall_level != "INSUFFICIENT"

    return {
        "overall_evidence_level": overall_level,
        "can_diagnose": can_proceed_to_diagnosis,
        "modalities": {
            "satellite": {
                "level": sat_level,
                "note": sat_note
            },
            "soil": {
                "level": soil_level,
                "note": soil_note
            },
            "leaf": {
                "level": leaf_level,
                "note": leaf_note
            }
        },
        "full_modalities_count": full_count,
        "partial_modalities_count": partial_count,
        "insufficient_modalities_count": insufficient_count,
        "refusal_reason": (
            "Cannot diagnose: insufficient evidence across all three modalities. "
            "Please provide a clear leaf photograph or an updated soil test."
            if not can_proceed_to_diagnosis else None
        )
    }

# Type alias helper
Optional_Dict = Any
