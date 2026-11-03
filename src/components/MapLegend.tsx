/**
 * TRINETRA — LAPTOP 1: SATELLITE OBSERVATION STATION
 * Compact Map Legend Component
 */

import React, { useState } from 'react';
import { HelpCircle, ChevronUp, ChevronDown } from 'lucide-react';
import type { OperatingMode } from '../types/index.ts';

interface MapLegendProps {
  mode: OperatingMode;
}

export const MapLegend: React.FC<MapLegendProps> = ({ mode }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <aside
      aria-label="Map Legend"
      className="absolute bottom-20 left-3 z-20 font-mono-tech select-none"
    >
      <div className="bg-slate-950/90 border border-slate-800 rounded-lg backdrop-blur-md shadow-xl overflow-hidden max-w-[240px]">
        {/* Legend Header */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full px-2.5 py-1.5 flex items-center justify-between bg-slate-900/90 text-slate-300 hover:text-white text-[10px] font-semibold tracking-wider cursor-pointer border-b border-slate-800"
        >
          <span className="flex items-center gap-1.5 uppercase">
            <HelpCircle className="w-3 h-3 text-cyan-400" />
            CARTOGRAPHIC LEGEND
          </span>
          {isCollapsed ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {/* Legend Items */}
        {!isCollapsed && (
          <div className="p-2 space-y-1.5 text-[9px] text-slate-300">
            {/* Rivers */}
            <div className="flex items-center gap-2">
              <span className="w-4 h-1 bg-cyan-400 rounded-full inline-block" />
              <span>Alaknanda & Dhauliganga Rivers</span>
            </div>

            {/* Roads */}
            <div className="flex items-center gap-2">
              <span className="w-4 h-1 bg-amber-400 rounded-full inline-block" />
              <span>NH-7 / Major Lifeline Roads</span>
            </div>

            {/* Bridges */}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 border border-slate-900 inline-block" />
              <span>Strategic Mountain Bridges</span>
            </div>

            {/* InSAR */}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-white inline-block shadow-sm" />
              <span>Sentinel-1 InSAR Subsidence Pt</span>
            </div>

            {/* Facilities */}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-white inline-block" />
              <span>Hospital / Health Trauma Unit</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white inline-block" />
              <span>SDRF Post / KV School Assembly</span>
            </div>

            {/* Landslide Scarp */}
            <div className="flex items-center gap-2">
              <span className="w-4 h-0.5 border-t-2 border-dashed border-red-500 inline-block" />
              <span>GSI Crown Tension Scarp</span>
            </div>

            {/* Simulation Overlays */}
            {mode === 'SIMULATION' && (
              <div className="pt-1 mt-1 border-t border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-sky-300">
                  <span className="w-3 h-3 bg-sky-500/50 border border-sky-400 rounded-sm inline-block" />
                  <span>Simulated Flood Inundation</span>
                </div>
                <div className="flex items-center gap-2 text-rose-300">
                  <span className="w-3 h-3 bg-rose-500/50 border border-rose-400 rounded-sm inline-block" />
                  <span>Simulated Debris Corridors</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
