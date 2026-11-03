/**
 * TRINETRA — LAPTOP 1: SATELLITE OBSERVATION STATION
 * Header Component
 */

import React, { useState, useEffect } from 'react';
import {
  Satellite,
  Radio,
  Wifi,
  WifiOff,
  AlertTriangle,
  Compass,
  Clock,
  Layers,
  MapPin,
  ShieldAlert,
} from 'lucide-react';
import type { OperatingMode, Laptop2Config, WeatherSatelliteStatus } from '../types/index.ts';

interface HeaderProps {
  mode: OperatingMode;
  onModeChange: (mode: OperatingMode) => void;
  laptop2Config: Laptop2Config;
  onOpenLaptop2Modal: () => void;
  activeBasemapName: string;
  mouseCoords: { lng: number; lat: number; elev?: number } | null;
  currentZoom: number;
  weatherSatelliteStatus: WeatherSatelliteStatus;
  isCloudSimulationActive?: boolean;
  onOpenAtmosphericPanel?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onModeChange,
  laptop2Config,
  onOpenLaptop2Modal,
  activeBasemapName,
  mouseCoords,
  currentZoom,
  weatherSatelliteStatus,
  isCloudSimulationActive,
  onOpenAtmosphericPanel,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short',
        })
      );
      setCurrentDate(
        now.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative z-30 bg-slate-950/95 border-b border-cyan-950/60 backdrop-blur-md px-4 py-2.5 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 select-none">
      {/* Station Branding & Identification */}
      <div className="flex items-center gap-3.5">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-950 via-slate-900 to-slate-950 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
          <Satellite className="w-5 h-5 text-cyan-400 animate-pulse" />
          <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950"></span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-lg tracking-wider font-bold text-white uppercase flex items-center gap-2">
              TRINETRA
              <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-cyan-950/90 text-cyan-300 border border-cyan-500/30">
                LAPTOP 1 // OBSERVATION STATION
              </span>
            </h1>
          </div>
          <p className="text-[11px] font-mono-tech text-slate-400 tracking-tight flex items-center gap-2">
            MULTI-HAZARD RISK INTELLIGENCE SYSTEM
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400/90">HIMALAYAN MONITORING GRID</span>
          </p>
        </div>
      </div>

      {/* Monitoring Area Banner */}
      <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono-tech">
        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
        <div>
          <div className="text-[10px] text-slate-400 uppercase tracking-widest">MONITORING AREA</div>
          <div className="text-slate-100 font-semibold tracking-wide flex items-center gap-1.5">
            JOSHIMATH – VISHNUPRAYAG
            <span className="text-[10px] text-slate-400 font-normal">(CHAMOLI, UTTARAKHAND)</span>
          </div>
        </div>
      </div>

      {/* Real-time Telemetry & Coordinates */}
      <div className="hidden xl:flex items-center gap-4 text-xs font-mono-tech text-slate-300 border-l border-slate-800/80 pl-4">
        <div>
          <div className="text-[9px] text-slate-400 uppercase">COORDINATES (WGS84)</div>
          <div className="text-cyan-300 font-medium">
            {mouseCoords
              ? `${mouseCoords.lat.toFixed(4)}°N, ${mouseCoords.lng.toFixed(4)}°E`
              : '30.5580°N, 79.5630°E'}
          </div>
        </div>

        <div>
          <div className="text-[9px] text-slate-400 uppercase">ZOOM</div>
          <div className="text-slate-100 font-semibold">{currentZoom.toFixed(1)}x</div>
        </div>

        <div>
          <div className="text-[9px] text-slate-400 uppercase">BASEMAP</div>
          <div className="text-amber-400 truncate max-w-[140px]">{activeBasemapName}</div>
        </div>
      </div>

      {/* Mode Switcher, Weather Satellite Status, Laptop 2 Status & Clock */}
      <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
        {/* Weather Satellite Status Indicator */}
        <div className="hidden sm:flex items-center">
          <button
            type="button"
            onClick={onOpenAtmosphericPanel}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-[10px] font-mono-tech flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Open Atmospheric Monitoring & Satellite Feed Details"
          >
            <span className="text-slate-400">WEATHER SATELLITE:</span>
            {weatherSatelliteStatus === 'CONNECTED' ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                CONNECTED
              </span>
            ) : weatherSatelliteStatus === 'DELAYED' ? (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                DELAYED
              </span>
            ) : (
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                UNAVAILABLE
              </span>
            )}

            {isCloudSimulationActive && (
              <span className="ml-1 px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-600/80 font-bold animate-pulse">
                SIM CLOUD
              </span>
            )}
          </button>
        </div>

        {/* Mode Selector Toggle */}
        <div className="inline-flex rounded-lg p-0.5 bg-slate-900 border border-slate-800">
          <button
            type="button"
            onClick={() => onModeChange('REAL_DATA')}
            className={`px-2.5 py-1 text-xs font-mono-tech rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
              mode === 'REAL_DATA'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3 h-3 text-cyan-400" />
            REAL DATA
          </button>
          <button
            type="button"
            onClick={() => onModeChange('SIMULATION')}
            className={`px-2.5 py-1 text-xs font-mono-tech rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
              mode === 'SIMULATION'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            SIMULATION
          </button>
        </div>

        {/* Laptop 2 Connection Button */}
        <button
          type="button"
          onClick={onOpenLaptop2Modal}
          className={`px-2.5 py-1 rounded-lg border text-xs font-mono-tech flex items-center gap-1.5 transition-all cursor-pointer ${
            laptop2Config.isConnected
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/50'
              : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
          }`}
          title="Configure Laptop 2 Command Center Link"
        >
          {laptop2Config.isConnected ? (
            <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-slate-400" />
          )}
          <span className="hidden sm:inline">LAPTOP 2:</span>
          <span className={laptop2Config.isConnected ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
            {laptop2Config.isConnected ? 'LINKED' : 'STANDBY'}
          </span>
        </button>

        {/* Clock & Date */}
        <div className="hidden sm:flex flex-col items-end text-right font-mono-tech border-l border-slate-800 pl-3">
          <div className="text-xs font-semibold text-slate-100 tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" />
            {currentTime || '12:00:00 UTC'}
          </div>
          <div className="text-[10px] text-slate-400">{currentDate}</div>
        </div>
      </div>
    </header>
  );
};
