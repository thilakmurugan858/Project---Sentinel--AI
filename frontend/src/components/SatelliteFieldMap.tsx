"use client";

import React, { useEffect, useRef, useState } from "react";
import { 
  Search, 
  MapPin, 
  Crosshair, 
  Layers, 
  Trash2, 
  Undo, 
  CheckCircle2, 
  Sparkles,
  Maximize2,
  HelpCircle,
  Compass
} from "lucide-react";

interface SatelliteFieldMapProps {
  initialCenter: [number, number]; // [lat, lon]
  initialPolygon?: [number, number][]; // [[lat, lon], ...]
  onPolygonChange: (coords: [number, number][], areaAcres: number, center: [number, number]) => void;
}

export default function SatelliteFieldMap({
  initialCenter,
  initialPolygon,
  onPolygonChange
}: SatelliteFieldMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const polygonLayerRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);

  // Search & Navigation state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentBasemap, setCurrentBasemap] = useState<"google_hybrid" | "esri_sat" | "osm">("google_hybrid");

  // Manual Coordinates
  const [manualLat, setManualLat] = useState<string>(initialCenter[0].toString());
  const [manualLon, setManualLon] = useState<string>(initialCenter[1].toString());
  const [showCoordInput, setShowCoordInput] = useState(false);

  // Field Marking Mode
  // 'tap_acre' = 1-Click Tap on field & select acreage (Recommended for Farmers)
  // 'custom_corners' = Click individual corners (Expert / Irregular)
  const [markingMode, setMarkingMode] = useState<"tap_acre" | "custom_corners">("tap_acre");
  const [acreageSelection, setAcreageSelection] = useState<number>(1.5);
  const [polygonPoints, setPolygonPoints] = useState<[number, number][]>(
    initialPolygon && initialPolygon.length > 2 
      ? initialPolygon 
      : []
  );
  const [calculatedArea, setCalculatedArea] = useState<number>(1.5);
  const [fieldCenter, setFieldCenter] = useState<[number, number]>(initialCenter);

  // 1. Initialize Leaflet Map (Client-Side Only)
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let L: any;
    let map: any;

    import("leaflet").then((leafletModule) => {
      L = leafletModule.default || leafletModule;

      // Fix default marker icon paths in Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 16,
        zoomControl: false,
      });

      // Add Zoom Control on Top-Right
      L.control.zoom({ position: "topright" }).addTo(map);

      // Basemap layers
      // Google Satellite Hybrid (Google Maps Satellite with clean road & place labels)
      const googleHybrid = L.tileLayer(
        "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
        {
          maxZoom: 20,
          attribution: "Google Maps Satellite"
        }
      );

      // Esri Satellite Fallback
      const esriSat = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 19,
          attribution: "Esri World Imagery"
        }
      );

      // OpenStreetMap Standard
      const osmStreet = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 19,
          attribution: "OpenStreetMap"
        }
      );

      // Add default basemap
      googleHybrid.addTo(map);

      mapInstanceRef.current = map;
      (map as any)._basemapLayers = {
        google_hybrid: googleHybrid,
        esri_sat: esriSat,
        osm: osmStreet
      };

      // Layer groups for polygon and markers
      polygonLayerRef.current = L.polygon([], {
        color: "#10b981",
        fillColor: "#10b981",
        fillOpacity: 0.35,
        weight: 3,
        dashArray: "4, 4"
      }).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);

      // Initial default polygon if none given: generate around initial center
      if (!initialPolygon || initialPolygon.length < 3) {
        generateAcrePolygon(initialCenter, 1.5, L, map);
      } else {
        renderPolygon(initialPolygon, L, map);
      }

      // Map Click Handler
      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng;
        handleMapClick(lat, lng, L, map);
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map center when district changes
  useEffect(() => {
    if (mapInstanceRef.current && initialCenter) {
      mapInstanceRef.current.flyTo(initialCenter, 16, { duration: 1.2 });
      setManualLat(initialCenter[0].toFixed(5));
      setManualLon(initialCenter[1].toFixed(5));
      setFieldCenter(initialCenter);

      // If in tap_acre mode, auto-generate around new center
      import("leaflet").then((leafletModule) => {
        const L = leafletModule.default || leafletModule;
        generateAcrePolygon(initialCenter, acreageSelection, L, mapInstanceRef.current);
      });
    }
  }, [initialCenter[0], initialCenter[1]]);

  // Change Basemap
  const changeBasemap = (type: "google_hybrid" | "esri_sat" | "osm") => {
    setCurrentBasemap(type);
    const map = mapInstanceRef.current;
    if (!map || !(map as any)._basemapLayers) return;

    Object.values((map as any)._basemapLayers).forEach((layer: any) => {
      map.removeLayer(layer);
    });

    (map as any)._basemapLayers[type].addTo(map);
  };

  // 1-Click Acreage Polygon Generator around a Center Coordinate
  // 1 Acre = 4046.86 m^2 -> side approx 63.6m -> in degrees approx 0.00057 deg lat, 0.00058 deg lon
  const generateAcrePolygon = (
    center: [number, number],
    acres: number,
    L?: any,
    map?: any
  ) => {
    const lat = center[0];
    const lon = center[1];
    
    // Scale side length based on sqrt of acreage
    const halfSideMeters = Math.sqrt(acres * 4046.86) / 2.0;
    const latOffset = halfSideMeters / 111139.0;
    const lonOffset = halfSideMeters / (111139.0 * Math.cos(lat * Math.PI / 180));

    const points: [number, number][] = [
      [Number((lat + latOffset).toFixed(6)), Number((lon - lonOffset).toFixed(6))], // Top-Left
      [Number((lat + latOffset).toFixed(6)), Number((lon + lonOffset).toFixed(6))], // Top-Right
      [Number((lat - latOffset).toFixed(6)), Number((lon + lonOffset).toFixed(6))], // Bottom-Right
      [Number((lat - latOffset).toFixed(6)), Number((lon - lonOffset).toFixed(6))]  // Bottom-Left
    ];

    setPolygonPoints(points);
    setCalculatedArea(acres);
    setFieldCenter(center);
    onPolygonChange(points, acres, center);

    if (L && map) {
      renderPolygon(points, L, map);
    }
  };

  // Render polygon & draggable vertex pins
  const renderPolygon = (points: [number, number][], L: any, map: any) => {
    if (!polygonLayerRef.current || !markersGroupRef.current) return;

    polygonLayerRef.current.setLatLngs(points);
    markersGroupRef.current.clearLayers();

    // Create corner vertex markers with draggable behavior
    points.forEach((pt, index) => {
      const customIcon = L.divIcon({
        className: "custom-vertex-pin",
        html: `<div style="
          width: 14px; 
          height: 14px; 
          background: #10b981; 
          border: 2px solid white; 
          border-radius: 50%; 
          box-shadow: 0 2px 6px rgba(0,0,0,0.5);
          cursor: grab;
        "></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      const marker = L.marker(pt, {
        icon: customIcon,
        draggable: true
      }).addTo(markersGroupRef.current);

      marker.on("dragend", (e: any) => {
        const newLatLng = e.target.getLatLng();
        const updatedPoints = [...points];
        updatedPoints[index] = [
          Number(newLatLng.lat.toFixed(6)),
          Number(newLatLng.lng.toFixed(6))
        ];
        setPolygonPoints(updatedPoints);
        
        // Recalculate area
        const newArea = calculatePolygonAreaAcres(updatedPoints);
        setCalculatedArea(newArea);
        
        const newCenter = calculateCentroid(updatedPoints);
        setFieldCenter(newCenter);
        onPolygonChange(updatedPoints, newArea, newCenter);

        polygonLayerRef.current.setLatLngs(updatedPoints);
      });
    });
  };

  // Handle clicks on map based on active mode
  const handleMapClick = (lat: number, lng: number, L: any, map: any) => {
    if (markingMode === "tap_acre") {
      // 1-Click: Place center and enclose field with chosen acreage
      const newCenter: [number, number] = [Number(lat.toFixed(6)), Number(lng.toFixed(6))];
      setManualLat(newCenter[0].toString());
      setManualLon(newCenter[1].toString());
      generateAcrePolygon(newCenter, acreageSelection, L, map);
    } else {
      // Custom Corners: Add corner point
      if (polygonPoints.length >= 8) {
        alert("Maximum 8 boundary corners reached.");
        return;
      }
      const newPt: [number, number] = [Number(lat.toFixed(6)), Number(lng.toFixed(6))];
      const updated = [...polygonPoints, newPt];
      setPolygonPoints(updated);
      const newArea = calculatePolygonAreaAcres(updated);
      setCalculatedArea(newArea);
      const newCenter = calculateCentroid(updated);
      setFieldCenter(newCenter);
      onPolygonChange(updated, newArea, newCenter);
      renderPolygon(updated, L, map);
    }
  };

  // Calculate polygon area in acres using spherical polygon formula
  const calculatePolygonAreaAcres = (points: [number, number][]): number => {
    if (points.length < 3) return 0;
    const earthRadius = 6378137; // meters
    let total = 0;

    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      const lat1 = (p1[0] * Math.PI) / 180;
      const lat2 = (p2[0] * Math.PI) / 180;
      const lon1 = (p1[1] * Math.PI) / 180;
      const lon2 = (p2[1] * Math.PI) / 180;
      total += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2));
    }
    const areaSqMeters = Math.abs((total * earthRadius * earthRadius) / 2.0);
    const acres = areaSqMeters / 4046.86;
    return Number(acres.toFixed(2));
  };

  const calculateCentroid = (points: [number, number][]): [number, number] => {
    if (points.length === 0) return initialCenter;
    let latSum = 0;
    let lonSum = 0;
    points.forEach(p => {
      latSum += p[0];
      lonSum += p[1];
    });
    return [
      Number((latSum / points.length).toFixed(6)),
      Number((lonSum / points.length).toFixed(6))
    ];
  };

  // Change Acreage Selection (in Tap & Acre mode)
  const handleAcreageChange = (acres: number) => {
    setAcreageSelection(acres);
    import("leaflet").then((leafletModule) => {
      const L = leafletModule.default || leafletModule;
      generateAcrePolygon(fieldCenter, acres, L, mapInstanceRef.current);
    });
  };

  // Geocoding / Location Search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const query = `${searchQuery}, Tamil Nadu, India`;
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;
      const res = await fetch(url);
      const data = await res.json();
      setSearchResults(data);

      if (data.length > 0) {
        selectSearchResult(data[0]);
      }
    } catch (err) {
      console.error("Geocoding failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  const selectSearchResult = (item: any) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    const newCenter: [number, number] = [lat, lon];
    
    setManualLat(lat.toFixed(5));
    setManualLon(lon.toFixed(5));
    setSearchResults([]);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(newCenter, 17, { duration: 1.5 });
      import("leaflet").then((leafletModule) => {
        const L = leafletModule.default || leafletModule;
        generateAcrePolygon(newCenter, acreageSelection, L, mapInstanceRef.current);
      });
    }
  };

  // Use GPS Location Button
  const handleDetectGPS = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      alert("GPS Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const newCenter: [number, number] = [Number(lat.toFixed(6)), Number(lon.toFixed(6))];

        setManualLat(lat.toFixed(5));
        setManualLon(lon.toFixed(5));

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo(newCenter, 18, { duration: 1.5 });
          import("leaflet").then((leafletModule) => {
            const L = leafletModule.default || leafletModule;
            generateAcrePolygon(newCenter, acreageSelection, L, mapInstanceRef.current);
          });
        }
      },
      (err) => {
        alert(`GPS detection error: ${err.message}. Please search by village or enter coordinates.`);
      },
      { enableHighAccuracy: true }
    );
  };

  // Manual Coordinates Jump
  const handleManualCoordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(manualLat);
    const lon = parseFloat(manualLon);
    if (isNaN(lat) || isNaN(lon)) return;

    const newCenter: [number, number] = [lat, lon];
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(newCenter, 17, { duration: 1.5 });
      import("leaflet").then((leafletModule) => {
        const L = leafletModule.default || leafletModule;
        generateAcrePolygon(newCenter, acreageSelection, L, mapInstanceRef.current);
      });
    }
  };

  const handleReset = () => {
    setPolygonPoints([]);
    setCalculatedArea(0);
    if (polygonLayerRef.current) polygonLayerRef.current.setLatLngs([]);
    if (markersGroupRef.current) markersGroupRef.current.clearLayers();
  };

  return (
    <div className="space-y-4">
      
      {/* 1. Google Maps Style Search & Navigation Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row gap-2">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search village, town, taluk, or PIN in Tamil Nadu (e.g. Orathanadu, Needamangalam)..."
            className="w-full pl-10 pr-24 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <button
            type="submit"
            disabled={isSearching}
            className="absolute right-1.5 top-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center space-x-1"
          >
            {isSearching ? (
              <span className="animate-spin text-xs">🌀</span>
            ) : (
              <span>Search</span>
            )}
          </button>

          {/* Autocomplete dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-12 left-0 right-0 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden divide-y divide-slate-100">
              {searchResults.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => selectSearchResult(item)}
                  className="p-3 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 cursor-pointer flex items-center space-x-2"
                >
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">{item.display_name}</span>
                </div>
              ))}
            </div>
          )}
        </form>

        {/* GPS Button & Basemap Switcher */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={handleDetectGPS}
            title="Use current GPS location"
            className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold shadow-sm flex items-center space-x-1.5"
          >
            <Crosshair className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Use GPS</span>
          </button>

          {/* Basemap Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => changeBasemap("google_hybrid")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                currentBasemap === "google_hybrid" ? "bg-white text-slate-900 shadow-sm font-bold" : "text-slate-600"
              }`}
            >
              Satellite
            </button>
            <button
              type="button"
              onClick={() => changeBasemap("osm")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                currentBasemap === "osm" ? "bg-white text-slate-900 shadow-sm font-bold" : "text-slate-600"
              }`}
            >
              Map
            </button>
          </div>
        </div>
      </div>

      {/* 2. Farmer-Friendly Marking Mode Selection Toolbar */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        
        <div className="flex items-center space-x-2">
          <span className="font-bold text-emerald-950">Field Marking Mode:</span>
          <div className="flex bg-white rounded-lg p-0.5 border border-emerald-300 shadow-xs">
            <button
              type="button"
              onClick={() => setMarkingMode("tap_acre")}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                markingMode === "tap_acre" 
                  ? "bg-emerald-600 text-white shadow-sm" 
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🌾 1-Click Tap & Acreage (Easy)
            </button>
            <button
              type="button"
              onClick={() => setMarkingMode("custom_corners")}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                markingMode === "custom_corners" 
                  ? "bg-emerald-600 text-white shadow-sm" 
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ✏️ Draw Corners
            </button>
          </div>
        </div>

        {/* Acreage Quick Selectors (Active when in Tap & Acre mode) */}
        {markingMode === "tap_acre" ? (
          <div className="flex items-center space-x-1.5 flex-wrap">
            <span className="text-slate-600 font-medium">Acre Size:</span>
            {[0.5, 1.0, 1.5, 2.0, 3.0, 5.0].map((ac) => (
              <button
                key={ac}
                type="button"
                onClick={() => handleAcreageChange(ac)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  acreageSelection === ac 
                    ? "bg-emerald-700 text-white" 
                    : "bg-white text-slate-700 hover:bg-emerald-100 border border-slate-200"
                }`}
              >
                {ac} ac
              </button>
            ))}
          </div>
        ) : (
          <div className="text-[11px] text-slate-500">
            Click on map to place boundary pins (3 to 8 points). Drag green pins to adjust.
          </div>
        )}

      </div>

      {/* 3. The Real Satellite Map Container */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-slate-300 shadow-md h-[400px] sm:h-[460px] bg-slate-900">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Map Legend & Telemetry Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md text-white p-3 rounded-xl border border-slate-700 text-xs space-y-1.5 shadow-lg max-w-xs z-[1000]">
          <div className="flex items-center justify-between font-bold text-emerald-400">
            <span className="flex items-center space-x-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Real Google Satellite View</span>
            </span>
            <span className="text-[10px] bg-emerald-950 px-1.5 py-0.5 rounded text-emerald-300 border border-emerald-800">
              High-Res
            </span>
          </div>
          <div className="text-[11px] text-slate-300 flex justify-between">
            <span>Enclosed Area:</span>
            <strong className="text-white font-mono">{calculatedArea} Acres (~{(calculatedArea * 0.4047).toFixed(2)} Ha)</strong>
          </div>
          <div className="text-[11px] text-slate-300 flex justify-between">
            <span>Center Lat/Lon:</span>
            <span className="font-mono text-[10px] text-emerald-300">{fieldCenter[0].toFixed(4)}°N, {fieldCenter[1].toFixed(4)}°E</span>
          </div>
          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-700/60 flex items-center justify-between">
            <span>Estimated Pure Pixels:</span>
            <strong className="text-emerald-400">~{Math.max(12, Math.round(calculatedArea * 24))} Pixels</strong>
          </div>
        </div>

        {/* Clear / Reset Button */}
        <button
          type="button"
          onClick={handleReset}
          className="absolute top-3 right-12 z-[1000] px-2.5 py-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-700 hover:text-rose-600 text-xs font-semibold shadow-md flex items-center space-x-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>

        {/* Instruction overlay for farmers */}
        <div className="absolute top-3 left-3 z-[1000] bg-black/70 backdrop-blur text-white text-[11px] px-3 py-1.5 rounded-lg border border-white/20 hidden sm:flex items-center space-x-1.5">
          <span>💡 <strong>Farmer Tip:</strong> Tap your field on satellite to auto-enclose, then drag green corner pins to align with paddy bunds.</span>
        </div>
      </div>

      {/* 4. Manual Coordinate Fallback Toggle */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowCoordInput(!showCoordInput)}
          className="text-xs text-slate-500 hover:text-emerald-700 font-medium underline flex items-center space-x-1"
        >
          <span>{showCoordInput ? "Hide coordinate inputs" : "Have exact GPS Latitude & Longitude? Enter coordinates directly"}</span>
        </button>

        {showCoordInput && (
          <form onSubmit={handleManualCoordSubmit} className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 text-xs">
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Latitude</label>
              <input
                type="text"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                placeholder="e.g. 10.7870"
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 w-32 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Longitude</label>
              <input
                type="text"
                value={manualLon}
                onChange={(e) => setManualLon(e.target.value)}
                placeholder="e.g. 79.1378"
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 w-32 font-mono"
              />
            </div>
            <button
              type="submit"
              className="mt-4 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold"
            >
              Go to Coordinates
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
