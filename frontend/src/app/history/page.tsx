"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Satellite, 
  Leaf, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  MapPin,
  Clock,
  Sparkles
} from "lucide-react";

interface CycleItem {
  id: string;
  date: string;
  satelliteNdvi: number;
  satelliteNdwi: number;
  verdict: string;
  verdictCategory: string;
  leafStatus: string;
  qualityLevel: string;
}

export default function HistoryPage() {
  const [field, setField] = useState<any>(null);
  const [cycles, setCycles] = useState<CycleItem[]>([]);

  useEffect(() => {
    const savedField = localStorage.getItem("sentinel_active_field");
    const activeField = savedField ? JSON.parse(savedField) : {
      name: "Thennamanadu South Field",
      district: "Thanjavur",
      town: "Orathanadu"
    };
    setField(activeField);

    // Realistic Sentinel-2 orbit cycles over the last 30 days (every 5 days)
    const mockCycles: CycleItem[] = [
      {
        id: "cyc_005",
        date: "2026-09-23",
        satelliteNdvi: 0.38,
        satelliteNdwi: 0.12,
        verdict: "Needs Attention (Vegetative Drop)",
        verdictCategory: "ABIOTIC_STRESS",
        leafStatus: "Triggered (Ground Photo Requested)",
        qualityLevel: "Full Evidence"
      },
      {
        id: "cyc_004",
        date: "2026-09-18",
        satelliteNdvi: 0.54,
        satelliteNdwi: 0.19,
        verdict: "Mild Tillering Delay",
        verdictCategory: "ABIOTIC_STRESS",
        leafStatus: "Not Triggered",
        qualityLevel: "Full Evidence"
      },
      {
        id: "cyc_003",
        date: "2026-09-13",
        satelliteNdvi: 0.68,
        satelliteNdwi: 0.22,
        verdict: "Field Healthy",
        verdictCategory: "HEALTHY",
        leafStatus: "Not Triggered",
        qualityLevel: "Full Evidence"
      },
      {
        id: "cyc_002",
        date: "2026-09-08",
        satelliteNdvi: 0.0,
        satelliteNdwi: 0.0,
        verdict: "Cloud Contaminated Scene",
        verdictCategory: "INSUFFICIENT_EVIDENCE",
        leafStatus: "Triggered (Cloud Fallback)",
        qualityLevel: "Insufficient"
      },
      {
        id: "cyc_001",
        date: "2026-09-03",
        satelliteNdvi: 0.72,
        satelliteNdwi: 0.25,
        verdict: "Field Healthy",
        verdictCategory: "HEALTHY",
        leafStatus: "Not Triggered",
        qualityLevel: "Full Evidence"
      }
    ];

    setCycles(mockCycles);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3">
          <Clock className="w-3.5 h-3.5" />
          <span>Historical Monitoring Cycles • 5-Day Sentinel-2 Orbit Interval</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Monitoring History & NDVI Trends</h1>
        <p className="text-slate-600 text-sm mt-1">
          Tracking vegetative canopy vigor over time allows the system to compare your field against its own historical baseline, identifying anomalies before visible damage spreads.
        </p>
      </div>

      {/* Field & Trend Summary Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Field</div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">{field?.name || "Paddy Parcel"}</h2>
            <p className="text-xs text-slate-500">{field?.town}, {field?.district} District</p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 block">Baseline NDVI:</span>
              <strong className="text-sm font-bold text-slate-800">0.68</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 block">Current NDVI:</span>
              <strong className="text-sm font-bold text-rose-600 flex items-center space-x-1">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>0.38 (-0.30)</span>
              </strong>
            </div>
          </div>
        </div>

        {/* Visual Trend Bars */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>NDVI Trend (Last 5 Satellite Overpasses)</span>
            <span className="text-slate-400 font-normal">Optimal Paddy Range: 0.50 – 0.85</span>
          </div>

          <div className="grid grid-cols-5 gap-2 h-28 items-end pt-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            {cycles.map((c) => {
              const heightPct = c.satelliteNdvi > 0 ? (c.satelliteNdvi / 0.85) * 100 : 8;
              const isStressed = c.satelliteNdvi > 0 && c.satelliteNdvi < 0.45;
              const isCloud = c.satelliteNdvi === 0;

              return (
                <div key={c.id} className="flex flex-col items-center h-full justify-end group relative">
                  <div
                    className={`w-full max-w-[42px] rounded-t-lg transition-all ${
                      isCloud 
                        ? "bg-slate-300 pattern-diagonal-stripes" 
                        : isStressed 
                          ? "bg-rose-500 hover:bg-rose-600" 
                          : "bg-emerald-500 hover:bg-emerald-600"
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <div className="text-[10px] font-mono text-slate-600 mt-2 font-medium">
                    {c.date.slice(5)}
                  </div>
                  <div className="text-[9px] font-bold text-slate-800">
                    {isCloud ? "Cloud" : c.satelliteNdvi.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cycle List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
        <div className="p-5 bg-slate-50 font-bold text-slate-900 text-sm">
          Chronological Monitoring Logs
        </div>

        {cycles.map((cyc) => (
          <div key={cyc.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
            
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-sm text-slate-900">{cyc.date}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  cyc.verdictCategory === "HEALTHY" 
                    ? "bg-emerald-100 text-emerald-800" 
                    : cyc.verdictCategory === "INSUFFICIENT_EVIDENCE" 
                      ? "bg-slate-200 text-slate-700" 
                      : "bg-rose-100 text-rose-800"
                }`}>
                  {cyc.verdict}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Leaf Modality: <span className="font-medium text-slate-700">{cyc.leafStatus}</span> • Quality: <span className="font-medium text-slate-700">{cyc.qualityLevel}</span>
              </p>
            </div>

            <div className="flex items-center space-x-6 text-xs font-mono">
              <div>
                <span className="text-slate-400 text-[10px] block">NDVI</span>
                <span className="font-bold text-slate-800 text-sm">{cyc.satelliteNdvi > 0 ? cyc.satelliteNdvi : "—"}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">NDWI</span>
                <span className="font-bold text-slate-800 text-sm">{cyc.satelliteNdwi > 0 ? cyc.satelliteNdwi : "—"}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
