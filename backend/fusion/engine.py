"""
Sentinel AI - Multimodal Fusion Engine
Cross-modal reasoning across Satellite, Soil, and Leaf evidence.
Complies strictly with Master Build Spec Section 1C & Section 5.
"""

from typing import Dict, Any, List, Optional
from .quality_gate import evaluate_modality_quality


class MultimodalFusionEngine:
    """
    Fuses remote sensing, soil chemistry, and leaf CNN classification
    into one of five mutually exclusive, honest verdict categories:
    - Abiotic stress
    - Biotic stress
    - Mixed stress
    - Insufficient evidence
    - Healthy
    """

    def fuse(
        self,
        satellite_data: Optional[Dict[str, Any]] = None,
        soil_data: Optional[Dict[str, Any]] = None,
        leaf_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        # 1. Run Data Quality Gate
        gate = evaluate_modality_quality(satellite_data, soil_data, leaf_data)
        
        if not gate["can_diagnose"]:
            return {
                "verdict": "Insufficient evidence",
                "verdict_category": "INSUFFICIENT_EVIDENCE",
                "confidence_score": 0.0,
                "summary": gate["refusal_reason"],
                "quality_gate": gate,
                "primary_cause": "No reliable signals across satellite, soil, or leaf inputs.",
                "evidence_sources": [],
                "recommended_farmer_action": "Upload a clear rice leaf photo and add recent soil test values.",
                "remedies": [
                    "Ensure photos are taken in daylight focused on discolored leaf lesions.",
                    "Obtain a Soil Health Card (SHC) from your nearest Tamil Nadu Department of Agriculture lab."
                ]
            }

        # 2. Extract signals from each modality
        sat_stress = satellite_data.get("stress_detected", False) if satellite_data else False
        sat_stress_type = satellite_data.get("stress_type", "Healthy") if satellite_data else "Unknown"
        mean_ndvi = satellite_data.get("mean_ndvi") if satellite_data else None
        mean_ndwi = satellite_data.get("mean_ndwi") if satellite_data else None

        soil_stress = soil_data.get("has_stress", False) if soil_data else False
        soil_deficiencies = soil_data.get("deficiencies", []) if soil_data else []
        soil_toxicities = soil_data.get("toxicities", []) if soil_data else []

        leaf_class = leaf_data.get("predicted_class", "Healthy") if leaf_data else None
        leaf_conf = leaf_data.get("confidence", 0.0) if leaf_data else 0.0
        is_leaf_disease = (leaf_class is not None and leaf_class != "Healthy" and leaf_conf >= 0.45)

        evidence_sources = []
        if gate["modalities"]["satellite"]["level"] != "Insufficient":
            evidence_sources.append(f"Satellite ({sat_stress_type}, NDVI: {mean_ndvi})")
        if gate["modalities"]["soil"]["level"] != "Insufficient":
            def_names = [d["parameter"] for d in soil_deficiencies]
            evidence_sources.append(f"Soil ({', '.join(def_names) if def_names else 'Balanced'})")
        if gate["modalities"]["leaf"]["level"] != "Insufficient":
            evidence_sources.append(f"Leaf Classifier ({leaf_class} at {leaf_conf*100:.1f}%)")

        # 3. Decision Logic Matrix
        
        # Case A: Mixed Stress (Both Abiotic AND Biotic active)
        if (sat_stress or soil_stress) and is_leaf_disease and (len(soil_deficiencies) > 0 or (mean_ndwi is not None and mean_ndwi < -0.05)):
            def_text = ", ".join([d["parameter"].capitalize() for d in soil_deficiencies])
            verdict = "Mixed stress"
            verdict_category = "MIXED_STRESS"
            primary_cause = (
                f"Compounded stress: crop is suffering from foliar {leaf_class} disease "
                f"combined with nutrient deficiency ({def_text or 'Moisture deficit'})."
            )
            remedies = self._get_disease_remedy(leaf_class) + self._get_soil_remedy(soil_deficiencies)
            confidence = min(0.92, (leaf_conf + 0.85) / 2.0)

        # Case B: Biotic Stress (Pathogen confirmed, no soil deficiency)
        elif is_leaf_disease:
            verdict = "Biotic stress"
            verdict_category = "BIOTIC_STRESS"
            primary_cause = f"Infection by rice pathogen: {self._format_disease_name(leaf_class)}."
            remedies = self._get_disease_remedy(leaf_class)
            confidence = leaf_conf

        # Case C: Abiotic Stress (Soil deficiency or water deficit, leaf healthy or no pathogen)
        elif (soil_stress and len(soil_deficiencies) > 0) or (sat_stress and (mean_ndwi is not None and mean_ndwi < -0.05)):
            verdict = "Abiotic stress"
            verdict_category = "ABIOTIC_STRESS"
            if len(soil_deficiencies) > 0:
                deficit_list = [f"{d['parameter'].upper()} ({d['severity']})" for d in soil_deficiencies]
                primary_cause = f"Nutrient deficiency in soil: {', '.join(deficit_list)}."
            else:
                primary_cause = "Canopy water deficit (drought / inadequate irrigation)."
            remedies = self._get_soil_remedy(soil_deficiencies)
            if mean_ndwi is not None and mean_ndwi < -0.05:
                remedies.append("Implement alternate wetting and drying (AWD) irrigation; ensure 5 cm standing water during panicle initiation.")
            confidence = 0.88 if len(soil_deficiencies) >= 2 else 0.76

        # Case D: Satellite detected stress but soil and leaf are healthy/missing
        elif sat_stress:
            # Check if leaf was provided and said healthy
            if leaf_class == "Healthy" and leaf_conf >= 0.70:
                verdict = "Abiotic stress"
                verdict_category = "ABIOTIC_STRESS"
                primary_cause = "Sub-surface physiological or hydrological stress detected via satellite (canopy vigor drop)."
                remedies = [
                    "Inspect field bunds and drainage channels for waterlogging or micro-drought.",
                    "Verify nitrogen top-dressing schedule (apply urea with neem-coating)."
                ]
                confidence = 0.72
            else:
                verdict = "Insufficient evidence"
                verdict_category = "INSUFFICIENT_EVIDENCE"
                primary_cause = "Satellite shows canopy stress, but ground ground validation (leaf photo) is needed to identify root cause."
                remedies = [
                    "Take a close-up photo of any discolored leaves in the field to identify possible disease.",
                    "Check soil moisture and recent fertilizer applications."
                ]
                confidence = 0.55

        # Case E: Healthy
        else:
            verdict = "Healthy"
            verdict_category = "HEALTHY"
            primary_cause = "Canopy vigor, moisture indices, and available nutrients indicate a healthy, thriving paddy crop."
            remedies = [
                "Continue standard Cauvery delta irrigation and nutrient management.",
                "Maintain periodic satellite monitoring every 5 days."
            ]
            confidence = 0.94

        return {
            "verdict": verdict,
            "verdict_category": verdict_category,
            "confidence_score": round(confidence, 3),
            "primary_cause": primary_cause,
            "evidence_sources": evidence_sources,
            "quality_gate": gate,
            "remedies": remedies,
            "soil_deficiencies_detected": [d["parameter"] for d in soil_deficiencies],
            "leaf_disease_detected": leaf_class if is_leaf_disease else None,
            "satellite_ndvi": mean_ndvi,
            "satellite_ndwi": mean_ndwi
        }

    def _format_disease_name(self, class_name: str) -> str:
        mapping = {
            "BacterialBlight": "Bacterial Leaf Blight (Xanthomonas oryzae)",
            "Blast": "Rice Blast (Magnaporthe oryzae)",
            "BrownSpot": "Brown Spot (Bipolaris oryzae)",
            "Tungro": "Rice Tungro Spherical/Bacilliform Virus",
            "Healthy": "Healthy Rice Leaf"
        }
        return mapping.get(class_name, class_name)

    def _get_disease_remedy(self, disease_class: str) -> List[str]:
        remedies = {
            "BacterialBlight": [
                "Drain excess standing water from the field for 2-3 days to curb bacterial spread.",
                "Avoid applying excess nitrogen fertilizer (urea) during disease presence.",
                "Spray Copper Hydroxide (2.5 g/L) or Streptocycline (100 mg/L) combined with Copper Oxychloride (2.5 g/L)."
            ],
            "Blast": [
                "Avoid night irrigation and high chemical nitrogen fertilization.",
                "Spray Tricyclazole 75% WP @ 0.6 g/L or Isoprothiolane 40% EC @ 1.5 mL/L at initial symptom appearance.",
                "Ensure proper field drainage and maintain 2.5 cm water depth."
            ],
            "BrownSpot": [
                "Apply balanced NPK fertilization along with 25 kg/ha Zinc Sulfate.",
                "Spray Mancozeb 75% WP @ 2 g/L or Edifenphos 50% EC @ 1 mL/L.",
                "Correct soil potassium deficiency which predisposes paddy to brown spot."
            ],
            "Tungro": [
                "Tungro is transmitted by Green Leafhoppers (GLH). Control the insect vector immediately.",
                "Spray Thiamethoxam 25% WG @ 100 g/ha or Imidacloprid 17.8% SL @ 100 mL/ha.",
                "Rogue out and destroy infected yellow-orange stunted clumps."
            ],
            "Healthy": [
                "Maintain good agronomic sanitation and routine water monitoring."
            ]
        }
        return remedies.get(disease_class, ["Consult your local TNAU Krishi Vigyan Kendra (KVK) officer."])

    def _get_soil_remedy(self, deficiencies: List[Dict[str, Any]]) -> List[str]:
        remedies = []
        for d in deficiencies:
            param = d["parameter"]
            if param == "nitrogen":
                remedies.append("Top-dress with Neem-coated Urea (50 kg/ha in 3 split doses at tillering and panicle initiation).")
            elif param == "phosphorus":
                remedies.append("Apply Single Super Phosphate (SSP) or DAP as basal dose (35 kg P2O5/ha).")
            elif param == "potassium":
                remedies.append("Apply Muriate of Potash (MOP) @ 50 kg/ha in two splits to enhance disease resistance.")
            elif param == "zinc":
                remedies.append("Apply Zinc Sulfate (ZnSO4) @ 25 kg/ha as basal application, or foliar spray 0.5% ZnSO4 + 1% urea.")
            elif param == "iron":
                remedies.append("Foliar spray 1% Ferrous Sulfate + 0.1% Citric Acid twice at 7-day intervals.")
            elif param == "ph":
                if d.get("value", 7) < 5.5:
                    remedies.append("Apply agricultural lime (calcium carbonate) @ 500 kg/ha to neutralize soil acidity.")
                else:
                    remedies.append("Apply agricultural gypsum @ 500 kg/ha to ameliorate alkaline sodic soil.")
        return remedies
