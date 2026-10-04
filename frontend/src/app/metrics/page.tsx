"use client";

import React from "react";
import Link from "next/link";
import { 
  FileText, 
  Download, 
  ArrowLeft, 
  ShieldCheck, 
  Satellite, 
  Leaf, 
  Cpu, 
  BookOpen,
  CheckCircle2
} from "lucide-react";

export default function MLMetricsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12 pt-4">
      
      {/* Back button */}
      <div>
        <Link 
          href="/dashboard"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs hover:shadow-xs transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Farm Dashboard</span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Technical & Scientific Documentation</span>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Comprehensive System & ML Documentation
        </h1>

        <p className="text-slate-600 text-sm leading-relaxed">
          To maintain a clean, distraction-free interface for agricultural field operations, all in-depth machine learning training curves, confusion matrices, multi-constellation satellite revisit math, SAR radar equations, and benchmark evaluations are compiled into the official 40-page project documentation PDF.
        </p>

        {/* Download Action Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-2 border-emerald-300 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-200 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Ml report 858.pdf</h3>
              <p className="text-xs text-slate-600">
                Official Comprehensive Technical Report • 40 Pages • Academic Print Format
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <a
              href="/Ml_report_858.pdf"
              download="Ml report 858.pdf"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-emerald-200 transition-all hover:scale-[1.02]"
            >
              <Download className="w-4 h-4" />
              <span>Download Report (PDF)</span>
            </a>
            <a
              href="/Ml_report_858.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs flex items-center justify-center space-x-2 transition-all"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Open in Browser</span>
            </a>
          </div>
        </div>

        {/* Included Topics in the PDF */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Contents Covered in the 40-Page Report:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
            <div className="flex items-start space-x-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Orbital Remote Sensing:</strong> Sentinel-2 & Landsat-8/9 HLS 2.3-day revisit orchestration.</span>
            </div>
            <div className="flex items-start space-x-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Active Microwave SAR:</strong> Sentinel-1 C-Band (5.405 GHz) dual-pol Radar Vegetation Index (RVI).</span>
            </div>
            <div className="flex items-start space-x-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>MobileNetV2 Foliar Vision:</strong> 5-class rice pathology model with 99.31% validation accuracy.</span>
            </div>
            <div className="flex items-start space-x-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Multimodal Quality Gate:</strong> Tri-modal decision matrix, cross-modal fusion, and TNAU remedies.</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
