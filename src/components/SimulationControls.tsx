/**
 * TRINETRA — LAPTOP 1: SATELLITE OBSERVATION STATION
 * Disaster Simulation Controls & Scenario Modeling
 */

import React from 'react';
import {
  AlertTriangle,
  CloudRain,
  Droplet,
  Waves,
  TrendingDown,
  Building2,
  GitBranch,
  ShieldAlert,
  Flame,
  Info,
} from 'lucide-react';
import type { SimulationParameters, SimulationImpact } from '../types/index.ts';

interface SimulationControlsProps {
  parameters: SimulationParameters;
  onChangeParameters: (params: SimulationParameters) => void;
  impact: SimulationImpact;
  isOpen: boolean;
  onClose: () => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  parameters,
  onChangeParameters,
  impact,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const updateParam = <K extends keyof SimulationParameters>(key: K, value: SimulationParameters[K]) => {
    onChangeParameters({
      ...parameters,
      [key]: value,
    });
  };

  const getStressBadge = (level: SimulationImpact['carryingCapacityStressLevel']) => {
    switch (level) {
      case 'SEVERE_EXCEEDED':
        return { text: 'SEVERE CARRYING CAPACITY EXCEEDED', color: 'bg-rose-950 text-rose-300 border-rose-500/80 animate-pulse' };
      case 'CRITICAL':
        return { text: 'CRITICAL SLOPE STRESS', color: 'bg-amber-950 text-amber-300 border-amber-500/80' };
      default:
        return { text: 'MODERATE ELEVATED LOAD', color: 'bg-emerald-950 text-emerald-300 border-emerald-500/60' };
    }
  };

  const stressBadge = getStressBadge(impact.carryingCapacityStressLevel);

  return (
    <div className="absolute top-14 right-3 z-30 w-84 md:w-96 max-h-[calc(100vh-140px)] flex flex-col bg-slate-950/95 border border-amber-500/60 rounded-lg backdrop-blur-md shadow-2xl font-mono-tech text-xs select-none">
      {/* Header with Mandatory Warning */}
      <div className="p-3 bg-amber-950/80 border-b border-amber-500/50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 animate-bounce" />
            <span className="font-display font-bold text-amber-300 uppercase tracking-wider text-xs">
              DISASTER SIMULATION ENGINE
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-amber-400 hover:text-white px-2 py-0.5 rounded bg-amber-900/50 text-[10px] cursor-pointer"
          >
            Hide
          </button>
        </div>

        <div className="mt-2 p-1.5 rounded bg-black/60 border border-amber-500/40 text-[9px] text-amber-300 leading-tight">
          ⚠️ SIMULATION — NOT A REAL-WORLD OBSERVATION OR OFFICIAL WARNING.
        </div>
      </div>

      {/* Sliders & Parameters */}
      <div className="p-3.5 space-y-3.5 overflow-y-auto">
        {/* Preset Scenario Selector */}
        <div>
          <label className="text-[10px] text-slate-400 uppercase font-semibold mb-1.5 block">
            SELECT HAZARD SCENARIO PRESET:
          </label>
          <div className="grid grid-cols-3 gap-1.5 text-[10px]">
            <button
              type="button"
              onClick={() =>
                onChangeParameters({
                  rainfallMm24h: 180,
                  soilMoistureSaturationPct: 88,
                  riverDischargeCumecs: 1650,
                  slopeFailureThreshold: 0.35,
                  hazardScenario: 'MONSOON_SURGE',
                })
              }
              className={`p-1.5 rounded border text-center transition-all cursor-pointer ${
                parameters.hazardScenario === 'MONSOON_SURGE'
                  ? 'bg-amber-950/80 text-amber-300 border-amber-400 font-bold'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              Monsoon Surge
            </button>
            <button
              type="button"
              onClick={() =>
                onChangeParameters({
                  rainfallMm24h: 40,
                  soilMoistureSaturationPct: 60,
                  riverDischargeCumecs: 2600,
                  slopeFailureThreshold: 0.5,
                  hazardScenario: 'GLOF_FLASH_FLOOD',
                })
              }
              className={`p-1.5 rounded border text-center transition-all cursor-pointer ${
                parameters.hazardScenario === 'GLOF_FLASH_FLOOD'
                  ? 'bg-rose-950/80 text-rose-300 border-rose-400 font-bold'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              GLOF Flood
            </button>
            <button
              type="button"
              onClick={() =>
                onChangeParameters({
                  rainfallMm24h: 110,
                  soilMoistureSaturationPct: 92,
                  riverDischargeCumecs: 800,
                  slopeFailureThreshold: 0.22,
                  hazardScenario: 'SLOPE_REACTIVATION',
                })
              }
              className={`p-1.5 rounded border text-center transition-all cursor-pointer ${
                parameters.hazardScenario === 'SLOPE_REACTIVATION'
                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-400 font-bold'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              Slope Failure
            </button>
          </div>
        </div>

        {/* 1. Rainfall Intensity Slider */}
        <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-300 flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
              24-Hour Rainfall Intensity:
            </span>
            <span className="text-cyan-300 font-bold">{parameters.rainfallMm24h} mm/day</span>
          </div>
          <input
            type="range"
            min="0"
            max="300"
            step="5"
            value={parameters.rainfallMm24h}
            onChange={(e) => updateParam('rainfallMm24h', Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-slate-400">
            <span>0 (Dry)</span>
            <span>120 (Monsoon Cloudburst)</span>
            <span>300 (Extreme)</span>
          </div>
        </div>

        {/* 2. Soil Moisture Saturation Slider */}
        <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-sky-400" />
              Soil Moisture Saturation:
            </span>
            <span className="text-sky-300 font-bold">{parameters.soilMoistureSaturationPct}%</span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            step="2"
            value={parameters.soilMoistureSaturationPct}
            onChange={(e) => updateParam('soilMoistureSaturationPct', Number(e.target.value))}
            className="w-full accent-sky-400 cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-slate-400">
            <span>20% (Stable)</span>
            <span>60% (Moist)</span>
            <span>100% (Liquefaction Risk)</span>
          </div>
        </div>

        {/* 3. River Discharge / Inflow Slider */}
        <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5 text-blue-400" />
              River Inflow (Alaknanda + Dhauli):
            </span>
            <span className="text-blue-300 font-bold">{parameters.riverDischargeCumecs} m³/s</span>
          </div>
          <input
            type="range"
            min="200"
            max="3000"
            step="50"
            value={parameters.riverDischargeCumecs}
            onChange={(e) => updateParam('riverDischargeCumecs', Number(e.target.value))}
            className="w-full accent-blue-400 cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-slate-400">
            <span>200 (Normal Low)</span>
            <span>1200 (High Flood)</span>
            <span>3000 (Flash Flood)</span>
          </div>
        </div>

        {/* 4. Slope Shear Failure Factor Slider */}
        <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-300 flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
              Slope Shear Resistance Index:
            </span>
            <span className="text-rose-300 font-bold">{parameters.slopeFailureThreshold.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.10"
            max="0.95"
            step="0.05"
            value={parameters.slopeFailureThreshold}
            onChange={(e) => updateParam('slopeFailureThreshold', Number(e.target.value))}
            className="w-full accent-rose-400 cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-slate-400">
            <span>0.10 (Severe Instability)</span>
            <span>0.50 (Critical)</span>
            <span>0.95 (Bedrock)</span>
          </div>
        </div>

        {/* Calculated Simulation Impacts */}
        <div className="p-3 rounded-lg bg-slate-900/95 border border-slate-700 space-y-2">
          <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-between">
            <span>SIMULATED SCENARIO EXPOSURE</span>
            <span className="text-[9px] text-amber-400 font-normal">Calculated Live</span>
          </div>

          <div className={`p-1.5 rounded border text-[10px] font-bold text-center ${stressBadge.color}`}>
            {stressBadge.text}
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
              <div className="text-[9px] text-slate-400 uppercase">ESTIMATED EXPOSED BLDGS</div>
              <div className="text-rose-400 font-bold text-base mt-0.5">
                {impact.buildingsExposedCount}
              </div>
            </div>

            <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
              <div className="text-[9px] text-slate-400 uppercase">EXPOSED ROADWAYS</div>
              <div className="text-amber-400 font-bold text-base mt-0.5">
                {impact.roadLengthExposedKm} km
              </div>
            </div>
          </div>

          {impact.criticalBridgesAtRisk.length > 0 && (
            <div className="p-2 rounded bg-rose-950/40 border border-rose-800/60 text-[10px] space-y-1">
              <span className="text-rose-300 font-semibold block">⚠️ STRATEGIC BRIDGES AT RISK:</span>
              <ul className="list-disc list-inside text-rose-200">
                {impact.criticalBridgesAtRisk.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          )}

          {impact.recommendedEvacuationSectors.length > 0 && (
            <div className="p-2 rounded bg-amber-950/40 border border-amber-800/60 text-[10px] space-y-1">
              <span className="text-amber-300 font-semibold block">PRIORITY RELOCATION SECTORS:</span>
              <ul className="list-disc list-inside text-amber-200">
                {impact.recommendedEvacuationSectors.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
