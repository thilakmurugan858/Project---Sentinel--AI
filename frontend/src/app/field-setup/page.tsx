"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { 
  MapPin, 
  Layers, 
  FlaskConical, 
  Calendar, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Sparkles,
  HelpCircle,
  Sprout
} from "lucide-react";
import { TAMIL_NADU_DISTRICTS } from "../../lib/districtsData";
import { SoilData } from "../../lib/types";

// Dynamically import SatelliteFieldMap to avoid SSR leaflet window errors
const SatelliteFieldMap = dynamic(
  () => import("../../components/SatelliteFieldMap"),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[420px] rounded-2xl bg-slate-900 border border-slate-700 flex flex-col items-center justify-center text-white space-y-3">
        <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-300 font-medium">Loading Google Satellite Hybrid Basemap & Geocoding...</p>
      </div>
    )
  }
);

import { TRANSLATIONS, SupportedLanguage } from "../../lib/translations";

export default function FieldSetupPage() {
  const router = useRouter();
  
  // District & Town state
  const [district, setDistrict] = useState<string>("Thanjavur");
  const [town, setTown] = useState<string>("Orathanadu");
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  
  // Active District coordinates
  const activeDistrictInfo = TAMIL_NADU_DISTRICTS[district] || TAMIL_NADU_DISTRICTS["Thanjavur"];
  const [mapCenter, setMapCenter] = useState<[number, number]>([activeDistrictInfo.lat, activeDistrictInfo.lon]);

  // Polygon & Geometry State from SatelliteFieldMap
  const [fieldCoords, setFieldCoords] = useState<[number, number][]>([]);
  const [fieldAreaAcres, setFieldAreaAcres] = useState<number>(1.5);
  const [fieldCentroid, setFieldCentroid] = useState<[number, number]>([activeDistrictInfo.lat, activeDistrictInfo.lon]);

  // Soil Form state
  const [hasSoilReport, setHasSoilReport] = useState<boolean>(false);
  const [ph, setPh] = useState<string>("6.4");
  const [nitrogen, setNitrogen] = useState<string>("120"); // Deficient for testing
  const [phosphorus, setPhosphorus] = useState<string>("14");
  const [potassium, setPotassium] = useState<string>("160");
  const [zinc, setZinc] = useState<string>("0.5"); // Slightly deficient
  const [iron, setIron] = useState<string>("7.2");
  const [testDate, setTestDate] = useState<string>(
    new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );

  useEffect(() => {
    const savedLang = (localStorage.getItem("sentinel_lang") as SupportedLanguage) || "en";
    setLanguage(savedLang);

    const handleLanguageUpdate = () => {
      const current = (localStorage.getItem("sentinel_lang") as SupportedLanguage) || "en";
      setLanguage(current);
    };

    window.addEventListener("languageChanged", handleLanguageUpdate);
    return () => window.removeEventListener("languageChanged", handleLanguageUpdate);
  }, []);

  // Check if logged in as THILAK (Pre-configure Ponneri)
  useEffect(() => {
    const userStr = localStorage.getItem("sentinel_user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.username === "THILAK") {
          setDistrict("Tiruvallur");
          setTown("Ponneri");
          setMapCenter([13.3330, 80.1980]);
          setHasSoilReport(false);
        }
      } catch (e) {}
    }
  }, []);

  // Sync center when district changes
  useEffect(() => {
    if (activeDistrictInfo) {
      setTown(activeDistrictInfo.towns[0]);
      setMapCenter([activeDistrictInfo.lat, activeDistrictInfo.lon]);
    }
  }, [district]);

  const activeLang: SupportedLanguage = (language === "ta" || language === "hi") ? language : "en";
  const t = TRANSLATIONS[activeLang]?.fieldSetup || TRANSLATIONS.en.fieldSetup;

  // Handle updates from SatelliteFieldMap
  const handlePolygonChange = (coords: [number, number][], areaAcres: number, center: [number, number]) => {
    setFieldCoords(coords);
    setFieldAreaAcres(areaAcres);
    setFieldCentroid(center);
  };

  // Staleness warning check
  const getSoilAgeWarning = () => {
    if (!testDate) return null;
    const diffDays = Math.floor((Date.now() - new Date(testDate).getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > 180) {
      return {
        level: "danger",
        text: `Soil test is ${Math.floor(diffDays/30)} months old (>6 mo). Report is stale; will trigger quality gate caution.`
      };
    } else if (diffDays > 90) {
      return {
        level: "warning",
        text: `Soil test is ${Math.floor(diffDays/30)} months old (>3 mo). Nitrogen value will have lower confidence due to leaching.`
      };
    }
    return null;
  };

  const soilWarning = getSoilAgeWarning();

  const handleSaveField = () => {
    if (fieldCoords.length < 3) {
      alert("Please mark your field parcel on the satellite map.");
      return;
    }

    // Convert [lat, lon] to GeoJSON [lon, lat] format
    const coordinates = fieldCoords.map(pt => [pt[1], pt[0]]);
    // Ensure ring is closed
    if (coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
        coordinates[0][1] !== coordinates[coordinates.length - 1][1]) {
      coordinates.push(coordinates[0]);
    }

    const polygonGeoJSON = {
      type: "Polygon",
      coordinates: [coordinates]
    };

    const soilData: SoilData | null = hasSoilReport ? {
      ph: ph ? parseFloat(ph) : undefined,
      nitrogen: nitrogen ? parseFloat(nitrogen) : undefined,
      phosphorus: phosphorus ? parseFloat(phosphorus) : undefined,
      potassium: potassium ? parseFloat(potassium) : undefined,
      zinc: zinc ? parseFloat(zinc) : undefined,
      iron: iron ? parseFloat(iron) : undefined,
      test_date: testDate
    } : null;

    const fieldProfile = {
      id: `field_${Date.now()}`,
      name: `${town} Paddy Field`,
      district: district,
      town: town,
      centerLat: fieldCentroid[0],
      centerLon: fieldCentroid[1],
      is_validated: activeDistrictInfo.is_validated,
      polygonGeoJSON: polygonGeoJSON,
      soilData: soilData,
      areaAcres: fieldAreaAcres,
      createdAt: new Date().toISOString(),
      isLiveField: true
    };

    localStorage.setItem("sentinel_active_field", JSON.stringify(fieldProfile));
    localStorage.setItem("sentinel_app_mode", "real"); // Set mode to Real Live Monitor
    window.dispatchEvent(new Event("modeChanged"));
    router.push("/dashboard");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Header with Crop Scope Callout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real Google Satellite View • 38 Tamil Nadu Districts</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Select & Mark Your Land</h1>
          <p className="text-slate-600 text-sm mt-1">
            Search your village or use GPS, view real satellite photography, tap to auto-enclose your acreage, and enter your Soil Health Card values.
          </p>
        </div>

        {/* Locked Crop Scope Badge */}
        <div className="shrink-0 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-emerald-900">Crop Scope: Paddy Only (*Oryza sativa*)</div>
            <div className="text-[10px] text-emerald-700">Specialized optical NDVI curves & TNAU disease rules</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Location & Interactive Map (7.5 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* District & Town Presets */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>1. Select Tamil Nadu District & Taluk</span>
              </div>
              {activeDistrictInfo.is_validated && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  ★ Ground Truth Validated
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  District (All 38 Districts)
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {Object.keys(TAMIL_NADU_DISTRICTS).map((d) => (
                    <option key={d} value={d}>
                      {d} {TAMIL_NADU_DISTRICTS[d].is_validated ? "★ (Thanjavur Validated)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Nearby Town / Taluk
                </label>
                <select
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  {activeDistrictInfo.towns.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Real Satellite Map Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
                <Layers className="w-5 h-5 text-emerald-600" />
                <span>2. Real Google Satellite Map — Mark Your Field</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Use the search bar on the map to find your village or GPS location. Then tap on your field to automatically enclose your acreage.
            </p>

            {/* Satellite Map Component */}
            <SatelliteFieldMap
              initialCenter={mapCenter}
              onPolygonChange={handlePolygonChange}
            />
          </div>

        </div>

        {/* Right Column: Soil Data Card (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
              <FlaskConical className="w-5 h-5 text-emerald-600" />
              <span>{t.soilQuestion}</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              {activeLang === "ta" 
                ? "மண் பரிசோதனை அறிக்கை இருந்தால் உள்ளிடலாம், இல்லையெனில் செயற்கைக்கோள் தானாகவே பயிரைக் கண்காணிக்கும்."
                : activeLang === "hi"
                  ? "यदि आपके पास मृदा कार्ड है तो दर्ज करें, अन्यथा उपग्रह स्वचालित रूप से फसल की निगरानी करेगा।"
                  : "Official lab soil test parameters are optional. Sentinel AI continuously observes your crop from orbit."}
            </p>

            {/* Soil Report Choice Switcher */}
            <div className="p-1 bg-slate-100 rounded-xl flex items-center text-xs font-semibold">
              <button
                type="button"
                onClick={() => setHasSoilReport(false)}
                className={`flex-1 py-2 rounded-lg transition-all text-center ${
                  !hasSoilReport 
                    ? "bg-white text-emerald-800 shadow-sm font-bold" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {t.soilOptionSatellite}
              </button>
              <button
                type="button"
                onClick={() => setHasSoilReport(true)}
                className={`flex-1 py-2 rounded-lg transition-all text-center ${
                  hasSoilReport 
                    ? "bg-white text-emerald-800 shadow-sm font-bold" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {t.soilOptionCard}
              </button>
            </div>

            {!hasSoilReport ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2">
                <div className="font-bold text-sm text-emerald-900 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t.satelliteActiveTitle}</span>
                </div>
                <p className="text-emerald-800 leading-relaxed text-[11px]">
                  {t.satelliteActiveDesc}
                </p>
                <p className="text-[10px] text-emerald-700 font-medium">
                  {t.satelliteActiveNote}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Test Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lab Test Date
                  </label>
                  <input
                    type="date"
                    value={testDate}
                    onChange={(e) => setTestDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Staleness Banner */}
                {soilWarning && (
                  <div className={`p-3 rounded-lg text-xs flex items-start space-x-2 ${
                    soilWarning.level === "danger" 
                      ? "bg-rose-50 border border-rose-200 text-rose-800" 
                      : "bg-amber-50 border border-amber-200 text-amber-800"
                  }`}>
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{soilWarning.text}</span>
                  </div>
                )}

                {/* Parameters Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Soil pH (6.0 - 7.5)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={ph}
                      onChange={(e) => setPh(e.target.value)}
                      placeholder="e.g. 6.5"
                      className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nitrogen N (&gt;140 kg/ha)
                    </label>
                    <input
                      type="number"
                      value={nitrogen}
                      onChange={(e) => setNitrogen(e.target.value)}
                      placeholder="e.g. 150"
                      className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Phosphorus P (&gt;11)
                    </label>
                    <input
                      type="number"
                      value={phosphorus}
                      onChange={(e) => setPhosphorus(e.target.value)}
                      placeholder="e.g. 16"
                      className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Potassium K (&gt;115)
                    </label>
                    <input
                      type="number"
                      value={potassium}
                      onChange={(e) => setPotassium(e.target.value)}
                      placeholder="e.g. 180"
                      className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Zinc Zn (&gt;0.6 ppm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={zinc}
                      onChange={(e) => setZinc(e.target.value)}
                      placeholder="e.g. 1.2"
                      className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Iron Fe (&gt;4.5 ppm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={iron}
                      onChange={(e) => setIron(e.target.value)}
                      placeholder="e.g. 8.0"
                      className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Save & Run Button */}
            <div className="pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleSaveField}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-200 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
              >
                <Save className="w-4 h-4" />
                <span>Save Field & Activate Satellite Monitor</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
