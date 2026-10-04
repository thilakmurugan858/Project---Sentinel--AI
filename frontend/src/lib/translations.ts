// Comprehensive Multilingual Translation Dictionary (English, Tamil, Hindi)
// Grounded in official Tamil Nadu Agricultural University (TNAU) and ICAR protocols.

export type SupportedLanguage = "en" | "ta" | "hi";

export interface HighValueRemedy {
  step: string;
  detail: string;
  timing: string;
  category: "chemical" | "organic" | "cultural" | "nutrient";
}

export interface DiseaseRemedySet {
  name: string;
  causal_agent: string;
  primary_cause: string;
  remedies: HighValueRemedy[];
}

export const TRANSLATIONS: Record<SupportedLanguage, any> = {
  en: {
    nav: {
      brand: "SENTINEL",
      brandSub: "Paddy Crop Intelligence • TN",
      home: "Home",
      selectLand: "Select Land",
      dashboard: "Satellite Dashboard",
      scan: "Leaf Scan",
      results: "Advisory & Remedy",
      history: "History",
      liveField: "🌾 Live Field",
      demoMode: "🚀 Demo Mode",
      switch: "(switch)",
      apiLive: "API Live",
      localMode: "Local Mode"
    },
    entrance: {
      tag: "Paddy Intelligence Platform • Tamil Nadu",
      question: "How would you like to enter Sentinel AI?",
      subtext: "Choose between entering your own real farmland or exploring the complete Thanjavur benchmark demo. Both paths are live on this website.",
      thilakTitle: "Sign in as THILAK (Pre-Built Farmer)",
      thilakSub: "Ponneri Land • Continuous satellite monitoring (NDVI & SAR) active • No soil test needed",
      thilakBadge: "Ponneri Land",
      thilakAction: "Enter Field",
      realTitle: "🌾 Real Farmland Monitor",
      realDesc: "Search your village or use GPS, mark your field on the Google Satellite view, and connect your Soil Health Card.",
      realAction: "Select My Land",
      demoTitle: "🚀 Complete Interactive Demo",
      demoDesc: "Pre-loaded Thanjavur field with a simulated satellite stress anomaly, defect leaf scan, ICAR cure & Tamil audio read-aloud.",
      demoAction: "Explore Demo & Review",
      footerNote: "You can switch between Live Field and Demo Mode at any time in the top navigation bar."
    },
    fieldSetup: {
      tag: "Farmland GPS & Satellite Parcel Setup",
      title: "Select & Register Paddy Land",
      desc: "Locate your farm in Tamil Nadu, draw your parcel boundaries on the satellite map, and monitor crop health continuously from orbit.",
      districtLabel: "District",
      townLabel: "Taluk / Town",
      soilQuestion: "Do you have a Soil Health Card (SHC) test report?",
      soilOptionSatellite: "🌾 Satellite Only (No Soil Test Needed)",
      soilOptionCard: "🧪 I Have Soil Card",
      satelliteActiveTitle: "Continuous Satellite Tracking Active",
      satelliteActiveDesc: "You don't need a soil lab report to protect your crop. Sentinel AI continuously observes your field parcel from space using Sentinel-2 (NDVI), HLS (2.3-day cadence), and Sentinel-1 SAR Radar backscatter.",
      satelliteActiveNote: "✓ Soil test is optional. You can enter soil numbers anytime later.",
      saveButton: "Save Land & Start Satellite Watch"
    },
    scan: {
      tag: "Foliar Disease Scanner • 5 Paddy Diagnoses",
      title: "Leaf Disease AI Scanner",
      desc: "Upload a clear photograph of a rice leaf from your field to instantly check for Bacterial Leaf Blight, Blast, Brown Spot, Tungro, or Healthy crop vigor.",
      uploadPrompt: "Click or drag a leaf photo here",
      uploadSub: "Supports JPEG, PNG taken from smartphone camera",
      browseBtn: "Browse Files",
      testSamplesTitle: "Or Test with 1-Click Benchmark Samples:",
      diagnosticProbTitle: "Diagnostic Probability",
      visionBadge: "Automated Vision",
      analyzingText: "Analyzing leaf symptoms against pathology database...",
      predictedClassLabel: "Predicted Class",
      confidenceLabel: "Confidence Probability",
      proceedBtn: "Proceed to Multimodal Advisory",
      reliabilityNote: "Field-Tested Reliability: Diagnostic classifications are calibrated against official TNAU crop pathology benchmarks."
    },
    results: {
      tag: "Multimodal Diagnostic Verdict & Agronomic Plan",
      title: "Crop Stress Assessment",
      healthyTitle: "Paddy Crop in Healthy Vigor",
      confirmedTitle: "Confirmed",
      confidenceLabel: "Cross-Modal Confidence",
      corroboratingLabel: "Corroborating Inputs:",
      qualityGateTitle: "Multimodal Data Quality Gate",
      satelliteModality: "Satellite",
      soilModality: "Soil Chemistry",
      leafModality: "Leaf Classifier",
      geminiAdvisoryTitle: "Actionable Advisory & Voice Guidance",
      listenVoice: "Listen Voice (Tamil/English)",
      stopVoice: "Stop Audio",
      exportCSV: "Export CSV",
      remediesHeader: "Official Agronomic Action Plan (TNAU / ICAR Certified)",
      remedyWorthNote: "All dosages and protocols are formulated in accordance with the Tamil Nadu Agricultural University Crop Production Guide."
    },
    dashboard: {
      loading: "Processing Copernicus Sentinel-2 band math...",
      demoBadge: "🚀 Benchmark Demo",
      liveBadge: "🌾 Live Land",
      thanjavurBadge: "Thanjavur Validated",
      acres: "Acres",
      scenarioClear: "Clear Sky (Vigorous)",
      scenarioStress: "Satellite Anomaly (Stress)",
      scenarioCloud: "Heavy Cloud Delay",
      overpass: "Sentinel-2 Overpass:",
      today: "Today",
      fieldHealthy: "Field healthy ✅",
      needsAttention: "Needs attention ⚠️",
      healthyDesc: "Autonomous Sentinel-2 satellite scan confirms healthy canopy cover and optimal vegetation indices over your field parcel.",
      hideTech: "Hide technical details",
      viewTech: "View technical details",
      soilTelemetryTitle: "Soil Health Card Telemetry",
      soilTelemetrySub: "Nutrient profile (NPK, Zinc, Iron, pH) for abiotic stress cross-validation",
      updateSoil: "Update Soil Card",
      addSoil: "+ Add Soil Test Report",
      noSoilTitle: "No Soil Test Report Added (Field Monitored via Satellite)",
      optional: "Optional",
      noSoilDesc: "Sentinel AI is watching this land continuously using Copernicus Sentinel-2 optical NDVI and Sentinel-1 SAR Radar. You don't need a lab soil test report to get continuous space monitoring!",
      enterLabBtn: "Enter Lab Report If Available",
      optimal: "Optimal:",
      adequate: "Adequate",
      deficient: "Deficient ⚠️",
      low: "Low ⚠️",
      constellationCardTitle: "Advanced Space-Borne Monitoring Constellation",
      constellationCardSub: "Integrating ESA Sentinel-2, NASA Landsat 8/9 (HLS), and Sentinel-1 SAR Cloud-Penetrating Radar.",
      tabHls: "🚀 HLS Constellation (2.3-Day)",
      tabSar: "📡 Sentinel-1 SAR Radar",
      tabOptical: "🌤️ Orbit & Clouds",
      hlsActiveBadge: "Harmonized Landsat-Sentinel (HLS) Multi-Constellation Active",
      cadenceSlashed: "Revisit Cadence Slashed: 5.0 Days ➔ 2.3 Days Average",
      cadenceDesc: "By interleaving NASA Landsat-8/9 with ESA Sentinel-2A/2B, latency is reduced by 54% for Tamil Nadu paddies!",
      nextOverpass: "Next Overpass",
      nextOverpassVal: "In 2 Days (Landsat 9)",
      liveToday: "Live Today",
      in2Days: "In 2 Days",
      in5Days: "In 5 Days",
      in7Days: "In 7 Days",
      harmonizedReflectance: "Harmonized Surface Reflectance",
      twinConstellation: "Twin Sentinel-2 Constellation",
      thermalMultispectral: "Thermal + Multi-spectral",
      sarTitle: "Sentinel-1 C-Band (5.405 GHz) Synthetic Aperture Radar (SAR)",
      sarBadge: "100% Cloud Penetration • Day & Night",
      sarDesc: "Microwave radar pulses at 5.4 GHz pass completely through thick monsoon clouds, tropical storms, and nighttime darkness. While optical sensors get blinded by clouds, SAR radar measures physical canopy structure and water interaction uninterrupted!",
      rviLabel: "Dual-Pol Radar Veg Index (RVI)",
      rviFormula: "Formula: 4 × VH / (VV + VH). Dense vegetative rice canopy shows strong volume scattering.",
      crLabel: "Cross-Polarization Ratio (CR)",
      crFormula: "Tracks stem elongation and vertical canopy biomass growth in paddy fields.",
      cloudOverrideLabel: "Cloud Override Status",
      activeCloudPiercing: "Active Cloud Piercing 🛰️",
      standingByCloud: "Standing By (Cloud Cover < 20%)",
      cloudOverrideDesc: "When optical Sentinel-2 is obscured by rain clouds, SAR automatically safeguards the crop timeline!",
      orbitCadenceLabel: "Sentinel-2 Orbit Cadence",
      every5Days: "Every 5 Days",
      orbitCadenceDesc: "Sun-synchronous orbit over Tamil Nadu captures B04 (Red), B08 (NIR), and B11 (SWIR) at 10m resolution.",
      cloudContamLabel: "Current Cloud Contamination",
      cloudCoverVal: "% Cloud Cover",
      cloudContamDesc: "Pure-pixel screening refuses to hallucinate when clouds exceed 20%, seamlessly falling back to SAR radar.",
      multiTierLabel: "Multi-Tier Redundancy",
      threeLevelSafe: "3-Level Fail-Safe",
      multiTierDesc: "Tier 1: Optical Sentinel-2 / Landsat ➔ Tier 2: Sentinel-1 SAR Radar ➔ Tier 3: Ground Leaf AI + Soil Card.",
      demoCardBadge: "Full Interactive Review Demo",
      demoCardTitle: "Test Defect Detection & Scientific Cure in 1 Click",
      demoCardDesc: "Demonstrates the complete Sentinel AI workflow: Satellite NDVI drop alerts field stress → prompts a ground leaf camera inspection → isolates Bacterial Leaf Blight → prescribes ICAR/TNAU certified remedies.",
      runDemoBtn: "Run Defect & Cure Demo",
      groundReqTitle: "Ground Confirmation Requested (Soil & Leaf Inspection)",
      groundReqWhy: "Why is this requested?",
      groundReqDesc: "Because satellite imagery showed a canopy anomaly or cloud delay, ground verification is needed to determine if the cause is a foliar disease (Blast, Blight, Brown Spot, Tungro) or abiotic soil nutrient deficiency.",
      uploadLeafBtn: "Upload Leaf Photo",
      updateSoilBtn: "Update Soil Card",
      techDetailsTitle: "Multi-Spectral Remote Sensing & Quality Gate Telemetry",
      meanNdvi: "Mean NDVI",
      ndviFormula: "Vegetation Index (NIR-Red)/(NIR+Red)",
      meanNdwi: "Mean NDWI",
      ndwiFormula: "Canopy Moisture (Gao Index)",
      purePixels: "Pure Pixels (10m)",
      purePixelsSub: "Field interior pure pixels",
      cloudCover: "Cloud Cover",
      cloudCoverSub: "Threshold <20% enforced",
      qualityGateStatus: "Quality Gate Status:",
      evidence: "Evidence",
      qualityGateDefault: "Deterministic quality thresholds satisfied.",
      navFullReport: "Full Diagnosis & Remedy Report",
      navFullReportSub: "View cross-validated Multimodal Fusion & TNAU cure",
      navFieldMap: "Open Satellite Field Map",
      navFieldMapSub: "Search location, adjust boundary, or update soil data"
    }
  },

  ta: {
    nav: {
      brand: "சென்டினல்",
      brandSub: "நெல் பயிர் செயற்கை நுண்ணறிவு • தமிழ்நாடு",
      home: "முகப்பு",
      selectLand: "நிலம் தேர்வு",
      dashboard: "செயற்கைக்கோள் கண்காணிப்பு",
      scan: "இலை பரிசோதனை",
      results: "தீர்வுகள் & பரிந்துரை",
      history: "வரலாறு",
      liveField: "🌾 நேரடி நிலம்",
      demoMode: "🚀 மாதிரி செயல்முறை",
      switch: "(மாற்று)",
      apiLive: "இணைப்பு தயார்",
      localMode: "உள்ளூர் பயன்முறை"
    },
    entrance: {
      tag: "நெல் பயிர் நுண்ணறிவு தளம் • தமிழ்நாடு",
      question: "சென்டினல் ஏஐ தளத்திற்குள் எவ்வாறு நுழைய விரும்புகிறீர்கள்?",
      subtext: "உங்கள் சொந்த விவசாய நிலத்தை செயற்கைக்கோளில் இணைக்கலாம் அல்லது தஞ்சாவூர் மாதிரி செயல்முறையை முழுமையாக ஆராயலாம்.",
      thilakTitle: "திலக் (THILAK) விவசாயியாக நுழைக",
      thilakSub: "பொன்னேரி நிலம் • தொடர் செயற்கைக்கோள் கண்காணிப்பு (NDVI & ரேடார்) தயார் • மண் பரிசோதனை தேவையில்லை",
      thilakBadge: "பொன்னேரி நிலம்",
      thilakAction: "நிலத்திற்குள் செல்க",
      realTitle: "🌾 நேரடி விவசாய நில கண்காணிப்பு",
      realDesc: "உங்கள் கிராமத்தைத் தேடுங்கள் அல்லது GPS பயன்படுத்தி கூகுள் செயற்கைக்கோள் வரைபடத்தில் நிலத்தைக் குறியிட்டு கண்காணிக்கவும்.",
      realAction: "என் நிலத்தைத் தேர்வு செய்",
      demoTitle: "🚀 முழுமையான மாதிரி செயல்முறை",
      demoDesc: "ஏற்கனவே ஏற்றப்பட்ட தஞ்சாவூர் நிலம், செயற்கைக்கோள் பயிர் அழுத்த எச்சரிக்கை, இலை நோய் ஸ்கேன் மற்றும் தமிழ் ஒலி வழிகாட்டல்.",
      demoAction: "மாதிரியைப் பார்வையிடு",
      footerNote: "மேல் உள்ள பட்டியில் எப்போது வேண்டுமானாலும் நேரடி நிலம் மற்றும் மாதிரி பயன்முறையை மாற்றிக் கொள்ளலாம்."
    },
    fieldSetup: {
      tag: "விவசாய நில GPS & செயற்கைக்கோள் பதிவு",
      title: "நெல் நிலத்தைத் தேர்ந்தெடுத்துப் பதிவு செய்க",
      desc: "தமிழ்நாட்டில் உங்கள் பண்ணையை கண்டறிந்து, செயற்கைக்கோள் வரைபடத்தில் எல்லைகளைக் குறித்து, விண்வெளியிலிருந்து தொடர்ச்சியாகப் பாதுகாக்கவும்.",
      districtLabel: "மாவட்டம்",
      townLabel: "வட்டம் / ஊர்",
      soilQuestion: "உங்களிடம் மண் பரிசோதனை அட்டை (SHC) அறிக்கை உள்ளதா?",
      soilOptionSatellite: "🌾 செயற்கைக்கோள் மட்டும் (மண் பரிசோதனை தேவையில்லை)",
      soilOptionCard: "🧪 மண் பரிசோதனை அட்டை உள்ளது",
      satelliteActiveTitle: "தொடர் செயற்கைக்கோள் கண்காணிப்பு செயல்பாட்டில் உள்ளது",
      satelliteActiveDesc: "மண் பரிசோதனை அறிக்கைக்காக நீங்கள் காத்திருக்க வேண்டியதில்லை. சென்டினல் ஏஐ விண்வெளியிலிருந்து சென்டினல்-2 (NDVI), HLS (2.3 நாட்கள் சுழற்சி) மற்றும் சென்டினல்-1 SAR ரேடார் மூலம் உங்கள் வயலை தொடர்ந்து கண்காணிக்கும்.",
      satelliteActiveNote: "✓ மண் பரிசோதனை முற்றிலும் விருப்பத்திற்குரியது. எப்போது வேண்டுமானாலும் பின்னர் சேர்க்கலாம்.",
      saveButton: "நிலத்தைச் சேமித்து செயற்கைக்கோள் கண்காணிப்பைத் தொடங்கு"
    },
    scan: {
      tag: "இலை நோய் கண்டறிதல் • 5 முக்கிய நிலைகள்",
      title: "இலை நோய் ஏஐ ஸ்கேனர்",
      desc: "உங்கள் வயலில் உள்ள நெல் இலையின் தெளிவான புகைப்படத்தைப் பதிவேற்றி பாக்டீரியா இலைக்கருகல், குலை நோய், பழுப்பு புள்ளி, துங்ரோ அல்லது ஆரோக்கியமான பயிர் நிலையை உடனே அறியவும்.",
      uploadPrompt: "இலை புகைப்படத்தை இங்கே கிளிக் செய்து பதிவேற்றவும்",
      uploadSub: "ஸ்மார்ட்போன் கேமரா மூலம் எடுக்கப்பட்ட JPEG, PNG படங்கள்",
      browseBtn: "படத்தைத் தேர்வு செய்",
      testSamplesTitle: "அல்லது 1-கிளிக் மாதிரி இலைகளை சோதிக்கவும்:",
      diagnosticProbTitle: "நோய் கண்டறிதல் சாத்தியக்கூறு",
      visionBadge: "தானியங்கி பார்வை",
      analyzingText: "இலை அறிகுறிகள் தீவிரமாக ஆராயப்படுகின்றன...",
      predictedClassLabel: "கண்டறியப்பட்ட நோய் / நிலை",
      confidenceLabel: "துல்லியத்தன்மை",
      proceedBtn: "பரிந்துரைக்கப்பட்ட தீர்வுகளுக்குச் செல்க",
      reliabilityNote: "களப் பரிசோதனை உறுதிமொழி: தமிழ்நாடு வேளாண்மைப் பல்கலைக்கழக (TNAU) பயிர் பாதுகாப்பு நெறிமுறைகளுடன் ஒப்பிடப்பட்டு துல்லியம் உறுதி செய்யப்பட்டுள்ளது."
    },
    results: {
      tag: "ஒருங்கிணைந்த நோய் கண்டறிதல் & உழவியல் தீர்வுகள்",
      title: "பயிர் அழுத்த பகுப்பாய்வு",
      healthyTitle: "பயிர் மிகுந்த ஆரோக்கியத்துடனும் செழிப்புடனும் உள்ளது",
      confirmedTitle: "உறுதி செய்யப்பட்டுள்ளது",
      confidenceLabel: "ஒருங்கிணைந்த துல்லியம்",
      corroboratingLabel: "உறுதிப்படுத்தப்பட்ட ஆதாரங்கள்:",
      qualityGateTitle: "தரவு சரிபார்ப்பு வாயில் (Data Quality Gate)",
      satelliteModality: "செயற்கைக்கோள்",
      soilModality: "மண் சத்து விவரம்",
      leafModality: "இலை ஸ்கேனர்",
      geminiAdvisoryTitle: "செயல்பாட்டு வழிகாட்டல் & குரல் வழி உரை",
      listenVoice: "குரல் வழிகாட்டலைக் கேள் (தமிழ்)",
      stopVoice: "ஒலியை நிறுத்து",
      exportCSV: "அறிக்கையைப் பதிவிறக்கு (CSV)",
      remediesHeader: "தமிழ்நாடு வேளாண்மைப் பல்கலைக்கழக (TNAU) அதிகாரப்பூர்வ செயல் திட்டம்",
      remedyWorthNote: "கீழே உள்ள மருந்தளவுகள் மற்றும் வழிமுறைகள் தமிழ்நாடு வேளாண்மைப் பல்கலைக்கழகப் பயிர் உற்பத்தி வழிகாட்டியின்படி துல்லியமாகத் தொகுக்கப்பட்டுள்ளன."
    },
    dashboard: {
      loading: "கோப்பர்நிக்கஸ் சென்டினல்-2 செயற்கைக்கோள் தரவுகள் கணக்கிடப்படுகின்றன...",
      demoBadge: "🚀 மாதிரி செயல்முறை",
      liveBadge: "🌾 நேரடி நிலம்",
      thanjavurBadge: "தஞ்சாவூர் சரிபார்க்கப்பட்டது",
      acres: "ஏக்கர்",
      scenarioClear: "தெளிவான வானம் (ஆரோக்கியம்)",
      scenarioStress: "செயற்கைக்கோள் எச்சரிக்கை (அழுத்தம்)",
      scenarioCloud: "அடர்ந்த மேகமூட்டம் தாமதம்",
      overpass: "சென்டினல்-2 கண்காணிப்பு:",
      today: "இன்று",
      fieldHealthy: "பயிர் ஆரோக்கியமாக உள்ளது ✅",
      needsAttention: "கவனம் தேவை ⚠️",
      healthyDesc: "சென்டினல்-2 செயற்கைக்கோள் ஆய்வு உங்கள் பயிர் பசுமையாகவும் வீரியமாகவும் இருப்பதை உறுதி செய்கிறது.",
      hideTech: "தொழில்நுட்ப விவரங்களை மறை",
      viewTech: "தொழில்நுட்ப விவரங்களைக் காட்டு",
      soilTelemetryTitle: "மண் பரிசோதனை அட்டை விவரங்கள்",
      soilTelemetrySub: "மண் சத்துக்கள் (தழை, மணி, சாம்பல் சத்து, துத்தநாகம், இரும்பு, pH) சரிபார்ப்பு",
      updateSoil: "மண் அட்டையை புதுப்பி",
      addSoil: "+ மண் பரிசோதனை அறிக்கை சேர்",
      noSoilTitle: "மண் பரிசோதனை சேர்க்கப்படவில்லை (செயற்கைக்கோள் மூலம் கண்காணிக்கப்படுகிறது)",
      optional: "விருப்பத்திற்குரியது",
      noSoilDesc: "மண் பரிசோதனை அறிக்கை இல்லாவிட்டாலும் சென்டினல்-2 (NDVI) மற்றும் சென்டினல்-1 SAR ரேடார் மூலம் உங்கள் வயலை சென்டினல் ஏஐ விண்வெளியிலிருந்து தொடர்ந்து பாதுகாக்கும்!",
      enterLabBtn: "இருப்பின் மண் அறிக்கையை உள்ளிடவும்",
      optimal: "சரியான அளவு:",
      adequate: "போதுமானது",
      deficient: "பற்றாக்குறை ⚠️",
      low: "குறைவு ⚠️",
      constellationCardTitle: "மேம்பட்ட விண்வெளி செயற்கைக்கோள் கண்காணிப்பு தொகுதி",
      constellationCardSub: "ஐரோப்பிய ESA சென்டினல்-2, நாசா லேண்ட்சாட் 8/9 (HLS), மற்றும் சென்டினல்-1 SAR மேகம் ஊடுருவும் ரேடார் ஒருங்கிணைப்பு.",
      tabHls: "🚀 HLS செயற்கைக்கோள்கள் (2.3 நாட்கள்)",
      tabSar: "📡 சென்டினல்-1 SAR ரேடார்",
      tabOptical: "🌤️ சுழற்சி & மேகமூட்டம்",
      hlsActiveBadge: "ஒருங்கிணைந்த லேண்ட்சாட்-சென்டினல் (HLS) செயற்கைக்கோள் தொகுதி தயார்",
      cadenceSlashed: "கண்காணிப்பு சுழற்சி குறைக்கப்பட்டது: 5.0 நாட்கள் ➔ 2.3 நாட்கள் சராசரி",
      cadenceDesc: "நாசா Landsat-8/9 மற்றும் ஐரோப்பிய Sentinel-2A/2B செயற்கைக்கோள்களை இணைப்பதன் மூலம் தமிழக விவசாயிகளுக்கு 54% வேகத்தில் படங்கள் கிடைக்கின்றன!",
      nextOverpass: "அடுத்த கண்காணிப்பு",
      nextOverpassVal: "2 நாட்களில் (Landsat 9)",
      liveToday: "இன்று நேரலை",
      in2Days: "2 நாட்களில்",
      in5Days: "5 நாட்களில்",
      in7Days: "7 நாட்களில்",
      harmonizedReflectance: "மேற்பரப்பு பிரதிபலிப்பு (10 மீ)",
      twinConstellation: "இரட்டை சென்டினல்-2 செயற்கைக்கோள்",
      thermalMultispectral: "வெப்பவியல் + பல நிறமாலை",
      sarTitle: "சென்டினல்-1 C-Band (5.405 GHz) சிந்தெடிக் அப்பர்ச்சர் ரேடார் (SAR)",
      sarBadge: "100% மேகங்களை ஊடுருவும் • இரவு & பகல்",
      sarDesc: "5.4 GHz மைக்ரோவேவ் ரேடார் அலைகள் பருவமழை மேகங்கள் மற்றும் இருளை முற்றிலும் ஊடுருவுகின்றன. ஆப்டிகல் கேமராக்கள் மேகங்களால் மறையும் போது கூட, SAR ரேடார் பயிர் அமைப்பு மற்றும் ஈரப்பதத்தை தொடர்ந்து அளவிடுகிறது!",
      rviLabel: "இரட்டை-துருவ ரேடார் பயிர் குறியீடு (RVI)",
      rviFormula: "சூத்திரம்: 4 × VH / (VV + VH). அடர்ந்த நெல் பயிர் வலுவான பிரதிபலிப்பைக் காட்டுகிறது.",
      crLabel: "துருவவிகித வளர்ச்சி விகிதம் (CR)",
      crFormula: "நெல் பயிரின் தண்டு வளர்ச்சி மற்றும் பயிர் எடையை துல்லியமாகக் கண்காணிக்கிறது.",
      cloudOverrideLabel: "மேகமூட்ட ஊடுருவல் நிலை",
      activeCloudPiercing: "மேகங்களை ஊடுருவி கண்காணிப்பு செய்கிறது 🛰️",
      standingByCloud: "காத்திருப்பில் (மேகமூட்டம் < 20%)",
      cloudOverrideDesc: "மழை மேகங்கள் சென்டினல்-2 கேமராவை மறைக்கும் போது, SAR ரேடார் தானாகவே பயிர் பாதுகாப்பை உறுதி செய்கிறது!",
      orbitCadenceLabel: "சென்டினல்-2 சுழற்சி காலம்",
      every5Days: "ஒவ்வொரு 5 நாட்களுக்கு ஒருமுறை",
      orbitCadenceDesc: "தமிழ்நாட்டின் மீது சூரிய ஒத்திசைவு சுற்றுப்பாதை மூலம் 10 மீ துல்லியத்தில் படங்களை எடுக்கிறது.",
      cloudContamLabel: "தற்போதைய மேகமூட்டம்",
      cloudCoverVal: "% மேகமூட்டம்",
      cloudContamDesc: "மேகங்கள் 20%க்கு மேல் இருந்தால் தவறான கணிப்புகளைத் தவிர்த்து, தானாகவே SAR ரேடாரைப் பயன்படுத்துகிறது.",
      multiTierLabel: "மும்முனைப் பாதுகாப்பு முறை",
      threeLevelSafe: "3-நிலை பாதுகாப்பு",
      multiTierDesc: "நிலை 1: ஆப்டிகல் செயற்கைக்கோள் ➔ நிலை 2: சென்டினல்-1 SAR ரேடார் ➔ நிலை 3: நிலத்தடி இலை AI + மண் அட்டை.",
      demoCardBadge: "முழுமையான மாதிரி செயல்முறை",
      demoCardTitle: "ஒரே கிளிக்கில் இலை நோய் கண்டறிதல் & அறிவியல் தீர்வுகளை சோதிக்கவும்",
      demoCardDesc: "முழு சென்டினல் ஏஐ செயல்முறை: செயற்கைக்கோள் பயிர் அழுத்தத்தை எச்சரிக்கிறது → கேமரா மூலம் இலை ஆய்வு செய்யப்படுகிறது → பாக்டீரியா இலைக்கருகல் கண்டறியப்படுகிறது → TNAU/ICAR சான்றளிக்கப்பட்ட தீர்வுகள் வழங்கப்படுகின்றன.",
      runDemoBtn: "நோய் & தீர்வு மாதிரியை இயக்கு",
      groundReqTitle: "கள ஆய்வு உறுதிப்படுத்தல் தேவை (மண் & இலை பரிசோதனை)",
      groundReqWhy: "ஏன் இது தேவைப்படுகிறது?",
      groundReqDesc: "செயற்கைக்கோள் படத்தில் பயிர் அழுத்த மாற்றம் அல்லது மேக தாமதம் காணப்படுவதால், இது நோயினால் ஏற்பட்டதா அல்லது மண் சத்து குறைபாடா என்பதை உறுதி செய்ய கள ஆய்வு தேவைப்படுகிறது.",
      uploadLeafBtn: "இலை புகைப்படத்தைப் பதிவேற்று",
      updateSoilBtn: "மண் அட்டையைப் புதுப்பி",
      techDetailsTitle: "செயற்கைக்கோள் தொலை உணர்வு & தரவு சரிபார்ப்பு விவரங்கள்",
      meanNdvi: "சராசரி NDVI குறியீடு",
      ndviFormula: "பயிர் பசுமை குறியீடு (NIR-Red)/(NIR+Red)",
      meanNdwi: "சராசரி NDWI குறியீடு",
      ndwiFormula: "பயிர் ஈரப்பதம் (Gao குறியீடு)",
      purePixels: "தெளிவான பிக்சல்கள் (10 மீ)",
      purePixelsSub: "வயலின் தெளிவான உள்கட்டமைப்பு புள்ளிகள்",
      cloudCover: "மேகமூட்டம்",
      cloudCoverSub: "அனுமதிக்கப்பட்ட அளவு <20%",
      qualityGateStatus: "தரவு சரிபார்ப்பு வாயில் நிலை:",
      evidence: "ஆதாரம்",
      qualityGateDefault: "அனைத்து தர நிர்ணய சோதனைகளும் திருப்திகரமாக உள்ளன.",
      navFullReport: "முழுமையான நோய் கண்டறிதல் & தீர்வு அறிக்கை",
      navFullReportSub: "ஒருங்கிணைந்த பகுப்பாய்வு & TNAU பரிந்துரைகளைக் காண்க",
      navFieldMap: "செயற்கைக்கோள் வரைபடத்தைத் திறக்க",
      navFieldMapSub: "இடத்தைத் தேட, எல்லைகளை மாற்ற அல்லது மண் விவரங்களைப் புதுப்பிக்க"
    }
  },

  hi: {
    nav: {
      brand: "सेंटिनल",
      brandSub: "धान फसल निगरानी मंच • तमिलनाडु",
      home: "होम",
      selectLand: "खेत चुनें",
      dashboard: "उपग्रह डैशबोर्ड",
      scan: "पत्ती स्कैन",
      results: "सलाह और उपचार",
      history: "इतिहास",
      liveField: "🌾 वास्तविक खेत",
      demoMode: "🚀 डेमो मोड",
      switch: "(बदलें)",
      apiLive: "एपीआई लाइव",
      localMode: "लोकल मोड"
    },
    entrance: {
      tag: "धान फसल निगरानी प्लेटफॉर्म • तमिलनाडु",
      question: "आप सेंटिनल एआई में कैसे प्रवेश करना चाहते हैं?",
      subtext: "अपने वास्तविक खेत की उपग्रह से निगरानी करें या तंजावुर मॉडल डेमो का अन्वेषण करें। दोनों विकल्प उपलब्ध हैं।",
      thilakTitle: "तिलक (THILAK) किसान के रूप में प्रवेश करें",
      thilakSub: "पोन्नेरी खेत • निरंतर उपग्रह निगरानी (NDVI और रडार) सक्रिय • मृदा परीक्षण की आवश्यकता नहीं",
      thilakBadge: "पोन्नेरी खेत",
      thilakAction: "खेत में प्रवेश करें",
      realTitle: "🌾 वास्तविक खेत की निगरानी",
      realDesc: "गूगल सैटेलाइट मैप पर अपने खेत की सीमाओं को चिह्नित करें और उपग्रह से 24/7 निगरानी शुरू करें।",
      realAction: "मेरा खेत चुनें",
      demoTitle: "🚀 संपूर्ण इंटरएक्टिव डेमो",
      demoDesc: "तंजावुर खेत का प्री-लोडेड डेमो, उपग्रह तनाव चेतावनी, पत्ती रोग जांच और टीएनएयू प्रमाणित उपचार।",
      demoAction: "डेमो देखें",
      footerNote: "आप शीर्ष नेविगेशन बार में किसी भी समय वास्तविक खेत और डेमो मोड के बीच स्विच कर सकते हैं।"
    },
    fieldSetup: {
      tag: "खेत जीपीएस और उपग्रह सेटअप",
      title: "धान के खेत का चयन और पंजीकरण करें",
      desc: "तमिलनाडु में अपने खेत का पता लगाएं, उपग्रह मानचित्र पर सीमाओं को चिह्नित करें और अंतरिक्ष से निरंतर फसल सुरक्षा प्राप्त करें।",
      districtLabel: "जिला",
      townLabel: "तालुका / कस्बा",
      soilQuestion: "क्या आपके पास मृदा स्वास्थ्य कार्ड (SHC) परीक्षण रिपोर्ट है?",
      soilOptionSatellite: "🌾 केवल उपग्रह (मृदा परीक्षण की आवश्यकता नहीं)",
      soilOptionCard: "🧪 मेरे पास मृदा कार्ड है",
      satelliteActiveTitle: "निरंतर उपग्रह ट्रैकिंग सक्रिय है",
      satelliteActiveDesc: "आपको मृदा परीक्षण रिपोर्ट का इंतजार करने की आवश्यकता नहीं है। सेंटिनल एआई अंतरिक्ष से सेंटिनल-2 (NDVI), HLS (2.3 दिन चक्र) और सेंटिनल-1 एसएआर रडार द्वारा आपके खेत की निरंतर निगरानी करता है।",
      satelliteActiveNote: "✓ मृदा रिपोर्ट पूरी तरह से वैकल्पिक है। आप इसे बाद में कभी भी जोड़ सकते हैं।",
      saveButton: "खेत सहेजें और उपग्रह निगरानी शुरू करें"
    },
    scan: {
      tag: "पत्ती रोग पहचान • 5 मुख्य स्थितियां",
      title: "पत्ती रोग एआई स्कैनर",
      desc: "बैक्टीरियल ब्लाइट, ब्लास्ट, ब्राउन स्पॉट, टुंग्रो या स्वस्थ फसल की तुरंत पहचान के लिए अपने धान की पत्ती का फोटो अपलोड करें।",
      uploadPrompt: "पत्ती की फोटो यहां क्लिक करके अपलोड करें",
      uploadSub: "स्मार्टफोन कैमरे से ली गई जेपीईजी या पीएनजी फोटो",
      browseBtn: "फाइल चुनें",
      testSamplesTitle: "या 1-क्लिक परीक्षण नमूनों से जांचें:",
      diagnosticProbTitle: "रोग पहचान संभावना",
      visionBadge: "स्वचालित विजन",
      analyzingText: "पत्ती के लक्षणों का विश्लेषण किया जा रहा है...",
      predictedClassLabel: "पहचाना गया रोग / स्थिति",
      confidenceLabel: "सटीकता प्रतिशत",
      proceedBtn: "प्रमाणित उपचार की ओर बढ़ें",
      reliabilityNote: "क्षेत्र-परीक्षित विश्वसनीयता: निदान परिणाम तमिलनाडु कृषि विश्वविद्यालय (TNAU) के मानकों के अनुरूप हैं।"
    },
    results: {
      tag: "समेकित निदान और कृषि सलाह",
      title: "फसल तनाव मूल्यांकन",
      healthyTitle: "धान की फसल पूर्णतः स्वस्थ और हरी-भरी है",
      confirmedTitle: "की पुष्टि हुई",
      confidenceLabel: "समेकित सटीकता",
      corroboratingLabel: "समर्थक साक्ष्य:",
      qualityGateTitle: "डेटा गुणवत्ता द्वार (Quality Gate)",
      satelliteModality: "उपग्रह",
      soilModality: "मृदा रसायन",
      leafModality: "पत्ती स्कैनर",
      geminiAdvisoryTitle: "कार्रवाई योग्य सलाह और ध्वनि मार्गदर्शन",
      listenVoice: "आवाज में सुनें (हिंदी)",
      stopVoice: "ऑडियो रोकें",
      exportCSV: "सीएसवी रिपोर्ट डाउनलोड करें",
      remediesHeader: "तमिलनाडु कृषि विश्वविद्यालय (TNAU / ICAR) आधिकारिक कार्य योजना",
      remedyWorthNote: "सभी दवाइयां और मात्राएं टीएनएयू फसल उत्पादन गाइड के अनुसार सटीक रूप से तैयार की गई हैं।"
    },
    dashboard: {
      loading: "कोपरनिकस सेंटिनल-2 उपग्रह डेटा संसाधित हो रहा है...",
      demoBadge: "🚀 बेंचमार्क डेमो",
      liveBadge: "🌾 वास्तविक खेत",
      thanjavurBadge: "तंजावुर सत्यापित",
      acres: "एकड़",
      scenarioClear: "साफ आसमान (स्वस्थ)",
      scenarioStress: "उपग्रह विसंगति (तनाव)",
      scenarioCloud: "घने बादल की देरी",
      overpass: "सेंटिनल-2 उपग्रह निगरानी:",
      today: "आज",
      fieldHealthy: "खेत स्वस्थ है ✅",
      needsAttention: "ध्यान देने योग्य ⚠️",
      healthyDesc: "सेंटिनल-2 उपग्रह स्कैन आपके खेत में स्वस्थ फसल आवरण और इष्टतम वनस्पति सूचकांक की पुष्टि करता है।",
      hideTech: "तकनीकी विवरण छिपाएं",
      viewTech: "तकनीकी विवरण देखें",
      soilTelemetryTitle: "मृदा स्वास्थ्य कार्ड टेलीमेट्री",
      soilTelemetrySub: "तनाव सत्यापन के लिए पोषक तत्व प्रोफाइल (NPK, जिंक, आयरन, pH)",
      updateSoil: "मृदा कार्ड अपडेट करें",
      addSoil: "+ मृदा परीक्षण रिपोर्ट जोड़ें",
      noSoilTitle: "कोई मृदा रिपोर्ट नहीं जोड़ी गई (उपग्रह द्वारा निगरानी जारी)",
      optional: "वैकल्पिक",
      noSoilDesc: "सेंटिनल एआई सेंटिनल-2 (NDVI) और सेंटिनल-1 SAR रडार का उपयोग करके इस भूमि की निरंतर निगरानी कर रहा है। अंतरिक्ष निगरानी के लिए लैब रिपोर्ट आवश्यक नहीं है!",
      enterLabBtn: "यदि उपलब्ध हो तो लैब रिपोर्ट दर्ज करें",
      optimal: "इष्टतम:",
      adequate: "पर्याप्त",
      deficient: "कमी ⚠️",
      low: "कम ⚠️",
      constellationCardTitle: "उन्नत अंतरिक्ष-आधारित निगरानी उपग्रह समूह",
      constellationCardSub: "ईएसए सेंटिनल-2, नासा लैंडसैट 8/9 (HLS), और बादलों को भेदने वाले सेंटिनल-1 SAR रडार का एकीकरण।",
      tabHls: "🚀 HLS उपग्रह समूह (2.3 दिन)",
      tabSar: "📡 सेंटिनल-1 SAR रडार",
      tabOptical: "🌤️ कक्षा और बादल",
      hlsActiveBadge: "हार्मोनाइज्ड लैंडसैट-सेंटिनल (HLS) मल्टी-कॉन्स्टेलेशन सक्रिय",
      cadenceSlashed: "निगरानी चक्र घटाया गया: 5.0 दिन ➔ 2.3 दिन औसत",
      cadenceDesc: "नासा लैंडसैट-8/9 और ईएसए सेंटिनल-2A/2B को मिलाकर, तमिलनाडु के धान के खेतों के लिए अंतराल 54% तक कम हो गया है!",
      nextOverpass: "अगली निगरानी",
      nextOverpassVal: "2 दिनों में (लैंडसैट 9)",
      liveToday: "आज लाइव",
      in2Days: "2 दिनों में",
      in5Days: "5 दिनों में",
      in7Days: "7 दिनों में",
      harmonizedReflectance: "हार्मोनाइज्ड सतही परावर्तन (10 मी)",
      twinConstellation: "ट्विन सेंटिनल-2 उपग्रह समूह",
      thermalMultispectral: "थर्मल + मल्टी-स्पेक्ट्रल",
      sarTitle: "सेंटिनल-1 C-Band (5.405 GHz) सिंथेटिक एपर्चर रडार (SAR)",
      sarBadge: "100% बादल भेदन • दिन और रात",
      sarDesc: "5.4 GHz माइक्रोवेव रडार तरंगें मानसूनी बादलों, तूफानों और रात के अंधेरे को पूरी तरह से पार कर जाती हैं। बादलों के दौरान भी SAR रडार फसल की संरचना और पानी को मापता रहता है!",
      rviLabel: "दोहरी-ध्रुवीकरण रडार वनस्पति सूचकांक (RVI)",
      rviFormula: "सूत्र: 4 × VH / (VV + VH)। घनी धान फसल मजबूत वॉल्यूम स्कैटरिंग दर्शाती है।",
      crLabel: "क्रॉस-ध्रुवीकरण अनुपात (CR)",
      crFormula: "धान के खेतों में तने के विकास और बायोमास वृद्धि को ट्रैक करता है।",
      cloudOverrideLabel: "बादल सुरक्षा स्थिति",
      activeCloudPiercing: "सक्रिय बादल भेदन 🛰️",
      standingByCloud: "स्टैंडबाय पर (बादल आवरण < 20%)",
      cloudOverrideDesc: "जब ऑप्टिकल सेंटिनल-2 बादलों से ढक जाता है, तो SAR स्वतः फसल सुरक्षा सुनिश्चित करता है!",
      orbitCadenceLabel: "सेंटिनल-2 कक्षा चक्र",
      every5Days: "प्रत्येक 5 दिन",
      orbitCadenceDesc: "तमिलनाडु के ऊपर 10 मीटर रिज़ॉल्यूशन पर B04 (Red), B08 (NIR) और B11 (SWIR) कैप्चर करता है।",
      cloudContamLabel: "वर्तमान बादल संदूषण",
      cloudCoverVal: "% बादल आवरण",
      cloudContamDesc: "20% से अधिक बादल होने पर भ्रम से बचने के लिए सीधे SAR रडार पर स्विच करता है।",
      multiTierLabel: "बहु-स्तरीय सुरक्षा प्रणाली",
      threeLevelSafe: "3-स्तरीय सुरक्षा",
      multiTierDesc: "स्तर 1: ऑप्टिकल उपग्रह ➔ स्तर 2: सेंटिनल-1 SAR रडार ➔ स्तर 3: पत्ती एआई + मृदा कार्ड।",
      demoCardBadge: "पूर्ण इंटरएक्टिव रिव्यू डेमो",
      demoCardTitle: "1-क्लिक में रोग पहचान और वैज्ञानिक उपचार का परीक्षण करें",
      demoCardDesc: "संपूर्ण सेंटिनल एआई कार्यप्रवाह: उपग्रह तनाव अलर्ट → पत्ती कैमरा निरीक्षण → बैक्टीरियल लीफ ब्लाइट की पहचान → टीएनएयू/आईसीएआर प्रमाणित उपचार।",
      runDemoBtn: "रोग और उपचार डेमो चलाएं",
      groundReqTitle: "जमीनी पुष्टि का अनुरोध (मृदा एवं पत्ती निरीक्षण)",
      groundReqWhy: "यह अनुरोध क्यों किया गया है?",
      groundReqDesc: "उपग्रह छवि में तनाव या बादलों के कारण, यह जांचने के लिए जमीनी सत्यापन आवश्यक है कि कारण पत्ती का रोग है या मिट्टी में पोषक तत्वों की कमी।",
      uploadLeafBtn: "पत्ती की फोटो अपलोड करें",
      updateSoilBtn: "मृदा कार्ड अपडेट करें",
      techDetailsTitle: "मल्टी-स्पेक्ट्रल रिमोट सेंसिंग और डेटा गुणवत्ता टेलीमेट्री",
      meanNdvi: "औसत NDVI सूचकांक",
      ndviFormula: "वनस्पति सूचकांक (NIR-Red)/(NIR+Red)",
      meanNdwi: "औसत NDWI सूचकांक",
      ndwiFormula: "फसल नमी सूचकांक (गाओ इंडेक्स)",
      purePixels: "शुद्ध पिक्सल (10 मी)",
      purePixelsSub: "खेत के आंतरिक शुद्ध पिक्सल",
      cloudCover: "बादल आवरण",
      cloudCoverSub: "निर्धारित सीमा <20%",
      qualityGateStatus: "डेटा गुणवत्ता द्वार स्थिति:",
      evidence: "साक्ष्य",
      qualityGateDefault: "सभी गुणवत्ता मानक संतुष्ट हैं।",
      navFullReport: "पूर्ण निदान और उपचार रिपोर्ट",
      navFullReportSub: "समेकित विश्लेषण और टीएनएयू प्रमाणित उपचार देखें",
      navFieldMap: "उपग्रह खेत मानचित्र खोलें",
      navFieldMapSub: "स्थान खोजें, सीमाएं बदलें, या मृदा डेटा अपडेट करें"
    }
  }
};

// ============================================================================
// HIGH-VALUE, ACTIONABLE AGRONOMIC REMEDIES (Worth Taking Action On!)
// Formulated from TNAU Crop Production Guide & ICAR Rice Protection Manual
// ============================================================================
export const HIGH_VALUE_REMEDIES: Record<string, Record<SupportedLanguage, DiseaseRemedySet>> = {
  BacterialBlight: {
    en: {
      name: "Bacterial Leaf Blight (BLB)",
      causal_agent: "Xanthomonas oryzae pv. oryzae",
      primary_cause: "Bacterial pathogen entering through leaf hydathodes and wind-inflicted wounds during high humidity and standing water.",
      remedies: [
        {
          step: "Immediate Field Drainage (48–72 Hours)",
          detail: "Drain all standing water from the field completely for 2 to 3 days to break the humid bacterial film spreading between tillers. Let the soil hairline-crack before re-irrigating shallowly.",
          timing: "Immediate (Day 1)",
          category: "cultural"
        },
        {
          step: "Strict Nitrogen Fertilizer Suspension",
          detail: "Immediately stop top-dressing Urea, DAP, or chemical Nitrogen. High vegetative nitrogen softens plant leaf tissues and accelerates bacterial multiplication by 400%.",
          timing: "Immediate",
          category: "nutrient"
        },
        {
          step: "Targeted Bactericide / Antibiotic Spray",
          detail: "Dissolve and spray Streptocycline 100 mg/L (1.5 g in 15 L knapsack sprayer) combined with Copper Oxychloride 50% WP @ 2.5 g/L (37.5 g in 15 L). Apply 200 L spray fluid per acre in late afternoon.",
          timing: "Day 2 & repeated on Day 10",
          category: "chemical"
        },
        {
          step: "Organic Alternative (Fresh Cow Dung Slurry)",
          detail: "Filter 20% fresh cow dung slurry (20 kg fresh dung mixed in 100 L water, strained through muslin cloth) and spray thoroughly. Natural bacteriophages in fresh dung suppress Xanthomonas bacterial ooze effectively.",
          timing: "Alternative to chemicals",
          category: "organic"
        }
      ]
    },
    ta: {
      name: "பாக்டீரியா இலைக்கருகல் நோய் (Bacterial Leaf Blight)",
      causal_agent: "சாந்தோமோனாஸ் ஒரைசே (Xanthomonas oryzae)",
      primary_cause: "வயலில் தேங்கிய நீர் மற்றும் அதிக காற்றில் இலைகளில் ஏற்படும் உராய்வு காயங்கள் வழியாக பாக்டீரியா கிருமிகள் இலை நரம்புகளுக்குள் புகுந்து கருகலை ஏற்படுத்துகின்றன.",
      remedies: [
        {
          step: "வயலில் தேங்கிய தண்ணீரை உடனே வடித்தல் (48 முதல் 72 மணி நேரம்)",
          detail: "வயலில் உள்ள தேங்கிய தண்ணீரை உடனடியாக 2 முதல் 3 நாட்களுக்கு முழுமையாக வடித்து விடவும். நிலத்தின் மேல்பரப்பில் லேசான வெடிப்பு ஏற்படும் வரை உலர விடுவதன் மூலம் பாக்டீரியா பரவுவது உடனடியாகத் தடுக்கப்படும்.",
          timing: "உடனடியாக (முதல் நாள்)",
          category: "cultural"
        },
        {
          step: "யூரியா / தழைச்சத்து உரங்களை உடனடியாக நிறுத்துதல்",
          detail: "யூரியா போன்ற தழைச்சத்து உரங்களை இடுவதை உடனடியாக முற்றிலும் நிறுத்தவும். அதிக தழைச்சத்து பாக்டீரியா கிருமிகள் வேகமாகப் பெருகி இலைகள் முழுமையாகக் கருக வழிவகுக்கும்.",
          timing: "உடனடி நடவடிக்கை",
          category: "nutrient"
        },
        {
          step: "பரிந்துரைக்கப்பட்ட பாக்டீரியா எதிர்ப்பு மருந்து தெளிப்பு",
          detail: "ஸ்ட்ரெப்டோமைசின் சல்பேட் + டெட்ராசைக்ளின் (Streptocycline) 30 கிராம் + காப்பர் ஆக்ஸிகுளோரைடு (Copper Oxychloride) 500 கிராம் ஆகியவற்றை 200 லிட்டர் நீரில் கலந்து ஒரு ஏக்கருக்கு மாலை வேளையில் தெளிக்கவும்.",
          timing: "2-ஆம் நாள் மற்றும் 10-ஆம் நாள்",
          category: "chemical"
        },
        {
          step: "இயற்கை வழிமுறை: 20% பசுஞ்சாணக் கரைசல் தெளிப்பு",
          detail: "20 கிலோ பசுஞ்சாணத்தை 100 லிட்டர் தண்ணீரில் கரைத்து, வடிகட்டி, இலைகளின் இருபுறமும் படும்படி தெளிக்கவும். சாணத்தில் உள்ள நன்மை செய்யும் நுண்ணுயிர்கள் பாக்டீரியா கருகலைக் கட்டுப்படுத்தும்.",
          timing: "இயற்கை மாற்று முறை",
          category: "organic"
        }
      ]
    },
    hi: {
      name: "जीवाणु पत्ती झुलसा (Bacterial Leaf Blight)",
      causal_agent: "जैंथोमोनास ओराइजी (Xanthomonas oryzae)",
      primary_cause: "खेत में भरे पानी और उच्च आर्द्रता के कारण जीवाणु पत्तियों के छिद्रों से प्रवेश करके झुलसा रोग पैदा करते हैं।",
      remedies: [
        {
          step: "खेत से तुरंत पानी की निकासी (48–72 घंटे)",
          detail: "खेत से सारा जमा पानी 2 से 3 दिनों के लिए पूरी तरह निकाल दें ताकि जीवाणुओं का प्रसार रुक सके। मिट्टी में हल्की दरारें आने के बाद ही हल्का पानी दें।",
          timing: "तुरंत (पहला दिन)",
          category: "cultural"
        },
        {
          step: "यूरिया / नाइट्रोजन उर्वरक पर तुरंत रोक",
          detail: "यूरिया या नाइट्रोजन युक्त उर्वरकों का छिड़काव तुरंत बंद करें। अधिक नाइट्रोजन से रोग बहुत तेजी से फैलता है।",
          timing: "तत्काल प्रभाव से",
          category: "nutrient"
        },
        {
          step: "प्रमाणित एंटीबायोटिक और कॉपर कवकनाशी का छिड़काव",
          detail: "स्ट्रेप्टोसाइक्लिन (Streptocycline) 30 ग्राम + कॉपर ऑक्सीक्लोराइड 500 ग्राम को 200 लीटर पानी में मिलाकर प्रति एकड़ शाम के समय छिड़कें।",
          timing: "दूसरा दिन और 10 दिन बाद दोहराएं",
          category: "chemical"
        },
        {
          step: "जैविक उपचार (20% ताजे गोबर का घोल)",
          detail: "20 किलोग्राम ताजा गाय का गोबर 100 लीटर पानी में घोलकर, कपड़े से छानकर पत्तियों पर छिड़कें। यह जीवाणुओं को प्राकृतिक रूप से दबाता है।",
          timing: "जैविक विकल्प",
          category: "organic"
        }
      ]
    }
  },

  Blast: {
    en: {
      name: "Rice Blast Disease",
      causal_agent: "Magnaporthe oryzae (Pyricularia oryzae)",
      primary_cause: "Air-borne fungal spores lodging on wet leaf surfaces, producing spindle-shaped diamond lesions with ashy gray centers.",
      remedies: [
        {
          step: "Systemic Curative Fungicide Spray (Tricyclazole)",
          detail: "Spray Tricyclazole 75% WP @ 0.6 g/L (120 g per acre in 200 L water) or Isoprothiolane 40% EC @ 1.5 mL/L (300 mL/acre) at the very first appearance of diamond eye-spots on leaves.",
          timing: "Immediate (Within 24 Hours)",
          category: "chemical"
        },
        {
          step: "Water Depth Regulation (Shallow 2.5 cm Water)",
          detail: "Do not let the field dry into deep drought stress, and avoid deep stagnation. Keep a consistent shallow water film of 2.5 cm depth. Avoid late evening overhead water splashing.",
          timing: "Continuous",
          category: "cultural"
        },
        {
          step: "Split Nitrogen Application & Potash Boost",
          detail: "Withhold nitrogen top-dressing until new green disease-free leaves emerge. Apply Muriate of Potash (MOP) @ 25 kg/acre to strengthen cell wall silicification against fungal hyphae penetration.",
          timing: "Day 3",
          category: "nutrient"
        },
        {
          step: "Bio-Control Spray (Pseudomonas fluorescens)",
          detail: "Foliar spray of liquid Pseudomonas fluorescens @ 1.0 L/acre (or talc-based powder @ 1.0 kg/acre in 200 L water) provides prolonged biological shielding against blast spore germination.",
          timing: "Preventive & Maintenance",
          category: "organic"
        }
      ]
    },
    ta: {
      name: "நெல் குலை நோய் (Rice Blast)",
      causal_agent: "பைரிகுலேரியா ஒரைசே (Pyricularia oryzae)",
      primary_cause: "காற்றின் மூலம் பரவும் பூஞ்சாணம் இலைகளின் மீது படிந்து, கண் போன்ற இருமுனையும் கூரான பழுப்பு நிறப் புள்ளிகளை உருவாக்குகிறது.",
      remedies: [
        {
          step: "உடனடி பூஞ்சாணக்கொல்லி தெளிப்பு (டிரைசைக்ளசோல்)",
          detail: "டிரைசைக்ளசோல் (Tricyclazole 75% WP) 120 கிராம் அல்லது ஐசோபுரோதியோலேன் (Isoprothiolane 40% EC) 300 மி.லி மருந்தை 200 லிட்டர் நீரில் கலந்து ஒரு ஏக்கருக்குக் காலை அல்லது மாலை வேளையில் தெளிக்கவும்.",
          timing: "உடனடியாக (24 மணி நேரத்திற்குள்)",
          category: "chemical"
        },
        {
          step: "நீர் மேலாண்மை (2.5 செ.மீ சீரான நீர் மட்டம்)",
          detail: "வயல் முற்றிலும் காய்ந்து போக விடக்கூடாது. அதே சமயம் அதிக ஆழத்தில் தண்ணீர் தேங்காமல், 2.5 செ.மீ அளவு சீரான நீர் மட்டத்தைப் பராமரிக்கவும்.",
          timing: "தொடர்ச்சியாக",
          category: "cultural"
        },
        {
          step: "பொட்டாஷ் உரம் அளித்து நோய் எதிர்ப்புத் திறனை கூட்டுதல்",
          detail: "யூரியாவை உடனே நிறுத்திவிட்டு, ஏக்கருக்கு 25 கிலோ மூரியேட் ஆஃப் பொட்டாஷ் (MOP) இடவும். பொட்டாசியம் சத்து இலைத் தோலை தடிமனாக்கி பூஞ்சாணம் ஊடுருவுவதைத் தடுக்கும்.",
          timing: "3-ஆம் நாள்",
          category: "nutrient"
        },
        {
          step: "உயிரியல் கட்டுப்பாடு: சூடோமோனாஸ் புளோரசன்ஸ் தெளிப்பு",
          detail: "சூடோமோனாஸ் புளோரசன்ஸ் (Pseudomonas fluorescens) திரவ மருந்து 1 லிட்டர் அல்லது பொடி 1 கிலோவை 200 லிட்டர் நீரில் கலந்து தெளிப்பதன் மூலம் குலை நோய் மீண்டும் பரவாமல் தடுக்கலாம்.",
          timing: "இயற்கை பாதுகாப்பு",
          category: "organic"
        }
      ]
    },
    hi: {
      name: "धान का झोंका / ब्लास्ट रोग (Rice Blast)",
      causal_agent: "मैग्नापोर्थे ओराइजी (Pyricularia oryzae)",
      primary_cause: "हवा से फैलने वाले कवक बीजाणु पत्तियों पर नाव के आकार के भूरे धब्बे बनाते हैं जिनके केंद्र में राख जैसा रंग होता है।",
      remedies: [
        {
          step: "ट्राइसाइक्लाजोल कवकनाशी का तुरंत छिड़काव",
          detail: "ट्राइसाइक्लाजोल 75% डब्लूपी (Tricyclazole) 120 ग्राम प्रति एकड़ को 200 लीटर पानी में घोलकर पत्तियों पर समान रूप से छिड़कें।",
          timing: "तुरंत (24 घंटे के भीतर)",
          category: "chemical"
        },
        {
          step: "जल प्रबंधन (2.5 सेमी स्थिर जल स्तर)",
          detail: "खेत को पूरी तरह सूखने न दें और न ही बहुत गहरा पानी भरें। खेत में 2.5 सेमी की हल्की पानी की परत बनाए रखें।",
          timing: "लगातार",
          category: "cultural"
        },
        {
          step: "पोटाश उर्वरक द्वारा रोग प्रतिरोधक क्षमता बढ़ाना",
          detail: "यूरिया का प्रयोग रोकें और 25 किलोग्राम म्यूरेट ऑफ पोटाश (MOP) प्रति एकड़ डालें जिससे पत्तियों की कोशिका भित्ति मजबूत हो।",
          timing: "तीसरे दिन",
          category: "nutrient"
        },
        {
          step: "जैविक सुरक्षा (स्यूडोमोनास फ्लोरेसेंस)",
          detail: "स्यूडोमोनास फ्लोरेसेंस 1 किलोग्राम प्रति एकड़ की दर से 200 लीटर पानी में मिलाकर छिड़कने से कवक के बीजाणु नष्ट होते हैं।",
          timing: "जैविक सुरक्षा",
          category: "organic"
        }
      ]
    }
  },

  BrownSpot: {
    en: {
      name: "Brown Spot Disease & Soil Exhaustion",
      causal_agent: "Bipolaris oryzae (Cochliobolus miyabeanus)",
      primary_cause: "Pathological fungal outbreak triggered by underlying soil malnutrition, specifically acute potassium deficiency and zinc starvation.",
      remedies: [
        {
          step: "Urgent Soil Nutrient Rectification (Potash + Zinc)",
          detail: "Brown spot is an alarm for hungry soil. Apply Muriate of Potash (MOP) @ 25 kg/acre and Zinc Sulfate (heptahydrate) @ 10 kg/acre immediately to revive root vigor.",
          timing: "Immediate (Day 1)",
          category: "nutrient"
        },
        {
          step: "Protective & Curative Fungicide Spray",
          detail: "Spray Mancozeb 75% WP @ 2.0 g/L (400 g/acre) or Carbendazim 12% + Mancozeb 63% WP (Saaf) @ 2.0 g/L in 200 L water to halt spot coalescing.",
          timing: "Day 2",
          category: "chemical"
        },
        {
          step: "Foliar Chlorophyll Revival Spray",
          detail: "Foliar spray with 1% Urea + 1% Potassium Chloride (KCl) (2 kg Urea + 2 kg KCl in 200 L water per acre) to replenish photosynthetic leaf tissue rapidly.",
          timing: "Day 5",
          category: "nutrient"
        },
        {
          step: "Seed & Field Sanitation",
          detail: "Ensure that future nurseries use seeds treated with Carbendazim (2 g/kg seed) and incorporate well-rotted Farmyard Manure (FYM) @ 5 tonnes/acre.",
          timing: "Next cropping cycle",
          category: "cultural"
        }
      ]
    },
    ta: {
      name: "பழுப்பு புள்ளி நோய் மற்றும் சத்துக் குறைபாடு (Brown Spot)",
      causal_agent: "பைபோலாரிஸ் ஒரைசே (Bipolaris oryzae)",
      primary_cause: "மண்ணில் பொட்டாசியம் மற்றும் துத்தநாகச் சத்து (Zinc) குறைபாடு இருக்கும்போது, பயிர் பலவீனமடைந்து பூஞ்சாணம் இலைகளில் வட்ட வடிவ பழுப்புப் புள்ளிகளை ஏற்படுத்துகிறது.",
      remedies: [
        {
          step: "மண் சத்து குறைபாட்டை உடனே சரிசெய்தல் (பொட்டாஷ் + ஜிங்க்)",
          detail: "பழுப்பு புள்ளி நோய் ஊட்டச்சத்து குறைபாட்டின் அறிகுறியாகும். ஏக்கருக்கு 25 கிலோ பொட்டாஷ் (MOP) மற்றும் 10 கிலோ ஜிங்க் சல்பேட் (துத்தநாகம்) ஆகியவற்றை உடனடியாக நிலத்தில் இடவும்.",
          timing: "உடனடியாக (முதல் நாள்)",
          category: "nutrient"
        },
        {
          step: "பூஞ்சாணக் கொல்லி மருந்து தெளிப்பு",
          detail: "மேன்கோசெப் (Mancozeb 75% WP) 400 கிராம் அல்லது கார்பென்டாசிம் + மேன்கோசெப் (Saaf) 400 கிராம் மருந்தை 200 லிட்டர் தண்ணீரில் கலந்து ஏக்கருக்குத் தெளிக்கவும்.",
          timing: "2-ஆம் நாள்",
          category: "chemical"
        },
        {
          step: "இலைவழி ஊட்டச்சத்து தெளிப்பு (1% யூரியா + 1% பொட்டாஷ்)",
          detail: "2 கிலோ யூரியா + 2 கிலோ பொட்டாஷ் உரத்தை 200 லிட்டர் நீரில் கரைத்து இலைகள் மீது தெளிப்பதன் மூலம் இலைகள் மீண்டும் பசுமையாக மாறி ஒளிச்சேர்க்கை அதிகரிக்கும்.",
          timing: "5-ஆம் நாள்",
          category: "nutrient"
        },
        {
          step: "இயற்கை மக்கிய தொழுவுரம் இடுதல்",
          detail: "நிலத்தின் வளத்தை நிரந்தரமாக உயர்த்த ஏக்கருக்கு 5 டன் மக்கிய தொழுவுரம் அல்லது மண்புழு உரம் இடுவதை வழக்கமாக்கிக் கொள்ளவும்.",
          timing: "பயிர்க் காலம் முழுவதும்",
          category: "organic"
        }
      ]
    },
    hi: {
      name: "भूरा धब्बा रोग और पोषक तत्व की कमी (Brown Spot)",
      causal_agent: "बाइपोलारिस ओराइजी (Bipolaris oryzae)",
      primary_cause: "मिट्टी में पोटाश और जिंक की भारी कमी के कारण फसल कमजोर होकर फफूंद के आक्रमण की शिकार हो जाती है।",
      remedies: [
        {
          step: "मृदा पोषण सुधार (पोटाश और जिंक सल्फेट)",
          detail: "यह रोग भूखी मिट्टी का संकेत है। तुरंत 25 किलोग्राम पोटाश (MOP) और 10 किलोग्राम जिंक सल्फेट प्रति एकड़ खेत में डालें।",
          timing: "तुरंत (पहला दिन)",
          category: "nutrient"
        },
        {
          step: "कवकनाशी मैन्कोजेब का छिड़काव",
          detail: "मैन्कोजेब 75% डब्लूपी (Mancozeb) 400 ग्राम या साफ (Saaf) 400 ग्राम प्रति एकड़ को 200 लीटर पानी में मिलाकर पत्तियों पर छिड़कें।",
          timing: "दूसरा दिन",
          category: "chemical"
        },
        {
          step: "पत्तियों पर पोषक तत्व का छिड़काव (1% यूरिया + 1% पोटाश)",
          detail: "2 किलोग्राम यूरिया और 2 किलोग्राम पोटाश को 200 लीटर पानी में घोलकर पत्तियों पर छिड़कें जिससे हरियाली तेजी से वापस आए।",
          timing: "पांचवां दिन",
          category: "nutrient"
        },
        {
          step: "जैविक खाद का प्रयोग",
          detail: "खेत की उर्वरा शक्ति बढ़ाने के लिए प्रति एकड़ 5 टन अच्छी सड़ी हुई गोबर की खाद अवश्य डालें।",
          timing: "फसल चक्र",
          category: "organic"
        }
      ]
    }
  },

  Tungro: {
    en: {
      name: "Rice Tungro Viral Disease",
      causal_agent: "Rice Tungro Bacilliform (RTBV) & Spherical Virus (RTSV)",
      primary_cause: "Viral transmission through Green Leafhoppers (Nephotettix virescens). Fungicides DO NOT cure viruses; insect vector control is mandatory.",
      remedies: [
        {
          step: "Immediate Green Leafhopper (GLH) Insecticide Knockdown",
          detail: "Spray Thiamethoxam 25% WG @ 40 g/acre (or Imidacloprid 17.8% SL @ 50 mL/acre) in 200 L water immediately. Eliminating the insect vector is the only way to stop viral spread across the field.",
          timing: "Immediate (Hour 1)",
          category: "chemical"
        },
        {
          step: "Rogueing & Destruction of Infected Clumps",
          detail: "Walk the field and physically uproot all stunted, yellow-orange twisted hills. Bury them in a pit outside the bund to prevent leafhoppers from feeding on infected sap and spreading it.",
          timing: "Day 1 & Day 2",
          category: "cultural"
        },
        {
          step: "Neem Oil Vector Repellent Barrier",
          detail: "Spray 3% Neem Oil (Azadirachtin 1500 ppm @ 3 mL/L with 1 mL soap solution) along field borders and bunds to create an insect feeding repellent barrier.",
          timing: "Day 4",
          category: "organic"
        },
        {
          step: "Recovery Nutrition (Foliar DAP + MOP)",
          detail: "After eliminating leafhoppers, spray 2% DAP (4 kg) + 1% KCl (2 kg) in 200 L water per acre to stimulate rapid tiller production from surviving healthy root systems.",
          timing: "Day 10",
          category: "nutrient"
        }
      ]
    },
    ta: {
      name: "நெல் துங்ரோ நச்சுயிரி (வைரஸ்) நோய் (Rice Tungro)",
      causal_agent: "துங்ரோ வைரஸ் (பச்சை தத்துப்பூச்சிகளால் பரப்பப்படுகிறது)",
      primary_cause: "பச்சை தத்துப்பூச்சிகள் (Green Leafhoppers) சாறு உறிஞ்சும்போது வைரஸ் கிருமிகளைப் பயிரில் செலுத்துகின்றன. பூஞ்சாண மருந்துகள் வைரஸைக் கட்டுப்படுத்தாது; பூச்சியைக் கட்டுப்படுத்துவதே ஒரே வழி.",
      remedies: [
        {
          step: "பச்சை தத்துப்பூச்சிகளை உடனடியாகக் கட்டுப்படுத்துதல்",
          detail: "தயமீத்தாக்சாம் (Thiamethoxam 25% WG) 40 கிராம் அல்லது இமிடாக்ளோப்ரிட் (Imidacloprid 17.8% SL) 50 மி.லி மருந்தை 200 லிட்டர் நீரில் கலந்து உடனடியாகத் தெளிக்கவும். தத்துப்பூச்சிகளை அழித்தால் மட்டுமே நோய் பரவுவது நிற்கும்.",
          timing: "உடனடியாக (முதல் சில மணி நேரங்களில்)",
          category: "chemical"
        },
        {
          step: "பாதிக்கப்பட்ட மஞ்சள் நிற பயிர்களைப் பிடுங்கி அழித்தல் (Rogueing)",
          detail: "வயலில் வளர்ச்சி குன்றி, ஆரஞ்சு-மஞ்சள் நிறமாக மாறிய பயிர்களை உடனடியாக வேரோடு பிடுங்கி வயலுக்கு வெளியே புதைத்து அழிக்கவும்.",
          timing: "முதல் மற்றும் இரண்டாம் நாள்",
          category: "cultural"
        },
        {
          step: "வேப்ப எண்ணெய் பாதுகாப்பு வளையம் அமைத்தல்",
          detail: "3% வேப்ப எண்ணெய் (1 லிட்டர் தண்ணீருக்கு 30 மி.லி வேப்ப எண்ணெய் + காதி சோப்பு கரைசல்) வரப்பு ஓரங்களில் தெளித்து தத்துப்பூச்சிகள் மீண்டும் வருவதைத் தடுக்கவும்.",
          timing: "4-ஆம் நாள்",
          category: "organic"
        },
        {
          step: "பயிர் மீட்சி ஊட்டச்சத்து தெளிப்பு (2% டி.ஏ.பி + 1% பொட்டாஷ்)",
          detail: "பூச்சிகள் கட்டுப்பட்ட பிறகு, 4 கிலோ டி.ஏ.பி + 2 கிலோ பொட்டாஷ் உரத்தை 200 லிட்டர் நீரில் கரைத்துத் தெளிப்பதன் மூலம் பயிர் புதிய தூர்களை வேகமாக உருவாக்கும்.",
          timing: "10-ஆம் நாள்",
          category: "nutrient"
        }
      ]
    },
    hi: {
      name: "धान का टुंग्रो विषाणु रोग (Rice Tungro Virus)",
      causal_agent: "टुंग्रो वायरस (हरे फुदके / Green Leafhopper द्वारा प्रसारित)",
      primary_cause: "हरे फुदके द्वारा वायरस का संचरण। कवकनाशी से वायरस ठीक नहीं होता; वाहक कीट को नष्ट करना अनिवार्य है।",
      remedies: [
        {
          step: "हरे फुदके (कीट) का तुरंत रासायनिक नियंत्रण",
          detail: "थियामेथॉक्सम 25% डब्ल्यूजी (Thiamethoxam) 40 ग्राम या इमिडाक्लोप्रिड 50 मिली प्रति एकड़ को 200 लीटर पानी में मिलाकर तुरंत छिड़कें।",
          timing: "तुरंत (पहले दिन)",
          category: "chemical"
        },
        {
          step: "रोगग्रस्त पीले पौधों को उखाड़कर नष्ट करना",
          detail: "बौने और पीले-नारंगी पड़े पौधों को तुरंत जड़ से उखाड़कर खेत से बाहर गड्ढे में दबा दें ताकि स्वस्थ पौधों में संक्रमण न फैले।",
          timing: "पहला और दूसरा दिन",
          category: "cultural"
        },
        {
          step: "नीम के तेल का सुरक्षात्मक छिड़काव",
          detail: "3% नीम का तेल खेत की मेड़ों और किनारों पर छिड़कें जिससे कीट दोबारा खेत में न आ सकें।",
          timing: "चौथे दिन",
          category: "organic"
        },
        {
          step: "पुनर्प्राप्ति पोषण (2% डीएपी + 1% पोटाश घोल)",
          detail: "कीट नियंत्रण के बाद, 4 किलोग्राम डीएपी + 2 किलोग्राम पोटाश 200 लीटर पानी में मिलाकर पत्तियों पर छिड़कें ताकि नए कल्ले तेजी से फूटें।",
          timing: "दसवें दिन",
          category: "nutrient"
        }
      ]
    }
  },

  Healthy: {
    en: {
      name: "Optimal Canopy Health & Vigor",
      causal_agent: "None (Healthy Rice Stand)",
      primary_cause: "Balanced vegetative growth, adequate chlorophyll concentration, and optimal soil moisture.",
      remedies: [
        {
          step: "Alternate Wetting and Drying (AWD Irrigation)",
          detail: "Maintain intermittent irrigation: allow water to naturally subside to soil level before re-flooding to 2.5–5 cm depth. This oxygenates the rhizosphere and stimulates deep tillering roots.",
          timing: "Ongoing till maturity",
          category: "cultural"
        },
        {
          step: "Scheduled Panicle Initiation Top-Dressing",
          detail: "At panicle initiation stage (45–55 days after transplanting), apply final split of Neem-coated Urea @ 25 kg/acre and MOP @ 15 kg/acre to maximize grain filling.",
          timing: "At Panicle Initiation",
          category: "nutrient"
        },
        {
          step: "Periodic Satellite Orbit Monitoring",
          detail: "Check Sentinel AI dashboard every 3–5 days to catch any sudden satellite NDVI drops or radar backscatter anomalies before visual foliar symptoms emerge.",
          timing: "Every 3–5 Days",
          category: "cultural"
        }
      ]
    },
    ta: {
      name: "செழிப்பான ஆரோக்கியமான நெல் பயிர்",
      causal_agent: "எதுவுமில்லை (ஆரோக்கியமான நெல் பயிர்)",
      primary_cause: "முறையான தழைச்சத்து சமநிலை, சரியான நீர் மேலாண்மை மற்றும் தகுந்த தட்பவெப்ப நிலை.",
      remedies: [
        {
          step: "காய்ச்சலும் பாய்ச்சலும் முறை பாசனம் (AWD முறை)",
          detail: "வயலில் எப்போதும் அதிக நீர் தேங்காமல், தண்ணீர் வடிந்து நிலத்தின் மேல் லேசான ஈரப்பதம் குறையும் போது மீண்டும் 2.5 முதல் 5 செ.மீ அளவுக்குப் பாசனம் செய்யவும். இது வேர்களுக்கு பிராணவாயுவை வழங்கி தூர் கட்டும் திறனை அதிகரிக்கும்.",
          timing: "பயிர்க்காலம் முழுவதும்",
          category: "cultural"
        },
        {
          step: "தூர் மற்றும் பூக்கும் பருவ மேலுரம்",
          detail: "பயிர் தூர் கட்டி பூக்கும் பருவத்தில் (நட்ட 45-55 நாட்களில்) ஏக்கருக்கு 25 கிலோ வேப்பம்பூண் கலந்த யூரியா மற்றும் 15 கிலோ பொட்டாஷ் உரத்தை மேலுரமாக இடவும்.",
          timing: "பூக்கும் தருணத்தில்",
          category: "nutrient"
        },
        {
          step: "செயற்கைக்கோள் கண்காணிப்பைத் தொடருதல்",
          detail: "சென்டினல் ஏஐ தளத்தில் 3 முதல் 5 நாட்களுக்கு ஒருமுறை செயற்கைக்கோள் குறியீடுகளை கவனித்து, நோய் தாக்கம் ஆரம்பிக்கும் முன்பே விழிப்புடன் இருக்கவும்.",
          timing: "வாரம் ஒருமுறை",
          category: "cultural"
        }
      ]
    },
    hi: {
      name: "उत्कृष्ट और स्वस्थ धान की फसल",
      causal_agent: "कोई नहीं (स्वस्थ फसल)",
      primary_cause: "संतुलित पोषण, पर्याप्त पर्णहरित (क्लोरोफिल) और अनुकूल मिट्टी की नमी।",
      remedies: [
        {
          step: "वैकल्पिक गीला और सूखा सिंचाई प्रबंधन (AWD विधि)",
          detail: "खेत में लगातार बहुत गहरा पानी न भरें। पानी सूखने पर 2.5 से 5 सेमी पानी लगाएं। इससे जड़ों को ऑक्सीजन मिलती है और कल्ले अधिक फूटते हैं।",
          timing: "लगातार",
          category: "cultural"
        },
        {
          step: "बालियां निकलने की अवस्था में अंतिम खाद",
          detail: "रोपाई के 45-50 दिन बाद 25 किलोग्राम नीम लेपित यूरिया और 15 किलोग्राम पोटाश प्रति एकड़ डालें ताकि दानों का भराव अच्छा हो।",
          timing: "बाली बनते समय",
          category: "nutrient"
        },
        {
          step: "नियमित उपग्रह निगरानी",
          detail: "हर 3-5 दिन में सेंटिनल एआई पर अपने खेत की उपग्रह रिपोर्ट देखते रहें ताकि किसी भी संभावित तनाव की समय रहते पहचान हो सके।",
          timing: "साप्ताहिक",
          category: "cultural"
        }
      ]
    }
  }
};
