import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Sentinel AI — Multimodal Crop Stress Monitoring Platform",
  description: "Continuous satellite-first crop-stress monitoring & leaf disease diagnosis for Tamil Nadu paddy farmers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© 2026 Sentinel AI — Autonomous Satellite Crop Monitoring Platform for Tamil Nadu Paddy Farmers</p>
            <div className="flex items-center space-x-4">
              <span>Paddy Only (Oryza sativa)</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">All-Weather Satellite Guard</span>
              <span>•</span>
              <a 
                href="/Ml_report_858.pdf" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-500 hover:text-emerald-700 font-medium underline underline-offset-2"
              >
                📄 Technical Report (PDF)
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
