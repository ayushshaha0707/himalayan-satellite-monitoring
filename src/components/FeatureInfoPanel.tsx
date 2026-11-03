/**
 * TRINETRA — LAPTOP 1: SATELLITE OBSERVATION STATION
 * Feature Inspection Panel
 * Shows real mapped attributes, source provenance, geometry, and honest missing data states.
 */

import React from 'react';
import { X, MapPin, Database, Crosshair, ExternalLink, ShieldCheck, HelpCircle } from 'lucide-react';
import type { SelectedFeature } from '../types/index.ts';

interface FeatureInfoPanelProps {
  feature: SelectedFeature | null;
  onClose: () => void;
  onZoomToFeature: (coordinates: [number, number]) => void;
}

export const FeatureInfoPanel: React.FC<FeatureInfoPanelProps> = ({
  feature,
  onClose,
  onZoomToFeature,
}) => {
  if (!feature) return null;

  // Filter out internal/duplicate properties for clean inspection
  const excludedKeys = ['id', 'name', 'category', 'coordinates', 'geometryType'];
  const attributeEntries = Object.entries(feature.properties || {}).filter(
    ([k]) => !excludedKeys.includes(k)
  );

  return (
    <aside
      aria-label="Feature Inspection"
      className="absolute top-14 right-3 z-30 w-80 md:w-96 max-h-[calc(100vh-140px)] flex flex-col bg-slate-950/95 border border-cyan-800/60 rounded-lg backdrop-blur-md shadow-2xl font-mono-tech text-xs select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900 border-b border-slate-800 rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
          <span className="font-display font-semibold text-cyan-300 uppercase tracking-wider text-xs">
            FEATURE INSPECTION
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Feature Inspection panel"
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3.5 space-y-3 overflow-y-auto">
        {/* Title & Classification */}
        <div>
          <div className="text-[10px] text-cyan-400 uppercase tracking-widest font-semibold">
            {feature.type || 'GEOGRAPHIC FEATURE'}
          </div>
          <h2 className="text-sm font-bold text-slate-100 mt-0.5 leading-snug">
            {feature.name || 'Unnamed Mapped Feature'}
          </h2>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Feature ID: <span className="text-slate-300">{feature.id}</span>
          </div>
        </div>

        {/* Spatial Coordinates & Geometry */}
        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-rose-400" /> GEODETIC POSITION:
            </span>
            <span className="text-cyan-300 font-semibold">
              {feature.coordinates[1].toFixed(5)}°N, {feature.coordinates[0].toFixed(5)}°E
            </span>
          </div>

          {feature.elevationMeters && (
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">ELEVATION (APPROX):</span>
              <span className="text-emerald-400 font-semibold">{feature.elevationMeters} m ASL</span>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">GEOMETRY TYPE:</span>
            <span className="text-slate-300 uppercase">{feature.geometryType}</span>
          </div>

          <button
            type="button"
            onClick={() => onZoomToFeature(feature.coordinates)}
            className="w-full mt-2 py-1.5 px-2 rounded bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-[11px]"
          >
            <Crosshair className="w-3.5 h-3.5" />
            Center Map on Feature
          </button>
        </div>

        {/* Verified Data Source Attribution */}
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-400 uppercase text-[10px] font-semibold mb-1">
            <Database className="w-3 h-3 text-cyan-400" />
            VERIFIED DATA PROVENANCE
          </div>
          <p className="text-slate-200 leading-relaxed font-sans text-xs">
            {feature.sourceDataset}
          </p>
        </div>

        {/* Detailed Attributes */}
        <div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5">
            VERIFIED ATTRIBUTES ({attributeEntries.length})
          </div>
          <div className="rounded-lg bg-slate-900/90 border border-slate-800 divide-y divide-slate-800/80">
            {attributeEntries.length > 0 ? (
              attributeEntries.map(([key, val]) => (
                <div key={key} className="p-2 flex flex-col gap-0.5">
                  <span className="text-[9px] text-slate-400 uppercase">{key}:</span>
                  <span className="text-slate-200 break-words font-medium text-[11px]">
                    {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-2.5 text-slate-400 italic text-[11px] flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                No additional secondary attributes recorded in primary dataset.
              </div>
            )}
          </div>
        </div>

        {/* Scientific / Honest Data Standard Note */}
        <div className="p-2 rounded bg-slate-950/80 border border-slate-800 text-[9px] text-slate-400 leading-normal flex items-start gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            TRINETRA Scientific Integrity: Missing attributes reflect absence of documented survey data, not real-world absence. No synthetic estimates are inserted.
          </span>
        </div>
      </div>
    </aside>
  );
};
