"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  CheckCircle2, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Satellite, 
  CloudSun, 
  Camera, 
  ArrowRight, 
  MapPin, 
  Layers, 
  RotateCw,
  Clock,
  Sparkles,
  ShieldCheck,
  FlaskConical,
  Play,
  Calendar,
  AlertCircle
} from "lucide-react";
import { analyzeSatellite, evaluateSoil, fuseModalities, analyzeLeaf } from "../../lib/api";
import { SatelliteAnalysisResult, FusedVerdictResult, LeafClassificationResult } from "../../lib/types";
import { TRANSLATIONS, SupportedLanguage } from "../../lib/translations";

export default function DashboardPage() {
  const router = useRouter();
  const [field, setField] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [satelliteData, setSatelliteData] = useState<SatelliteAnalysisResult | null>(null);
  const [fusionData, setFusionData] = useState<FusedVerdictResult | null>(null);
  const [simulationMode, setSimulationMode] = useState<string>("stress"); // Default to stress to demonstrate defect & cure
  const [appMode, setAppMode] = useState<"demo" | "real">("demo");
  const [demoRunning, setDemoRunning] = useState(false);
  const [satelliteTab, setSatelliteTab] = useState<"optical" | "sar" | "constellation">("constellation");
  const [language, setLanguage] = useState<SupportedLanguage>("en");

  useEffect(() => {
    const savedLang = (localStorage.getItem("sentinel_lang") as SupportedLanguage) || "en";
    setLanguage(savedLang);

    const handleLanguageUpdate = () => {
      const current = (localStorage.getItem("sentinel_lang") as SupportedLanguage) || "en";
      setLanguage(current);
    };

    window.addEventListener("languageChanged", handleLanguageUpdate);

    const savedMode = (localStorage.getItem("sentinel_app_mode") as "demo" | "real") || "demo";
    setAppMode(savedMode);

    const savedFieldStr = localStorage.getItem("sentinel_active_field");
    let activeField: any;

    if (savedFieldStr && savedMode === "real") {
      activeField = JSON.parse(savedFieldStr);
    } else {
      // Default Thanjavur Benchmark Demo Field
      activeField = {
        name: "Thennamanadu South Field",
        district: "Thanjavur",
        town: "Orathanadu",
        centerLat: 10.7870,
        centerLon: 79.1378,
        is_validated: true,
        polygonGeoJSON: {
          type: "Polygon",
          coordinates: [[
            [79.1350, 10.7850],
            [79.1410, 10.7850],
            [79.1420, 10.7890],
            [79.1360, 10.7910],
            [79.1350, 10.7850]
          ]]
        },
        soilData: {
          ph: 6.2,
          nitrogen: 125, // Deficient (<140 kg/ha)
          phosphorus: 15,
          potassium: 165,
          zinc: 0.55,    // Deficient (<0.6 ppm)
          iron: 6.8,
          test_date: "2026-08-10"
        }
      };
      if (savedMode === "demo") {
        localStorage.setItem("sentinel_active_field", JSON.stringify(activeField));
      }
    }

    setField(activeField);
    runAnalysis(activeField, savedMode === "demo" ? "stress" : "normal");

    return () => {
      window.removeEventListener("languageChanged", handleLanguageUpdate);
    };
  }, []);

  const runAnalysis = async (activeField: any, simMode: string) => {
    setLoading(true);
    try {
      const forceSim = simMode === "stress" ? "critical_stress" : (simMode === "cloudy" ? "cloudy" : undefined);
      
      const satRes = await analyzeSatellite(
        activeField.polygonGeoJSON,
        0.65,
        forceSim
      );
      setSatelliteData(satRes);

      const soilRes = await evaluateSoil(activeField.soilData || {});

      // Cycle baseline fusion
      const fused = await fuseModalities(satRes, soilRes, undefined);
      setFusionData(fused);

      localStorage.setItem("sentinel_last_sat", JSON.stringify(satRes));
      localStorage.setItem("sentinel_last_fusion", JSON.stringify(fused));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSimToggle = (mode: string) => {
    setSimulationMode(mode);
    if (field) {
      runAnalysis(field, mode);
    }
  };

  // 1-Click Complete Demo Execution (Requested by User: Load defect image and give correct cureness)
  const handleRunFullDefectDemo = async () => {
    setDemoRunning(true);
    try {
      // 1. Set satellite into stress anomaly (NDVI drop)
      const satRes = await analyzeSatellite(field.polygonGeoJSON, 0.65, "critical_stress");
      setSatelliteData(satRes);

      // 2. Load Defect Leaf Image (Bacterial Leaf Blight benchmark)
      const defectLeaf: LeafClassificationResult = {
        filename: "bacterial_blight_defect_sample.jpg",
        predicted_class: "BacterialBlight",
        confidence: 0.9994,
        class_probabilities: {
          "Healthy": 0.0002,
          "BacterialBlight": 0.9994,
          "Blast": 0.0001,
          "BrownSpot": 0.0001,
          "Tungro": 0.0002
        },
        is_healthy: false
      };

      // 3. Evaluate soil (with real Nitrogen deficiency)
      const soilRes = await evaluateSoil(field.soilData || {});

      // 4. Run Multimodal Fusion
      const fused = await fuseModalities(satRes, soilRes, defectLeaf);
      setFusionData(fused);

      localStorage.setItem("sentinel_last_sat", JSON.stringify(satRes));
      localStorage.setItem("sentinel_last_leaf", JSON.stringify(defectLeaf));
      localStorage.setItem("sentinel_last_fusion", JSON.stringify(fused));

      // Redirect directly to the full diagnosis & cure page!
      router.push("/results");
    } catch (e) {
      console.error(e);
    } finally {
      setDemoRunning(false);
    }
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const tDash = t.dashboard || TRANSLATIONS.en.dashboard;

  if (loading || !field) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-600 font-medium text-sm">{tDash.loading}</p>
      </div>
    );
  }

  const isStressDetected = satelliteData?.stress_detected || satelliteData?.evidence_level === "Insufficient";
  const triggerLeaf = satelliteData?.anomaly_detected;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Top Banner: Mode Indicator & Quick Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
            appMode === "demo" ? "bg-purple-100 text-purple-800" : "bg-emerald-100 text-emerald-800"
          }`}>
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-slate-900 text-base">{field.name}</h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                appMode === "demo" ? "bg-purple-100 text-purple-800 border border-purple-200" : "bg-emerald-100 text-emerald-800 border border-emerald-200"
              }`}>
                {appMode === "demo" ? tDash.demoBadge : tDash.liveBadge}
              </span>
              {field.is_validated && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 hidden sm:inline">
                  {tDash.thanjavurBadge}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              {field.town}, {field.district} • ~{field.areaAcres || "1.8"} {tDash.acres}
            </p>
          </div>
        </div>

        {/* Satellite Scenario Switcher */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => handleSimToggle("normal")}
            className={`px-3 py-1.5 rounded-lg transition-all ${simulationMode === "normal" ? "bg-white text-slate-900 shadow-sm font-bold" : "text-slate-600"}`}
          >
            {tDash.scenarioClear}
          </button>
          <button
            onClick={() => handleSimToggle("stress")}
            className={`px-3 py-1.5 rounded-lg transition-all ${simulationMode === "stress" ? "bg-white text-rose-700 shadow-sm font-bold" : "text-slate-600"}`}
          >
            {tDash.scenarioStress}
          </button>
          <button
            onClick={() => handleSimToggle("cloudy")}
            className={`px-3 py-1.5 rounded-lg transition-all ${simulationMode === "cloudy" ? "bg-white text-amber-700 shadow-sm font-bold" : "text-slate-600"}`}
          >
            {tDash.scenarioCloud}
          </button>
        </div>
      </div>

      {/* Main Status Hero Card (Section 4) */}
      <div className={`rounded-3xl p-8 sm:p-10 border transition-all ${
        !isStressDetected 
          ? "bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border-emerald-600 shadow-xl shadow-emerald-100" 
          : "bg-gradient-to-br from-amber-500 to-rose-600 text-white border-rose-600 shadow-xl shadow-rose-100"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-semibold">
              <Satellite className="w-3.5 h-3.5" />
              <span>{tDash.overpass} {satelliteData?.acquisition_date || tDash.today}</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              {!isStressDetected ? tDash.fieldHealthy : tDash.needsAttention}
            </h1>

            <p className="text-white/90 text-sm sm:text-base max-w-xl leading-relaxed">
              {!isStressDetected
                ? tDash.healthyDesc
                : (satelliteData?.trigger_leaf_reason || tDash.needsAttention)}
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur text-white font-semibold text-xs sm:text-sm flex items-center space-x-2 transition-all border border-white/30"
            >
              <span>{showDetails ? tDash.hideTech : tDash.viewTech}</span>
              {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Soil Health Status Card (Handles when farmer does not have soil test, keeping the option intact) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{tDash.soilTelemetryTitle}</h3>
              <p className="text-[11px] text-slate-500">{tDash.soilTelemetrySub}</p>
            </div>
          </div>
          <Link
            href="/field-setup"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>{field.soilData?.nitrogen ? tDash.updateSoil : tDash.addSoil}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {(!field.soilData || !field.soilData.nitrogen) ? (
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-amber-900">{tDash.noSoilTitle}</span>
                <span className="text-[10px] bg-amber-200 text-amber-950 font-bold px-1.5 py-0.5 rounded">{tDash.optional}</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                {tDash.noSoilDesc}
              </p>
            </div>
            <Link
              href="/field-setup"
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 text-center shadow-xs"
            >
              {tDash.enterLabBtn}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="text-[10px] text-slate-500 font-semibold">pH</div>
              <div className="font-bold text-slate-900 text-sm mt-0.5">{field.soilData.ph ?? "—"}</div>
              <div className="text-[9px] text-slate-400">{tDash.optimal} 6.0-7.5</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="text-[10px] text-slate-500 font-semibold">Nitrogen (N)</div>
              <div className="font-bold text-slate-900 text-sm mt-0.5">{field.soilData.nitrogen ?? "—"} <span className="text-[9px]">kg/ha</span></div>
              <div className="text-[9px] text-slate-400">{field.soilData.nitrogen < 140 ? tDash.deficient : tDash.adequate}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="text-[10px] text-slate-500 font-semibold">Phosphorus (P)</div>
              <div className="font-bold text-slate-900 text-sm mt-0.5">{field.soilData.phosphorus ?? "—"} <span className="text-[9px]">kg/ha</span></div>
              <div className="text-[9px] text-slate-400">{tDash.optimal} 11-22</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="text-[10px] text-slate-500 font-semibold">Potassium (K)</div>
              <div className="font-bold text-slate-900 text-sm mt-0.5">{field.soilData.potassium ?? "—"} <span className="text-[9px]">kg/ha</span></div>
              <div className="text-[9px] text-slate-400">{tDash.optimal} 118-280</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="text-[10px] text-slate-500 font-semibold">Zinc (Zn)</div>
              <div className="font-bold text-slate-900 text-sm mt-0.5">{field.soilData.zinc ?? "—"} <span className="text-[9px]">ppm</span></div>
              <div className="text-[9px] text-slate-400">{field.soilData.zinc < 0.6 ? tDash.low : tDash.adequate}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <div className="text-[10px] text-slate-500 font-semibold">Iron (Fe)</div>
              <div className="font-bold text-slate-900 text-sm mt-0.5">{field.soilData.iron ?? "—"} <span className="text-[9px]">ppm</span></div>
              <div className="text-[9px] text-slate-400">{tDash.optimal} &gt;5.0</div>
            </div>
          </div>
        )}
      </div>

      {/* Satellite Overpass & Cloud Clearance Tracker (Section requested by user: explains daily check vs clouds) */}
      {/* Multi-Constellation HLS & Sentinel-1 SAR Radar Integration (Idea 1 & Idea 3) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Satellite className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-base">
                {tDash.constellationCardTitle}
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              {tDash.constellationCardSub}
            </p>
          </div>

          {/* Sub-Tabs for Idea 1 & Idea 3 */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setSatelliteTab("constellation")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                satelliteTab === "constellation" 
                  ? "bg-white text-emerald-800 shadow-sm font-bold" 
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tDash.tabHls}
            </button>
            <button
              onClick={() => setSatelliteTab("sar")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                satelliteTab === "sar" 
                  ? "bg-white text-indigo-700 shadow-sm font-bold" 
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tDash.tabSar}
            </button>
            <button
              onClick={() => setSatelliteTab("optical")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                satelliteTab === "optical" 
                  ? "bg-white text-slate-900 shadow-sm font-bold" 
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tDash.tabOptical}
            </button>
          </div>
        </div>

        {/* TAB 1: Idea 1 - Multi-Constellation HLS (Cadence Reduction from 5d to 2.3d) */}
        {satelliteTab === "constellation" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {tDash.hlsActiveBadge}
                </span>
                <h4 className="text-base font-extrabold text-slate-900 mt-1">
                  {tDash.cadenceSlashed}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  {tDash.cadenceDesc}
                </p>
              </div>
              <div className="shrink-0 text-right sm:border-l sm:border-emerald-200 sm:pl-4">
                <div className="text-xs text-slate-500 font-medium">{tDash.nextOverpass}</div>
                <div className="text-sm font-bold text-emerald-800">{tDash.nextOverpassVal}</div>
              </div>
            </div>

            {/* Timetable of interleaved satellites */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white border-2 border-emerald-500 shadow-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Sentinel-2A</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">{tDash.liveToday}</span>
                </div>
                <div className="text-[11px] text-slate-500">ESA • 10m Optical</div>
                <div className="font-mono text-emerald-700 font-bold text-xs mt-1">NDVI = {satelliteData?.mean_ndvi ?? "0.65"}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">NASA Landsat 9</span>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded">{tDash.in2Days}</span>
                </div>
                <div className="text-[11px] text-slate-500">NASA/USGS • HLS 10m</div>
                <div className="text-[11px] text-slate-600 font-medium">{tDash.harmonizedReflectance}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Sentinel-2B</span>
                  <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded">{tDash.in5Days}</span>
                </div>
                <div className="text-[11px] text-slate-500">ESA • 10m Optical</div>
                <div className="text-[11px] text-slate-600 font-medium">{tDash.twinConstellation}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">NASA Landsat 8</span>
                  <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded">{tDash.in7Days}</span>
                </div>
                <div className="text-[11px] text-slate-500">NASA/USGS • HLS 10m</div>
                <div className="text-[11px] text-slate-600 font-medium">{tDash.thermalMultispectral}</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Idea 3 - Sentinel-1 SAR Cloud-Penetrating C-Band Radar */}
        {satelliteTab === "sar" && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-slate-50 border border-indigo-200 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
                  <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide">
                    {tDash.sarTitle}
                  </span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                  {tDash.sarBadge}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {tDash.sarDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-slate-500 font-semibold text-[10px] uppercase">{tDash.rviLabel}</div>
                <div className="font-bold text-indigo-700 text-base">
                  RVI = {satelliteData?.sar_rvi ?? "0.724"}
                </div>
                <div className="text-[11px] text-slate-500">
                  {tDash.rviFormula}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-slate-500 font-semibold text-[10px] uppercase">{tDash.crLabel}</div>
                <div className="font-bold text-slate-900 text-base">
                  VH/VV = {satelliteData?.sar_cross_ratio ?? "0.285"}
                </div>
                <div className="text-[11px] text-slate-500">
                  {tDash.crFormula}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950 space-y-1">
                <div className="text-indigo-700 font-semibold text-[10px] uppercase">{tDash.cloudOverrideLabel}</div>
                <div className="font-bold text-indigo-900 text-sm">
                  {satelliteData?.cloud_penetrated ? tDash.activeCloudPiercing : tDash.standingByCloud}
                </div>
                <p className="text-indigo-800 text-[11px]">
                  {tDash.cloudOverrideDesc}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Orbit & Cloud Clearance Overview */}
        {satelliteTab === "optical" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="text-slate-500 font-semibold text-[10px] uppercase">{tDash.orbitCadenceLabel}</div>
              <div className="font-bold text-slate-900 text-sm">{tDash.every5Days}</div>
              <p className="text-slate-500 text-[11px]">
                {tDash.orbitCadenceDesc}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="text-slate-500 font-semibold text-[10px] uppercase">{tDash.cloudContamLabel}</div>
              <div className="font-bold text-slate-900 text-sm">
                {satelliteData?.cloud_coverage_pct}{tDash.cloudCoverVal}
              </div>
              <p className="text-slate-500 text-[11px]">
                {tDash.cloudContamDesc}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
              <div className="text-emerald-700 font-semibold text-[10px] uppercase">{tDash.multiTierLabel}</div>
              <div className="font-bold text-emerald-900 text-sm">{tDash.threeLevelSafe}</div>
              <p className="text-emerald-800 text-[11px]">
                {tDash.multiTierDesc}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* 1-Click Interactive Demo Card: Defect Image & Exact Cure (Requested by user) */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 border-2 border-purple-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
              <Play className="w-3.5 h-3.5" />
              <span>{tDash.demoCardBadge}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {tDash.demoCardTitle}
            </h3>
            <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
              {tDash.demoCardDesc}
            </p>
          </div>

          <button
            onClick={handleRunFullDefectDemo}
            disabled={demoRunning}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-200 flex items-center justify-center space-x-2 transition-all shrink-0 hover:scale-[1.02]"
          >
            {demoRunning ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>{tDash.runDemoBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Conditional Leaf & Soil Request (Triggered on satellite drop or clouds) */}
      {triggerLeaf && (
        <div className="bg-gradient-to-r from-rose-50 to-orange-50 border-2 border-rose-200 rounded-2xl p-6 sm:p-7 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-rose-700 font-bold text-base">
                <AlertCircle className="w-5 h-5" />
                <span>{tDash.groundReqTitle}</span>
              </div>
              <p className="text-xs text-rose-800 leading-relaxed max-w-2xl">
                <strong>{tDash.groundReqWhy}</strong> {satelliteData?.trigger_leaf_reason}
                <br />
                {tDash.groundReqDesc}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
              <Link
                href="/scan"
                className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm"
              >
                <Camera className="w-4 h-4" />
                <span>{tDash.uploadLeafBtn}</span>
              </Link>
              <Link
                href="/field-setup"
                className="px-4 py-3 rounded-xl bg-white border border-rose-300 hover:bg-rose-50 text-rose-800 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all"
              >
                <FlaskConical className="w-4 h-4" />
                <span>{tDash.updateSoilBtn}</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Technical Details Expander */}
      {showDetails && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <span>{tDash.techDetailsTitle}</span>
            </h3>
            <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-700">
              Copernicus S2MSI2A (10m)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {tDash.meanNdvi}
              </div>
              <div className="mt-1 text-2xl font-black text-slate-900">
                {satelliteData?.mean_ndvi !== null ? satelliteData?.mean_ndvi : "—"}
              </div>
              <div className="mt-1 text-[10px] text-slate-500">
                {tDash.ndviFormula}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {tDash.meanNdwi}
              </div>
              <div className="mt-1 text-2xl font-black text-slate-900">
                {satelliteData?.mean_ndwi !== null ? satelliteData?.mean_ndwi : "—"}
              </div>
              <div className="mt-1 text-[10px] text-slate-500">
                {tDash.ndwiFormula}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {tDash.purePixels}
              </div>
              <div className="mt-1 text-2xl font-black text-slate-900">
                {satelliteData?.usable_pixels} <span className="text-xs font-normal text-slate-400">/ {satelliteData?.total_field_pixels}</span>
              </div>
              <div className="mt-1 text-[10px] text-slate-500">
                {tDash.purePixelsSub}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {tDash.cloudCover}
              </div>
              <div className="mt-1 text-2xl font-black text-slate-900">
                {satelliteData?.cloud_coverage_pct}%
              </div>
              <div className="mt-1 text-[10px] text-slate-500">
                {tDash.cloudCoverSub}
              </div>
            </div>

          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong>{tDash.qualityGateStatus} {satelliteData?.evidence_level} {tDash.evidence}</strong>
              <p className="mt-0.5 text-emerald-800">
                {satelliteData?.evidence_note || tDash.qualityGateDefault}
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Navigation action cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/results"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 shadow-sm transition-all flex items-center justify-between group"
        >
          <div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700">{tDash.navFullReport}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{tDash.navFullReportSub}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
        </Link>

        <Link
          href="/field-setup"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 shadow-sm transition-all flex items-center justify-between group"
        >
          <div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700">{tDash.navFieldMap}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{tDash.navFieldMapSub}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
        </Link>
      </div>

    </div>
  );
}
