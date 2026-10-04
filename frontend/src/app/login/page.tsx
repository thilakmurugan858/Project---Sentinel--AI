"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Sprout, 
  Lock, 
  User, 
  ArrowRight, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  KeyRound,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("THILAK");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Ponneri Field Definition (Requested by user: land near Ponneri without soil test)
  const ponneriFieldProfile = {
    id: "field_ponneri_thilak",
    name: "Ponneri North Paddy Field",
    district: "Tiruvallur",
    town: "Ponneri",
    centerLat: 13.3330,
    centerLon: 80.1980,
    is_validated: true,
    areaAcres: 2.2,
    soilData: null, // User specified: without soil test because no reports available
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
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanUsername = username.trim().toUpperCase();

    // Check THILAK built-in credentials
    if (cleanUsername === "THILAK") {
      if (password === "Anuthilak@21458") {
        // Success: Store THILAK user & assign Ponneri field
        localStorage.setItem("sentinel_user", JSON.stringify({
          username: "THILAK",
          role: "Farmer / Land Owner",
          location: "Ponneri, Tiruvallur District",
          hasSoilTest: false
        }));
        localStorage.setItem("sentinel_active_field", JSON.stringify(ponneriFieldProfile));
        localStorage.setItem("sentinel_app_mode", "real");
        window.dispatchEvent(new Event("userChanged"));
        window.dispatchEvent(new Event("modeChanged"));
        
        router.push("/dashboard");
        return;
      } else {
        setLoading(false);
        setError("Invalid password for THILAK. Please enter the correct password.");
        return;
      }
    }

    // Custom / Any User Login
    if (cleanUsername.length > 0) {
      localStorage.setItem("sentinel_user", JSON.stringify({
        username: username.trim(),
        role: "Farmer / Agro-Inspector",
        location: "Tamil Nadu",
        hasSoilTest: false
      }));
      window.dispatchEvent(new Event("userChanged"));
      router.push("/field-setup");
      return;
    }

    setLoading(false);
    setError("Please enter a username.");
  };

  // 1-Click Instant Login as THILAK
  const handleInstantThilakLogin = () => {
    setUsername("THILAK");
    setPassword("Anuthilak@21458");
    localStorage.setItem("sentinel_user", JSON.stringify({
      username: "THILAK",
      role: "Farmer / Land Owner",
      location: "Ponneri, Tiruvallur District",
      hasSoilTest: false
    }));
    localStorage.setItem("sentinel_active_field", JSON.stringify(ponneriFieldProfile));
    localStorage.setItem("sentinel_app_mode", "real");
    window.dispatchEvent(new Event("userChanged"));
    window.dispatchEvent(new Event("modeChanged"));

    router.push("/dashboard");
  };

  // Guest / New User Continue
  const handleNewUserContinue = () => {
    localStorage.setItem("sentinel_user", JSON.stringify({
      username: "New Farmer",
      role: "Guest User",
      location: "Tamil Nadu",
      hasSoilTest: false
    }));
    window.dispatchEvent(new Event("userChanged"));
    router.push("/field-setup");
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12 space-y-6">
      
      {/* Branding Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200 mb-2">
          <Sprout className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Farmer Portal Login
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Sign in to access your continuous satellite-monitored paddy land.
        </p>
      </div>

      {/* 1-Click Fast Pass for THILAK */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-2 border-emerald-300 shadow-sm space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-full">
              Built-In Verified Account
            </span>
            <h3 className="font-bold text-slate-900 text-sm mt-1">User: THILAK</h3>
            <p className="text-xs text-slate-600">
              Assigned Land: <strong>Ponneri North Field (Tiruvallur)</strong> • 2.2 Acres
            </p>
            <p className="text-[11px] text-emerald-800">
              ✓ Continuous Satellite Monitoring Active (No Soil Report Required)
            </p>
          </div>
        </div>

        <button
          onClick={handleInstantThilakLogin}
          type="button"
          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-emerald-200 transition-all hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4" />
          <span>⚡ 1-Click Instant Sign In as THILAK</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Manual Login Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Username</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. THILAK"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold text-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="relative border-t border-slate-200 pt-4 text-center">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-[11px] text-slate-400 font-medium">
            OR
          </div>
          
          <button
            onClick={handleNewUserContinue}
            type="button"
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5"
          >
            <span>Continue as New User (Register New Land)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      <div className="text-center text-[11px] text-slate-500 space-y-1">
        <p>🔒 Sentinel AI • Secured Agricultural Data Infrastructure</p>
        <p>Built for Tamil Nadu Paddy Farmers • Continuous Orbital Land Watch</p>
      </div>

    </div>
  );
}
