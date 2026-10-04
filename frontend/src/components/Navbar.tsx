"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Sprout, 
  Satellite, 
  Activity, 
  FileText, 
  BarChart3, 
  Globe, 
  Menu, 
  X, 
  ShieldCheck,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  User,
  LogOut
} from "lucide-react";
import { checkBackendHealth } from "../lib/api";

import { TRANSLATIONS, SupportedLanguage } from "../lib/translations";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<string>("en");
  const [backendStatus, setBackendStatus] = useState<string>("Checking...");
  const [appMode, setAppMode] = useState<"demo" | "real">("demo");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    checkBackendHealth().then((health) => {
      setBackendStatus(health.status === "healthy" ? "API Live" : "Local Mode");
    });
    const savedLang = localStorage.getItem("sentinel_lang") || "en";
    setLanguage(savedLang);

    const savedMode = (localStorage.getItem("sentinel_app_mode") as "demo" | "real") || "demo";
    setAppMode(savedMode);

    const loadUser = () => {
      const userStr = localStorage.getItem("sentinel_user");
      if (userStr) {
        try {
          setCurrentUser(JSON.parse(userStr));
        } catch (e) {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    };
    loadUser();

    const handleModeUpdate = () => {
      const current = (localStorage.getItem("sentinel_app_mode") as "demo" | "real") || "demo";
      setAppMode(current);
    };

    const handleLanguageUpdate = () => {
      const current = localStorage.getItem("sentinel_lang") || "en";
      setLanguage(current);
    };

    window.addEventListener("modeChanged", handleModeUpdate);
    window.addEventListener("userChanged", loadUser);
    window.addEventListener("languageChanged", handleLanguageUpdate);
    return () => {
      window.removeEventListener("modeChanged", handleModeUpdate);
      window.removeEventListener("userChanged", loadUser);
      window.removeEventListener("languageChanged", handleLanguageUpdate);
    };
  }, []);

  const handleLangChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem("sentinel_lang", lang);
    window.dispatchEvent(new Event("languageChanged"));
  };

  const handleModeToggle = () => {
    const newMode = appMode === "demo" ? "real" : "demo";
    setAppMode(newMode);
    localStorage.setItem("sentinel_app_mode", newMode);
    window.dispatchEvent(new Event("modeChanged"));

    if (newMode === "demo") {
      router.push("/dashboard");
    } else {
      router.push("/field-setup");
    }
  };

  const activeLang = ((language === "ta" || language === "hi" || language === "en") ? language : "en") as SupportedLanguage;
  const tNav = TRANSLATIONS[activeLang]?.nav || TRANSLATIONS.en.nav;

  const navLinks = [
    { name: tNav.home, href: "/" },
    { name: tNav.selectLand, href: "/field-setup" },
    { name: tNav.dashboard, href: "/dashboard" },
    { name: tNav.scan, href: "/scan" },
    { name: tNav.results, href: "/results" },
    { name: tNav.history, href: "/history" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-200 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">{tNav.brand}</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">AI</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">{tNav.brandSub}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? "text-emerald-700 bg-emerald-50 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Mode Switcher, Status, Language */}
          <div className="hidden sm:flex items-center space-x-2.5">
            
            {/* Mode Switcher Toggle (Demo vs Real) */}
            <button
              onClick={handleModeToggle}
              title="Click to toggle between Demo Benchmark Mode and Real Live Field"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                appMode === "demo"
                  ? "bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100"
                  : "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
              }`}
            >
              <span>{appMode === "demo" ? tNav.demoMode : tNav.liveField}</span>
              <span className="text-[10px] font-normal opacity-75">{tNav.switch}</span>
            </button>

            {/* Status indicator */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
              <span className={`w-2 h-2 rounded-full ${backendStatus === "API Live" ? "bg-emerald-500 animate-pulse" : "bg-blue-500"}`}></span>
              <span className="text-[11px]">{backendStatus === "API Live" ? tNav.apiLive : tNav.localMode}</span>
            </div>

            {/* User Session Badge / Login Button */}
            {currentUser ? (
              <div className="flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl text-xs font-bold text-emerald-900">
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span>{currentUser.username}</span>
                <button
                  onClick={() => {
                    localStorage.removeItem("sentinel_user");
                    setCurrentUser(null);
                    window.dispatchEvent(new Event("userChanged"));
                    router.push("/login");
                  }}
                  title="Logout"
                  className="text-slate-400 hover:text-rose-600 ml-1 p-0.5"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>
            )}

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs font-medium">
              <button
                onClick={() => handleLangChange("en")}
                className={`px-2 py-1 rounded ${language === "en" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"}`}
              >
                EN
              </button>
              <button
                onClick={() => handleLangChange("ta")}
                className={`px-2 py-1 rounded ${language === "ta" ? "bg-white text-emerald-800 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"}`}
              >
                தமிழ்
              </button>
              <button
                onClick={() => handleLangChange("hi")}
                className={`px-2 py-1 rounded ${language === "hi" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"}`}
              >
                हिन्दी
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
            <span className="text-xs font-bold text-slate-700">Active Mode:</span>
            <button
              onClick={handleModeToggle}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                appMode === "demo" ? "bg-purple-600 text-white" : "bg-emerald-600 text-white"
              }`}
            >
              {appMode === "demo" ? "🚀 Demo Mode" : "🌾 Live Field"} (Switch)
            </button>
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Language:</span>
            <div className="flex space-x-1">
              <button onClick={() => handleLangChange("en")} className="px-2 py-1 text-xs font-bold bg-slate-100 rounded">EN</button>
              <button onClick={() => handleLangChange("ta")} className="px-2 py-1 text-xs font-bold bg-slate-100 rounded text-emerald-800">தமிழ்</button>
              <button onClick={() => handleLangChange("hi")} className="px-2 py-1 text-xs font-bold bg-slate-100 rounded">हिन्दी</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
