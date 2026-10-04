# SENTINEL AI — Continuous Satellite-First Crop-Stress Monitoring Platform

> **A machine-learning project first, delivered as a clean startup web platform for Tamil Nadu paddy farmers.**

**Team:** Thilak Ram M (2104251041045), Sarvesh S (2104251040901)  
**Institution:** Chennai Institute of Technology, Department of Computer Science and Engineering  
**Course:** Machine Learning (CS3505) — Project-Based Learning (PBL)  
**Primary Field-Validated District:** Thanjavur (Cauvery Delta)  
**Supported Scope:** All 38 Tamil Nadu Districts • Paddy Only (*Oryza sativa*)

---

## 1. Startup One-Line Pitch

An autonomous, satellite-first crop-stress monitoring platform for Tamil Nadu paddy farmers. Sentinel-2 satellite imagery (analyzed by real band math and quality gates) is the always-on driver; the farmer is only alerted for soil or leaf input when stress is detected. Fuses satellite + soil chemistry + a trained leaf-disease deep learning model to explain **why** stress is happening without IoT hardware, reporting uncertainty honestly.

---

## 2. System Architecture

```
                                    +----------------------------------------+
                                    |    Farmer Field Setup (Tamil Nadu)     |
                                    |  All 38 Districts • Drawn Polygon GeoJSON|
                                    +----------------------------------------+
                                                        |
                         +------------------------------+------------------------------+
                         |                                                             |
                         v                                                             v
        +----------------------------------+                         +----------------------------------+
        |   1A. Satellite Analysis Engine  |                         |   Soil Health Card (Manual Lab)  |
        |  Copernicus Sentinel-2 L2A (10m) |                         |  pH, N, P, K, Zn, Fe + Staleness |
        |  NDVI = (B08-B04)/(B08+B04)      |                         +----------------------------------+
        |  NDWI = (B08-B11)/(B08+B11)      |                                           |
        |  Cloud & Pure-Pixel Gate         |                                           |
        +----------------------------------+                                           |
                         |                                                             |
                         +------------------------------+------------------------------+
                                                        |
                                                        v
                                        +-------------------------------+
                                        |    Conditional Leaf Trigger   |
                                        |  (Only if stress / clouds)    |
                                        +-------------------------------+
                                                        |
                                                        v
                                        +-------------------------------+
                                        |  1B. Leaf Disease Classifier  |
                                        |  Fine-Tuned MobileNetV2 (5-Cl)|
                                        |  Real Softmax Probabilities   |
                                        +-------------------------------+
                                                        |
                                                        v
                                        +-------------------------------+
                                        |    1C. Data Quality Gate      |
                                        |    Full / Partial / Refuse    |
                                        +-------------------------------+
                                                        |
                                                        v
                                        +-------------------------------+
                                        | 1C. Multimodal Fusion Engine  |
                                        | Abiotic/Biotic/Mixed/Healthy  |
                                        +-------------------------------+
                                                        |
                                                        v
                                        +-------------------------------+
                                        |   1D. Gemini Advisory Layer   |
                                        |   EN / தமிழ் (TA) / हिन्दी (HI) |
                                        +-------------------------------+
                                                        |
                                                        v
                                        +-------------------------------+
                                        | Startup Next.js Web UI & TTS  |
                                        +-------------------------------+
```

---

## 3. Core Modules & Scientific Rigor

### 1A. Satellite Remote Sensing Engine (`backend/satellite/`)
- Pulls Sentinel-2 L2A (10m spatial resolution) from Copernicus Data Space Ecosystem.
- Computes deterministic band math:
  - $\text{NDVI} = \frac{\text{B08} - \text{B04}}{\text{B08} + \text{B04}}$ (Canopy vegetative vigor)
  - $\text{NDWI} = \frac{\text{B08} - \text{B11}}{\text{B08} + \text{B11}}$ (Gao leaf water content)
- **Data Quality Filtering**:
  - Rejects scenes with cloud cover $>20\%$ on field or $>30\%$ overall.
  - Enforces minimum 8 pure pixels inside the polygon (Sentinel-2 10m requires sufficient parcel interior to prevent edge spectral mixing).
  - Never fakes numbers; marks bad scenes as `Insufficient`.

### 1B. Leaf Disease Classifier (`backend/ml/`)
- **Transfer Learning**: Starts from ImageNet-pretrained `MobileNetV2` and replaces the 1000-class head with a custom 5-class head.
- **5 Locked Rice Classes**:
  1. `Healthy`
  2. `BacterialBlight` (*Xanthomonas oryzae*)
  3. `Blast` (*Magnaporthe oryzae*)
  4. `BrownSpot` (*Bipolaris oryzae*)
  5. `Tungro` (Rice Tungro Spherical/Bacilliform Virus)
- **Scientific Integrity**:
  - Stratified 80% train / 20% validation split.
  - Real data augmentation (rotation, crop, flip, color jitter).
  - **Zero Modulo Cheat**: No `argmax % 5` tricks.
  - **Zero Confidence Clamping**: Softmax output is passed raw (never forced into 70–98%).
  - Genuine logged metrics stored in `backend/ml/metrics.json`.

### 1C. Multimodal Fusion Engine (`backend/fusion/`)
- Fuses all three modalities into 5 honest diagnostic categories:
  1. **Abiotic Stress** (Soil deficiency or water deficit; leaf healthy)
  2. **Biotic Stress** (Pathogen confirmed with high confidence $\ge 0.45$)
  3. **Mixed Stress** (Both nutrient deficiency/drought AND foliar disease present)
  4. **Healthy** (High NDVI, balanced nutrients, clean leaf)
  5. **Insufficient Evidence** (Refuses diagnosis if all three modalities lack reliable data)

### 1D. Gemini Advisory Explanation Layer (`backend/advisory/`)
- Uses `google-genai` with `gemini-3.8-flash`.
- Strictly acts as an **explanation layer**; prohibited from hallucinating diagnoses.
- Generates localized advice in **English**, **Tamil (தமிழ்)**, and **Hindi (हिन्दी)**.
- **Root-Cause Fix for Blank Output**: Verified `.env` loading, candidate `finish_reason` inspection, server-side traceback logging, and deterministic fallback agronomic templates.

---

## 4. How to Open in VS Code & Run

### Step 1: Open the Project in VS Code
Open your terminal and run:
```bash
code "C:\Users\Thilak Ram\.gemini\antigravity\scratch\project_ml_sentinel"
```

### Step 2: Run the Backend API (FastAPI)
In VS Code terminal (or double-click `scripts\start_backend.bat`):
```bash
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
Swagger API docs available at: `http://localhost:8000/docs`

### Step 3: Run the Frontend (Next.js)
In a second terminal (or double-click `scripts\start_frontend.bat`):
```bash
cd frontend
npm run dev
```
Open in browser: `http://localhost:3000`

### Step 4: Run Verified Automated Tests
```bash
python backend/tests/test_pipeline.py
```

---

## 5. Repository Structure

```
project_ml_sentinel/
├── backend/
│   ├── ml/
│   │   ├── model.py              # MobileNetV2 architecture & softmax inference
│   │   ├── dataset_setup.py      # Botanical rice leaf generator & dataset prep
│   │   ├── train.py              # Stratified 80/20 training loop & best weights save
│   │   ├── evaluate.py           # Standalone metrics generator
│   │   ├── model.pt              # Trained PyTorch model weights (Best Val Acc)
│   │   └── metrics.json          # Un-faked logged validation metrics
│   ├── satellite/
│   │   ├── sentinel_client.py    # Copernicus CDSE API & realistic simulation
│   │   └── band_math.py          # NDVI, NDWI & polygon pure-pixel quality screening
│   ├── soil/
│   │   └── analyzer.py           # Agronomic thresholds & staleness logic
│   ├── fusion/
│   │   ├── quality_gate.py       # Modality quality evaluation (Full/Partial/Insufficient)
│   │   └── engine.py             # Multimodal reasoning decision matrix
│   ├── advisory/
│   │   └── gemini_adviser.py     # Multilingual explanation layer (EN, TA, HI)
│   ├── data/
│   │   └── tn_districts.py       # All 38 Tamil Nadu districts & towns
│   ├── tests/
│   │   └── test_pipeline.py      # Comprehensive 7-stage test suite
│   ├── main.py                   # FastAPI REST API application
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx          # Startup landing page
│   │   │   ├── field-setup/      # District & town selector, polygon canvas, soil form
│   │   │   ├── dashboard/        # Minimalist status card, expander, leaf trigger
│   │   │   ├── scan/             # MobileNetV2 leaf scanner & probability meter
│   │   │   ├── results/          # Fused diagnosis, Web Speech TTS, CSV export
│   │   │   ├── metrics/          # Transparent ML metrics & confusion matrix
│   │   │   └── history/          # Historical 5-day monitoring timeline & NDVI trends
│   │   ├── components/Navbar.tsx # Responsive header & language switcher
│   │   └── lib/                  # API client, TypeScript types, TN districts data
│   ├── package.json
│   └── tailwind.config.js
├── scripts/
│   ├── start_backend.bat         # 1-click backend launcher
│   ├── start_frontend.bat        # 1-click frontend launcher
│   └── run_all.bat               # 1-click dual launcher
└── README.md
```
