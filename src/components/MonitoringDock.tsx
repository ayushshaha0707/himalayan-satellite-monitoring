/**
 * TRINETRA — LAPTOP 1: SATELLITE OBSERVATION STATION
 * Collapsible Bottom Monitoring Dock Toolbar
 */

import React, { useState } from 'react';
import {
  Radio,
  AlertTriangle,
  Camera,
  RotateCcw,
  Wifi,
  ChevronUp,
  ChevronDown,
  Layers,
  MapPin,
  FileSpreadsheet,
  Activity,
  Sliders,
  CheckCircle2,
  CloudRain,
} from 'lucide-react';
import type { OperatingMode, Laptop2Config } from '../types/index.ts';

interface MonitoringDockProps {
  mode: OperatingMode;
  onModeChange: (mode: OperatingMode) => void;
  onResetMap: () => void;
  onCaptureSnapshot: () => void;
  isCapturing: boolean;
  onOpenLaptop2Modal: () => void;
  onOpenCarryingCapacityModal: () => void;
  onOpenStudyAreaModal: () => void;
  onToggleSimulationPanel: () => void;
  isSimulationPanelOpen: boolean;
  onOpenAtmosphericPanel: () => void;
  isAtmosphericPanelOpen: boolean;
  laptop2Config: Laptop2Config;
  nextScheduledSeconds: number;
}

export const MonitoringDock: React.FC<MonitoringDockProps> = ({
  mode,
  onModeChange,
  onResetMap,
  onCaptureSnapshot,
  isCapturing,
  onOpenLaptop2Modal,
  onOpenCarryingCapacityModal,
  onOpenStudyAreaModal,
  onToggleSimulationPanel,
  isSimulationPanelOpen,
  onOpenAtmosphericPanel,
  isAtmosphericPanelOpen,
  laptop2Config,
  nextScheduledSeconds,
}) => {
  const [isDockExpanded, setIsDockExpanded] = useState<boolean>(true);

  return (
    <footer
      aria-label="Bottom Monitoring Toolbar"
      className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 select-none font-mono-tech max-w-[96vw]"
    >
      <div className="bg-slate-950/95 border border-cyan-900/60 rounded-xl backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden transition-all">
        {/* Toggle Bar / Top Tab */}
        <div className="flex items-center justify-between px-3 py-1 bg-slate-900/90 border-b border-slate-800 text-[10px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="font-semibold text-slate-200 uppercase tracking-widest text-[9px]">
              OBSERVATION DOCK // TRINETRA-01
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsDockExpanded(!isDockExpanded)}
            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-[9px] uppercase font-bold"
          >
            <span>{isDockExpanded ? 'HIDE CONTROLS' : 'EXPAND CONTROLS'}</span>
            {isDockExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </button>
        </div>

        {/* Primary Action Buttons */}
        {isDockExpanded && (
          <div className="p-2 flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
            {/* 1. REAL DATA MODE */}
            <button
              type="button"
              onClick={() => onModeChange('REAL_DATA')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                mode === 'REAL_DATA'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>REAL DATA MODE</span>
            </button>

            {/* 2. DISASTER SIMULATION MODE */}
            <button
              type="button"
              onClick={() => onModeChange('SIMULATION')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                mode === 'SIMULATION'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>DISASTER SIMULATION MODE</span>
            </button>

            {/* If in simulation mode, allow toggling the parameter sliders panel */}
            {mode === 'SIMULATION' && (
              <button
                type="button"
                onClick={onToggleSimulationPanel}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-500/60 flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{isSimulationPanelOpen ? 'CLOSE SLIDERS' : 'ADJUST SLIDERS'}</span>
              </button>
            )}

            <div className="h-4 w-px bg-slate-800 hidden md:block" />

            {/* 3. SELECT STUDY AREA */}
            <button
              type="button"
              onClick={onOpenStudyAreaModal}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>STUDY AREA</span>
            </button>

            {/* 4. RESET MAP */}
            <button
              type="button"
              onClick={onResetMap}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Reset Zoom & Extent to Joshimath-Vishnuprayag"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span>RESET MAP</span>
            </button>

            {/* 5. CAPTURE MAP */}
            <button
              type="button"
              onClick={onCaptureSnapshot}
              disabled={isCapturing}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Camera className={`w-3.5 h-3.5 ${isCapturing ? 'animate-spin' : ''}`} />
              <span>{isCapturing ? 'TRANSMITTING...' : 'CAPTURE MAP'}</span>
            </button>

            {/* 6. LAPTOP 2 CONNECTION */}
            <button
              type="button"
              onClick={onOpenLaptop2Modal}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                laptop2Config.isConnected
                  ? 'bg-slate-900 text-emerald-400 border-emerald-500/50'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>LAPTOP 2 CONNECTION</span>
              {laptop2Config.autoTransmit && (
                <span className="text-[10px] px-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {nextScheduledSeconds}s
                </span>
              )}
            </button>

            {/* 7. CARRYING CAPACITY ASSESSMENT */}
            <button
              type="button"
              onClick={onOpenCarryingCapacityModal}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900/90 text-purple-300 hover:text-purple-200 border border-purple-900/60 hover:bg-purple-950/60 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-purple-400" />
              <span>CARRYING CAPACITY</span>
            </button>

            {/* 8. ATMOSPHERIC & CYCLONE MONITORING */}
            <button
              type="button"
              onClick={onOpenAtmosphericPanel}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                isAtmosphericPanelOpen
                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)] font-semibold'
                  : 'bg-slate-900/90 text-cyan-300 hover:text-white border border-cyan-900/60 hover:bg-cyan-950/60'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
              <span>ATMOSPHERIC MONITORING</span>
            </button>
          </div>
        )}
      </div>
    </footer>
  );
};
