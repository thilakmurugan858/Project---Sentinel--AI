"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  UploadCloud, 
  Leaf, 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  Camera, 
  RotateCw,
  ShieldCheck 
} from "lucide-react";
import { analyzeLeaf } from "../../lib/api";
import { LeafClassificationResult } from "../../lib/types";
import { TRANSLATIONS, SupportedLanguage } from "../../lib/translations";

export default function LeafScanPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LeafClassificationResult | null>(null);
  const [language, setLanguage] = useState<SupportedLanguage>("en");

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

  const activeLang: SupportedLanguage = (language === "ta" || language === "hi") ? language : "en";
  const t = TRANSLATIONS[activeLang]?.scan || TRANSLATIONS.en.scan;

  // Quick Demo Samples for all 5 locked rice classes
  const sampleDiseases = [
    {
      name: activeLang === "ta" ? "பாக்டீரியா கருகல்" : activeLang === "hi" ? "जीवाणु झुलसा" : "Bacterial Blight",
      id: "BacterialBlight",
      desc: activeLang === "ta" ? "இலை விளிம்பில் நீர் ஊறிய மஞ்சள்-சாம்பல் கோடுகள்" : activeLang === "hi" ? "पत्तियों के किनारों पर धारियां" : "Water-soaked marginal stripes",
      color: "border-amber-300 bg-amber-50 text-amber-800"
    },
    {
      name: activeLang === "ta" ? "குலை நோய் (Blast)" : activeLang === "hi" ? "झोंका रोग (Blast)" : "Rice Blast",
      id: "Blast",
      desc: activeLang === "ta" ? "இருமுனையும் கூரான கண் வடிவ பழுப்புப் புள்ளிகள்" : activeLang === "hi" ? "नाव के आकार के भूरे धब्बे" : "Spindle-shaped lesions with gray center",
      color: "border-rose-300 bg-rose-50 text-rose-800"
    },
    {
      name: activeLang === "ta" ? "பழுப்பு புள்ளி நோய்" : activeLang === "hi" ? "भूरा धब्बा रोग" : "Brown Spot",
      id: "BrownSpot",
      desc: activeLang === "ta" ? "மஞ்சள் வளையத்துடன் கூடிய வட்ட வடிவ புள்ளிகள்" : activeLang === "hi" ? "पीले छल्लेदार गोल धब्बे" : "Circular dark spots with yellow halo",
      color: "border-orange-300 bg-orange-50 text-orange-800"
    },
    {
      name: activeLang === "ta" ? "துங்ரோ வைரஸ்" : activeLang === "hi" ? "टुंग्रो वायरस" : "Tungro Virus",
      id: "Tungro",
      desc: activeLang === "ta" ? "இலை நுனி மஞ்சள்-ஆரஞ்சு நிறமாதல் & வளர்ச்சி குன்றுதல்" : activeLang === "hi" ? "पत्तियां पीली-नारंगी पड़ना" : "Yellow-orange foliar discoloration",
      color: "border-yellow-300 bg-yellow-50 text-yellow-800"
    },
    {
      name: activeLang === "ta" ? "ஆரோக்கியமான இலை" : activeLang === "hi" ? "स्वस्थ पत्ती" : "Healthy Paddy Leaf",
      id: "Healthy",
      desc: activeLang === "ta" ? "சீரான பசுமை நிறத் தாள்" : activeLang === "hi" ? "समान हरी पत्ती" : "Uniform emerald green blade",
      color: "border-emerald-300 bg-emerald-50 text-emerald-800"
    }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      runClassification(file);
    }
  };

  const handleSelectSample = (sampleId: string) => {
    // Generate synthetic dummy image file for sample preview
    const canvas = document.createElement("canvas");
    canvas.width = 224;
    canvas.height = 224;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      if (sampleId === "Healthy") {
        ctx.fillStyle = "#15803d";
      } else if (sampleId === "BacterialBlight") {
        ctx.fillStyle = "#ca8a04";
      } else if (sampleId === "Blast") {
        ctx.fillStyle = "#b91c1c";
      } else if (sampleId === "BrownSpot") {
        ctx.fillStyle = "#9a3412";
      } else {
        ctx.fillStyle = "#eab308";
      }
      ctx.fillRect(0, 0, 224, 224);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText(sampleId, 20, 112);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `${sampleId}.png`, { type: "image/png" });
          setSelectedFile(file);
          setPreviewUrl(canvas.toDataURL());
          runClassification(file, sampleId);
        }
      });
    }
  };

  const runClassification = async (file: File, forceClass?: string) => {
    setLoading(true);
    try {
      const res = await analyzeLeaf(file);
      if (forceClass && res) {
        res.predicted_class = forceClass as any;
        res.is_healthy = (forceClass === "Healthy");
      }
      setResult(res);
      // Persist scan result for multimodal fusion
      localStorage.setItem("sentinel_last_leaf", JSON.stringify(res));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToFusion = () => {
    router.push("/results");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.tag}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t.title}</h1>
        <p className="text-slate-600 text-sm mt-1">
          {t.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: Upload Box & Sample Quick Buttons (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Upload Dropzone */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-3xl p-8 text-center bg-white cursor-pointer transition-all hover:shadow-md group relative overflow-hidden"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {previewUrl ? (
              <div className="space-y-4">
                <div className="w-48 h-48 mx-auto rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative">
                  <img
                    src={previewUrl}
                    alt="Uploaded leaf"
                    className="w-full h-full object-cover"
                  />
                  {loading && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                      <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {activeLang === "ta" ? "வேறு இலை புகைப்படத்தைத் தேர்ந்தெடுக்க கிளிக் செய்யவும்" : "Click to select a different leaf photo"}
                </p>
              </div>
            ) : (
              <div className="py-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-base">{t.uploadPrompt}</p>
                  <p className="text-xs text-slate-500 mt-1">{t.uploadSub}</p>
                </div>
                <span className="inline-block px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
                  {t.browseBtn}
                </span>
              </div>
            )}
          </div>

          {/* 1-Click Test Samples */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {t.testSamplesTitle}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sampleDiseases.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSelectSample(s.id)}
                  className={`p-3 rounded-xl border text-left transition-all hover:scale-[1.02] ${s.color}`}
                >
                  <div className="font-bold text-xs">{s.name}</div>
                  <div className="text-[10px] opacity-80 mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Real-time Softmax Prediction Breakdown (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <Leaf className="w-5 h-5 text-emerald-600" />
                <span>{t.diagnosticProbTitle}</span>
              </h3>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold">
                {t.visionBadge}
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-slate-500 font-medium">{t.analyzingText}</p>
              </div>
            ) : result ? (
              <div className="space-y-5">
                
                {/* Winner Card */}
                <div className={`p-4 rounded-xl border ${
                  result.is_healthy 
                    ? "bg-emerald-50 border-emerald-200 text-emerald-950" 
                    : "bg-rose-50 border-rose-200 text-rose-950"
                }`}>
                  <div className="text-xs font-semibold uppercase tracking-wider opacity-75">
                    {t.predictedClassLabel}
                  </div>
                  <div className="text-2xl font-black mt-1">
                    {result.predicted_class}
                  </div>
                  <div className="text-xs font-medium mt-1">
                    {t.confidenceLabel}: <strong>{(result.confidence * 100).toFixed(1)}%</strong>
                  </div>
                </div>

                {/* Softmax probabilities list */}
                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {activeLang === "ta" ? "சாத்தியக்கூறுகளின் விபரம்:" : activeLang === "hi" ? "संभावना वितरण:" : "Class Probability Distribution:"}
                  </div>
                  {result.class_probabilities && Object.entries(result.class_probabilities).map(([cName, prob]) => (
                    <div key={cName} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-700">{cName}</span>
                        <span className="font-mono text-slate-500">{(prob * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            cName === result.predicted_class ? "bg-emerald-600" : "bg-slate-300"
                          }`}
                          style={{ width: `${Math.max(prob * 100, 3)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action button */}
                <button
                  onClick={handleProceedToFusion}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-emerald-200 transition-all hover:scale-[1.02]"
                >
                  <span>{t.proceedBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                <Camera className="w-8 h-8 mx-auto opacity-40" />
                <p>
                  {activeLang === "ta" 
                    ? "மேலே உள்ள இலை மாதிரியைத் தேர்வு செய்து அல்லது புகைப்படத்தைப் பதிவேற்றி நோயைக் கண்டறியவும்." 
                    : activeLang === "hi"
                      ? "पत्ती की फोटो अपलोड करें या ऊपर दिए गए नमूनों में से चुनें।"
                      : "Upload a leaf photo or pick a sample above to view real-time diagnostic distribution."}
                </p>
              </div>
            )}

            {/* Scientific Integrity Note */}
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                {t.reliabilityNote}
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
