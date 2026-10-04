"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Satellite, 
  Leaf, 
  Cpu, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  FlaskConical,
  Sprout,
  Compass,
  AlertTriangle,
  Play,
  KeyRound,
  User
} from "lucide-react";
import { TRANSLATIONS, SupportedLanguage } from "../lib/translations";

export default function LandingPage() {
  const router = useRouter();
  const [showEntranceModal, setShowEntranceModal] = useState(false);
  const [language, setLanguage] = useState<string>("en");

  useEffect(() => {
    // Check if user has made an entrance choice before
    const hasChosen = sessionStorage.getItem("sentinel_entrance_selected");
    if (!hasChosen) {
      setShowEntranceModal(true);
    }
    const savedLang = localStorage.getItem("sentinel_lang") || "en";
    setLanguage(savedLang);

    const handleLanguageUpdate = () => {
      const current = localStorage.getItem("sentinel_lang") || "en";
      setLanguage(current);
    };

    window.addEventListener("languageChanged", handleLanguageUpdate);
    return () => window.removeEventListener("languageChanged", handleLanguageUpdate);
  }, []);

  const activeLang = ((language === "ta" || language === "hi" || language === "en") ? language : "en") as SupportedLanguage;
  const t = TRANSLATIONS[activeLang]?.entrance || TRANSLATIONS.en.entrance;

  const selectMode = (mode: "real" | "demo") => {
    localStorage.setItem("sentinel_app_mode", mode);
    sessionStorage.setItem("sentinel_entrance_selected", "true");
    window.dispatchEvent(new Event("modeChanged"));
    setShowEntranceModal(false);

    if (mode === "real") {
      router.push("/field-setup");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="space-y-16 pb-12">
      
      {/* 1. Gateway Entrance Modal (Section requested by user: Ask question on entrance) */}
      {showEntranceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-9 max-w-2xl w-full border border-slate-200 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="text-center space-y-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                <Sprout className="w-3.5 h-3.5" />
                <span>{t.tag}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {t.question}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                {t.subtext}
              </p>
            </div>

            {/* Quick THILAK Built-In Access Card (Ponneri Field) */}
            <div 
              onClick={() => {
                localStorage.setItem("sentinel_user", JSON.stringify({
                  username: "THILAK",
                  role: "Farmer / Land Owner",
                  location: "Ponneri, Tiruvallur District",
                  hasSoilTest: false
                }));
                localStorage.setItem("sentinel_active_field", JSON.stringify({
                  id: "field_ponneri_thilak",
                  name: "Ponneri North Paddy Field",
                  district: "Tiruvallur",
                  town: "Ponneri",
                  centerLat: 13.3330,
                  centerLon: 80.1980,
                  is_validated: true,
                  areaAcres: 2.2,
                  soilData: null,
                  createdAt: new Date().toISOString(),
                  isLiveField: true,
                  polygonGeoJSON: {
                    type: "Polygon",
                    coordinates: [[
                      [80.1950, 13.3310],
                      [80.2010, 13.3310],
                      [80.2020, 13.3350],
                      [80.1960, 13.3370],
                      [80.1950, 13.3310]
                    ]]
                  }
                }));
                localStorage.setItem("sentinel_app_mode", "real");
                sessionStorage.setItem("sentinel_entrance_selected", "true");
                window.dispatchEvent(new Event("userChanged"));
                window.dispatchEvent(new Event("modeChanged"));
                setShowEntranceModal(false);
                router.push("/dashboard");
              }}
              className="p-4 rounded-2xl bg-gradient-to-r from-emerald-100 via-teal-100 to-blue-100 border-2 border-emerald-300 hover:border-emerald-600 cursor-pointer flex items-center justify-between transition-all hover:scale-[1.01] shadow-xs"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  TH
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-xs text-slate-900">{t.thilakTitle}</span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-950 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                      {t.thilakBadge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {t.thilakSub}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-xs font-bold text-emerald-900 bg-white/80 px-3 py-1.5 rounded-xl border border-emerald-300 shadow-2xs">
                <span>{t.thilakAction}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Option A: Real Platform */}
              <div 
                onClick={() => selectMode("real")}
                className="group p-5 rounded-2xl border-2 border-emerald-300 hover:border-emerald-600 bg-emerald-50/50 hover:bg-emerald-50 cursor-pointer transition-all shadow-sm hover:shadow-md flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-200 group-hover:scale-105 transition-transform">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{t.realTitle}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {t.realDesc}
                  </p>
                </div>
                <button
                  type="button"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 group-hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1 transition-colors"
                >
                  <span>{t.realAction}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Option B: Complete Demo */}
              <div 
                onClick={() => selectMode("demo")}
                className="group p-5 rounded-2xl border-2 border-purple-300 hover:border-purple-600 bg-purple-50/50 hover:bg-purple-50 cursor-pointer transition-all shadow-sm hover:shadow-md flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-200 group-hover:scale-105 transition-transform">
                    <Play className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{t.demoTitle}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {t.demoDesc}
                  </p>
                </div>
                <button
                  type="button"
                  className="w-full py-2.5 rounded-xl bg-purple-600 group-hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center space-x-1 transition-colors"
                >
                  <span>{t.demoAction}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            <div className="text-center text-[11px] text-slate-400">
              {t.footerNote}
            </div>

          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-6 pb-10 text-center max-w-4xl mx-auto space-y-6">
        
        {/* Crop Scope Lock Callout */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200">
          <Sprout className="w-4 h-4 text-emerald-700" />
          <span>Specialized for Paddy Only (*Oryza sativa*) • Tamil Nadu State-Wide</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Continuous, Satellite-First <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">
            Paddy Stress Intelligence
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Sentinel-2 satellite imagery is the always-on monitor. 
          When an anomaly or cloud obscuration occurs, the system asks for soil chemistry and leaf inspection to isolate the exact cause and prescribe the scientific cure.
        </p>

        {/* Entry Buttons: Real Map, Login as THILAK, Demo */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 hover:scale-[1.02]"
          >
            <KeyRound className="w-4 h-4 text-emerald-400" />
            <span>Login (THILAK - Ponneri Field)</span>
          </Link>

          <button
            onClick={() => selectMode("real")}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-200 transition-all flex items-center justify-center space-x-2 hover:scale-[1.02]"
          >
            <MapPin className="w-4 h-4" />
            <span>Select My Land (Real Map)</span>
          </button>
          
          <button
            onClick={() => selectMode("demo")}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-lg shadow-purple-200 transition-all flex items-center justify-center space-x-2 hover:scale-[1.02]"
          >
            <Play className="w-4 h-4" />
            <span>Demo Benchmark</span>
          </button>
        </div>

        {/* Trust & Scope Strip */}
        <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Paddy Crop Only (*Oryza sativa*)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Google Satellite Hybrid View</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Multi-Constellation Satellite Radar</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>TNAU Certified Agronomic Remedies</span>
          </div>
        </div>
      </section>

      {/* Why Paddy Only? Scientific Rationale Box */}
      <section className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2.5 text-emerald-900 font-bold text-base">
          <Sprout className="w-5 h-5 text-emerald-600" />
          <span>Why is Sentinel AI built exclusively for Paddy (Rice)?</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs text-slate-600 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <strong className="text-slate-900 block text-sm">1. Unique Hydrological Signature</strong>
            Paddy is cultivated in standing water under flooded or saturated conditions. Its satellite NDWI and NDVI spectral curves are fundamentally different from dryland crops like maize or cotton.
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <strong className="text-slate-900 block text-sm">2. Host-Specific Pathology</strong>
            Diseases like Bacterial Leaf Blight (*Xanthomonas oryzae*), Blast (*Magnaporthe oryzae*), and Tungro Virus exclusively infect paddy crops. General multi-crop models produce dangerously inaccurate diagnoses.
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <strong className="text-slate-900 block text-sm">3. Actionable Field Remedies</strong>
            Direct integration with Tamil Nadu Agricultural University (TNAU) pest management guides provides immediate organic & chemical treatment protocols.
          </div>
        </div>
      </section>

      {/* 3 Core Multi-Modal Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Pillar 1 */}
        <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
            <Satellite className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">1. Continuous Satellite Watch</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            Monitors vegetation vigor (NDVI) & moisture (NDWI) every 2–3 days. When monsoon clouds cover optical satellites, active radar SAR penetrates clouds with 100% uptime.
          </p>
          <div className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded inline-block">
            2.3-Day Revisit & SAR Radar
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
            <Leaf className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">2. Instant Leaf Camera Scan</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            Capture a rice leaf on your mobile phone to immediately diagnose Healthy crop, Bacterial Blight, Blast, Brown Spot, or Tungro Virus.
          </p>
          <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded inline-block">
            5 Key Paddy Diagnoses
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">3. Verified Agronomic Advisory</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            Correlates orbital stress alerts with soil health and leaf symptoms to prescribe verified TNAU & ICAR cures with voice read-aloud in Tamil and English.
          </p>
          <div className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded inline-block">
            TNAU & ICAR Certified Protocols
          </div>
        </div>

      </section>

    </div>
  );
}
