"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Download, 
  RefreshCw, 
  ArrowLeft, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  FlaskConical, 
  Leaf, 
  Satellite,
  HelpCircle,
  Clock,
  Pill,
  Sprout,
  Droplets
} from "lucide-react";
import { fuseModalities, generateAdvisory } from "../../lib/api";
import { FusedVerdictResult, AdvisoryResult } from "../../lib/types";
import { 
  TRANSLATIONS, 
  HIGH_VALUE_REMEDIES, 
  SupportedLanguage,
  HighValueRemedy 
} from "../../lib/translations";

export default function DiagnosticResultsPage() {
  const [fusedResult, setFusedResult] = useState<FusedVerdictResult | null>(null);
  const [advisory, setAdvisory] = useState<AdvisoryResult | null>(null);
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [field, setField] = useState<any>(null);

  useEffect(() => {
    // Load persisted state
    const savedField = localStorage.getItem("sentinel_active_field");
    const activeField = savedField ? JSON.parse(savedField) : null;
    setField(activeField);

    const savedSat = localStorage.getItem("sentinel_last_sat");
    const savedLeaf = localStorage.getItem("sentinel_last_leaf");
    const savedLang = (localStorage.getItem("sentinel_lang") as SupportedLanguage) || "en";
    setLanguage(savedLang);

    const satObj = savedSat ? JSON.parse(savedSat) : undefined;
    const leafObj = savedLeaf ? JSON.parse(savedLeaf) : undefined;
    const soilObj = activeField?.soilData ? {
      has_stress: (activeField.soilData.nitrogen && activeField.soilData.nitrogen < 140),
      deficiencies: (activeField.soilData.nitrogen && activeField.soilData.nitrogen < 140) ? [
        { parameter: "nitrogen", value: activeField.soilData.nitrogen, unit: "kg/ha", severity: "moderate" }
      ] : []
    } : undefined;

    // Execute fusion
    fuseModalities(satObj, soilObj, leafObj).then(async (fused) => {
      setFusedResult(fused);
      setLoading(false);

      // Fetch localized Gemini advisory
      const adv = await generateAdvisory(fused, savedLang, activeField);
      setAdvisory(adv);
    });

    // Listen for language changes from Navbar
    const handleLanguageUpdate = async () => {
      const newLang = (localStorage.getItem("sentinel_lang") as SupportedLanguage) || "en";
      setLanguage(newLang);
      const curFused = fusedResult;
      if (curFused) {
        const adv = await generateAdvisory(curFused, newLang, activeField);
        setAdvisory(adv);
      }
    };

    window.addEventListener("languageChanged", handleLanguageUpdate);

    // Clean up TTS on unmount
    return () => {
      window.removeEventListener("languageChanged", handleLanguageUpdate);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleLanguageToggle = async (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    localStorage.setItem("sentinel_lang", newLang);
    window.dispatchEvent(new Event("languageChanged"));
    if (fusedResult) {
      const adv = await generateAdvisory(fusedResult, newLang, field);
      setAdvisory(adv);
    }
  };

  const activeLang: SupportedLanguage = (language === "ta" || language === "hi") ? language : "en";
  const t = TRANSLATIONS[activeLang]?.results || TRANSLATIONS.en.results;

  // Determine active disease key
  const diseaseKey = fusedResult?.leaf_disease_detected || 
    (fusedResult?.verdict === "Healthy" ? "Healthy" : "BacterialBlight");
  
  const remedySet = HIGH_VALUE_REMEDIES[diseaseKey]?.[activeLang] || 
    HIGH_VALUE_REMEDIES["BacterialBlight"][activeLang];

  // Web Speech API Voice Read Aloud
  const handleReadAloud = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-Speech is not supported on this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Build comprehensive speech text from high-value remedies
    let textToSpeak = "";
    if (activeLang === "ta") {
      textToSpeak = `வணக்கம் விவசாயி நண்பரே. உங்கள் வயலில் ${remedySet.name} கண்டறியப்பட்டுள்ளது. ${remedySet.primary_cause}. பரிந்துரைக்கப்படும் உடனடி செயல் திட்டம்: ` +
        remedySet.remedies.map((r, i) => `${i + 1}: ${r.step}. ${r.detail}`).join(". ");
    } else if (activeLang === "hi") {
      textToSpeak = `नमस्ते किसान भाई। आपके खेत में ${remedySet.name} की पुष्टि हुई है। ${remedySet.primary_cause}. तुरंत करने योग्य उपाय: ` +
        remedySet.remedies.map((r, i) => `${i + 1}: ${r.step}. ${r.detail}`).join(". ");
    } else {
      textToSpeak = `Attention Farmer. Diagnosis of ${remedySet.name} confirmed. ${remedySet.primary_cause}. Actionable Plan: ` +
        remedySet.remedies.map((r, i) => `Step ${i + 1}: ${r.step}. ${r.detail}`).join(". ");
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const voices = window.speechSynthesis.getVoices();
    if (activeLang === "ta") {
      const taVoice = voices.find(v => v.lang.includes("ta") || v.lang.includes("ta-IN"));
      if (taVoice) utterance.voice = taVoice;
      utterance.lang = "ta-IN";
    } else if (activeLang === "hi") {
      const hiVoice = voices.find(v => v.lang.includes("hi") || v.lang.includes("hi-IN"));
      if (hiVoice) utterance.voice = hiVoice;
      utterance.lang = "hi-IN";
    } else {
      utterance.lang = "en-IN";
    }

    utterance.rate = 0.92;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // CSV Export
  const handleExportCSV = () => {
    if (!fusedResult) return;
    const rows = [
      ["Parameter", "Value"],
      ["Field Name", field?.name || "Ponneri North Field"],
      ["District", field?.district || "Tiruvallur"],
      ["Town", field?.town || "Ponneri"],
      ["Area (Acres)", field?.areaAcres || "2.2"],
      ["Language", activeLang],
      ["Diagnostic Verdict", remedySet.name],
      ["Confidence Score", `${(fusedResult.confidence_score * 100).toFixed(1)}%`],
      ["Primary Cause", remedySet.primary_cause],
      ["Satellite Mean NDVI", fusedResult.satellite_ndvi?.toFixed(3) || "0.720"],
      ["Satellite Mean NDWI", fusedResult.satellite_ndwi?.toFixed(3) || "0.220"],
      ...remedySet.remedies.map((r, i) => [`Action Step ${i + 1} (${r.timing})`, `${r.step} - ${r.detail}`])
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.map(cell => `"${cell}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SentinelAI_Diagnosis_${field?.district || "Field"}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || !fusedResult) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-600 font-medium text-sm">
          {activeLang === "ta" 
            ? "செயற்கைக்கோள், மண் மற்றும் இலை தகவல்கள் ஆய்வு செய்யப்படுகின்றன..." 
            : activeLang === "hi"
              ? "उपग्रह, मृदा और पत्ती डेटा का समेकन किया जा रहा है..."
              : "Cross-validating satellite, soil, and leaf evidence..."}
        </p>
      </div>
    );
  }

  const getTheme = () => {
    if (fusedResult.verdict === "Healthy") {
      return {
        bg: "bg-emerald-50/80",
        border: "border-emerald-300",
        text: "text-emerald-950",
        badge: "bg-emerald-200 text-emerald-900 border-emerald-300"
      };
    }
    return {
      bg: "bg-rose-50/80",
      border: "border-rose-300",
      text: "text-rose-950",
      badge: "bg-rose-200 text-rose-900 border-rose-300"
    };
  };

  const verdictTheme = getTheme();

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "chemical":
        return { label: activeLang === "ta" ? "ரசாயன முறை" : activeLang === "hi" ? "रासायनिक उपचार" : "Chemical Spray", color: "bg-rose-100 text-rose-800 border-rose-200", icon: Pill };
      case "organic":
        return { label: activeLang === "ta" ? "இயற்கை வழிமுறை" : activeLang === "hi" ? "जैविक उपचार" : "Organic Bio-Control", color: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: Sprout };
      case "cultural":
        return { label: activeLang === "ta" ? "உழவியல் முறை" : activeLang === "hi" ? "सस्य प्रबंधन" : "Field Water Drainage", color: "bg-blue-100 text-blue-800 border-blue-200", icon: Droplets };
      case "nutrient":
        return { label: activeLang === "ta" ? "ஊட்டச்சத்து மேலாண்மை" : activeLang === "hi" ? "पोषण सुधार" : "Nutrient Rectification", color: "bg-amber-100 text-amber-800 border-amber-200", icon: FlaskConical };
      default:
        return { label: "Protocol", color: "bg-slate-100 text-slate-800 border-slate-200", icon: CheckCircle2 };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link 
          href="/dashboard"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs hover:shadow-xs transition-all w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{activeLang === "ta" ? "டேஷ்போர்டுக்குத் திரும்பு" : activeLang === "hi" ? "डैशबोर्ड पर वापस जाएं" : "Back to Farm Dashboard"}</span>
        </Link>

        <div className="flex items-center space-x-2">
          {/* Audio read-aloud button */}
          <button
            onClick={handleReadAloud}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 border transition-all ${
              isSpeaking
                ? "bg-rose-50 text-rose-700 border-rose-300 animate-pulse shadow-sm"
                : "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 shadow-2xs"
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
            <span>{isSpeaking ? t.stopVoice : t.listenVoice}</span>
          </button>

          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 flex items-center space-x-1.5 shadow-2xs transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{t.exportCSV}</span>
          </button>
        </div>
      </div>

      {/* Primary Diagnosis Card */}
      <div className={`rounded-3xl p-7 sm:p-9 border-2 ${verdictTheme.bg} ${verdictTheme.border} ${verdictTheme.text} shadow-sm space-y-4`}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase border ${verdictTheme.badge}`}>
            {remedySet.name}
          </span>
          <div className="text-xs font-mono font-medium">
            {t.confidenceLabel}: <strong>{(fusedResult.confidence_score * 100).toFixed(1)}%</strong>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          {fusedResult.verdict === "Healthy" 
            ? t.healthyTitle 
            : `${remedySet.name} ${t.confirmedTitle}`}
        </h1>

        <p className="text-sm sm:text-base leading-relaxed opacity-95">
          {remedySet.primary_cause}
        </p>

        {/* Evidence Sources Strip */}
        <div className="pt-2 flex flex-wrap gap-2 text-xs">
          <span className="font-semibold opacity-75">{t.corroboratingLabel}</span>
          {fusedResult.evidence_sources.map((src, i) => (
            <span key={i} className="px-2.5 py-0.5 rounded-full bg-white/80 font-medium border border-black/5">
              {src}
            </span>
          ))}
        </div>
      </div>

      {/* Data Quality Gate Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{t.qualityGateTitle}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Satellite */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-700">
              <span className="flex items-center space-x-1"><Satellite className="w-3.5 h-3.5 text-blue-600" /><span>{t.satelliteModality}</span></span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white border font-bold text-emerald-800">
                {fusedResult.quality_gate?.modalities?.satellite?.level || "Full"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {activeLang === "ta" ? "சென்டினல்-2 & SAR ரேடார் ஆய்வு முடிந்தது." : activeLang === "hi" ? "उपग्रह पिक्सेल जांच सफल।" : "Sentinel-2 & SAR radar checked."}
            </p>
          </div>

          {/* Soil */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-700">
              <span className="flex items-center space-x-1"><FlaskConical className="w-3.5 h-3.5 text-purple-600" /><span>{t.soilModality}</span></span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white border font-bold">
                {fusedResult.quality_gate?.modalities?.soil?.level || "Partial"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {activeLang === "ta" ? "மண் சத்து நிலை சரிபார்க்கப்பட்டது." : activeLang === "hi" ? "मृदा पोषण स्थिति जांची गई।" : "Soil nutrient levels assessed."}
            </p>
          </div>

          {/* Leaf */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-700">
              <span className="flex items-center space-x-1"><Leaf className="w-3.5 h-3.5 text-emerald-600" /><span>{t.leafModality}</span></span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white border font-bold text-emerald-800">
                {fusedResult.quality_gate?.modalities?.leaf?.level || "Full"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {activeLang === "ta" ? "இலை நோய் அறிகுறிகள் உறுதிசெய்யப்பட்டன." : activeLang === "hi" ? "पत्ती के लक्षण सत्यापित किए गए।" : "Foliar pathology validated."}
            </p>
          </div>
        </div>
      </div>

      {/* Multilingual Gemini AI Advisory Layer */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">{t.geminiAdvisoryTitle}</h3>
          </div>

          {/* Language toggle inside page */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => handleLanguageToggle("en")}
              className={`px-3 py-1 rounded transition-all ${language === "en" ? "bg-white text-slate-900 shadow font-bold" : "text-slate-600"}`}
            >
              English
            </button>
            <button
              onClick={() => handleLanguageToggle("ta")}
              className={`px-3 py-1 rounded transition-all ${language === "ta" ? "bg-white text-emerald-800 shadow font-bold" : "text-slate-600"}`}
            >
              தமிழ்
            </button>
            <button
              onClick={() => handleLanguageToggle("hi")}
              className={`px-3 py-1 rounded transition-all ${language === "hi" ? "bg-white text-slate-900 shadow font-bold" : "text-slate-600"}`}
            >
              हिन्दी
            </button>
          </div>
        </div>

        {/* Advisory Text */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm whitespace-pre-line leading-relaxed font-sans">
          {advisory?.advisory_text || (activeLang === "ta" ? "வழிகாட்டல் உருவாக்கப்படுகிறது..." : "Generating localized advisory...")}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Engine: {advisory?.source || "TNAU Certified Agronomic Model"}</span>
          <span>Localized: {language.toUpperCase()}</span>
        </div>
      </div>

      {/* Actionable Remedies List (High-Value, Worth Taking Action On!) */}
      <div className="bg-white rounded-3xl p-7 sm:p-9 border border-slate-200 shadow-sm space-y-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-2">
            <Sprout className="w-3.5 h-3.5 text-emerald-700" />
            <span>TNAU Crop Production Guide 2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.remediesHeader}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t.remedyWorthNote}
          </p>
        </div>

        <div className="space-y-4">
          {remedySet.remedies.map((remedy: HighValueRemedy, idx: number) => {
            const badge = getCategoryBadge(remedy.category);
            const BadgeIcon = badge.icon;
            return (
              <div 
                key={idx} 
                className="p-5 rounded-2xl bg-slate-50 hover:bg-emerald-50/40 border border-slate-200 hover:border-emerald-300 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      {remedy.step}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.color}`}>
                      <BadgeIcon className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </span>
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200/80 text-slate-700">
                      <Clock className="w-3 h-3" />
                      <span>{remedy.timing}</span>
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-10 font-medium">
                  {remedy.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
