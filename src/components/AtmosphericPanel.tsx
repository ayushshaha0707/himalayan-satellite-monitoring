/**
 * TRINETRA — LAPTOP 1: SATELLITE OBSERVATION STATION
 * ATMOSPHERIC & CYCLONE MONITORING PANEL
 * Sources: ISRO MOSDAC, INSAT-3DS/3DR, IMD Cyclone Warning Division
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  CloudRain,
  Wind,
  Compass,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Eye,
  ShieldAlert,
  X,
  Radio,
  Satellite,
  Layers,
  Thermometer,
  Droplets,
  Activity,
  Navigation,
  Globe2,
  CheckCircle2,
  Clock,
  Info,
} from 'lucide-react';
import type {
  AtmosphericObservationData,
  CycloneParameters,
  HazardScenario,
  OperatingMode,
} from '../types/index.ts';
import {
  REAL_ATMOSPHERIC_OBSERVATION,
  DEFAULT_CYCLONE_PARAMS,
} from '../services/atmosphericData.ts';

interface AtmosphericPanelProps {
  isOpen: boolean;
  onClose: () => void;
  mode: OperatingMode;
  onModeChange: (mode: OperatingMode) => void;
  currentScenario: HazardScenario;
  onSelectScenario: (scenario: HazardScenario) => void;
  cycloneParams: CycloneParameters;
  onUpdateCycloneParams: (params: CycloneParameters) => void;
  rainfallMm24h: number;
  onUpdateRainfall: (rainfall: number) => void;
  onFocusMapOnRainfallCore: () => void;
  onFocusMapOnConfluence: () => void;
}

export const AtmosphericPanel: React.FC<AtmosphericPanelProps> = ({
  isOpen,
  onClose,
  mode,
  onModeChange,
  currentScenario,
  onSelectScenario,
  cycloneParams,
  onUpdateCycloneParams,
  rainfallMm24h,
  onUpdateRainfall,
  onFocusMapOnRainfallCore,
  onFocusMapOnConfluence,
}) => {
  const [activeTab, setActiveTab] = useState<'real_obs' | 'cloud_animation' | 'cyclone_sim' | 'valley_impact'>('real_obs');
  const [obsData, setObsData] = useState<AtmosphericObservationData>(REAL_ATMOSPHERIC_OBSERVATION);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [timeStepIndex, setTimeStepIndex] = useState<number>(3); // 0: T-3h, 1: T-2h, 2: T-1h, 3: T-0 (Latest), 4: T+1h
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const rotationAngleRef = useRef<number>(0);

  // Time sequence steps
  const timeSteps = [
    { label: 'T-3h', time: '08:45 UTC', type: 'Archived INSAT-3DS' },
    { label: 'T-2h', time: '09:45 UTC', type: 'Archived INSAT-3DS' },
    { label: 'T-1h', time: '10:45 UTC', type: 'Previous Scan' },
    { label: 'T-0', time: '11:45 UTC', type: 'Latest Observation' },
    { label: 'T+1h', time: '12:45 UTC', type: mode === 'SIMULATION' ? 'Simulated Plume' : 'IMD NWP Forecast' },
  ];

  // Auto-play timeline animation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimeStepIndex((prev) => (prev + 1) % timeSteps.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isPlaying, timeSteps.length]);

  // Synoptic Canvas Animation (Rotating Cyclone & Cloud Movement)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    const render = () => {
      if (!running) return;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Dark space background
      ctx.fillStyle = '#060d19';
      ctx.fillRect(0, 0, width, height);

      // Synoptic Grid Lines
      ctx.strokeStyle = '#12233b';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Simplified Indian Subcontinent Outline representation in synoptic canvas
      ctx.strokeStyle = '#223854';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      // Himalayas / North
      ctx.moveTo(width * 0.35, height * 0.2);
      ctx.lineTo(width * 0.65, height * 0.18);
      // East coast / Bengal
      ctx.lineTo(width * 0.75, height * 0.45);
      // South peninsular tip
      ctx.lineTo(width * 0.52, height * 0.85);
      // West coast / Arabian Sea
      ctx.lineTo(width * 0.32, height * 0.52);
      ctx.lineTo(width * 0.28, height * 0.32);
      ctx.closePath();
      ctx.stroke();

      // Joshimath Target Reticle in Uttarakhand
      const joshX = width * 0.48;
      const joshY = height * 0.22;

      ctx.fillStyle = '#00e5ff';
      ctx.beginPath();
      ctx.arc(joshX, joshY, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 1;
      ctx.strokeRect(joshX - 10, joshY - 10, 20, 20);

      ctx.fillStyle = '#a5f3fc';
      ctx.font = '10px monospace';
      ctx.fillText('JOSHIMATH (30.56°N, 79.56°E)', joshX + 14, joshY + 4);

      if (mode === 'SIMULATION' && currentScenario === 'CYCLONE_APPROACHING_INDIA') {
        // CYCLONE SIMULATION ANIMATION:
        // Center position over selected sea (Bay of Bengal or Arabian Sea)
        const stormX = cycloneParams.originSea === 'BAY_OF_BENGAL' ? width * 0.72 : width * 0.26;
        const stormY = height * 0.62;

        rotationAngleRef.current += 0.035;
        const angle = rotationAngleRef.current;

        // Draw rotating spiral arms
        ctx.save();
        ctx.translate(stormX, stormY);
        ctx.rotate(angle);

        const arms = 4;
        for (let i = 0; i < arms; i++) {
          const armAngle = (i * Math.PI * 2) / arms;
          ctx.beginPath();
          ctx.strokeStyle = i % 2 === 0 ? 'rgba(255, 99, 132, 0.75)' : 'rgba(255, 255, 255, 0.65)';
          ctx.lineWidth = 5;

          for (let r = 8; r < 85; r += 3) {
            const theta = armAngle + (r / 18);
            const x = r * Math.cos(theta);
            const y = r * Math.sin(theta);
            if (r === 8) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        // Cyclone Eye
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#0a101d';
        ctx.fill();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.restore();

        // Forecast track cone projecting toward North/Uttarakhand
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.85)';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(stormX, stormY);
        // Bezier curve toward Gangetic valley & Himalayas
        ctx.quadraticCurveTo(width * 0.60, height * 0.38, joshX, joshY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Trough Moisture Plume / Cloud Streamers moving into Joshimath
        const pulse = (Math.sin(Date.now() / 250) + 1) / 2;
        ctx.fillStyle = `rgba(56, 189, 248, ${0.15 + pulse * 0.2})`;
        ctx.beginPath();
        ctx.ellipse(joshX, joshY + 25, 45, 25, -Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();

        // Storm label
        ctx.fillStyle = '#fda4af';
        ctx.font = 'bold 11px monospace';
        const stormDisplayName = cycloneParams.name.startsWith('SIMULATED') ? cycloneParams.name : `SIMULATED ${cycloneParams.name}`;
        ctx.fillText(stormDisplayName, stormX - 80, stormY + 95);
        ctx.font = '9px monospace';
        ctx.fillStyle = '#fecdd3';
        ctx.fillText(`CAT: ${cycloneParams.category} | WINDS: ${cycloneParams.maxSustainedWindsKmh} km/h`, stormX - 80, stormY + 110);
      } else {
        // REAL SATELLITE CLOUD MAPPING ANIMATION
        // Draw real synoptic clouds drifting across Garhwal Himalaya
        const drift = (Date.now() / 100) % 30;
        ctx.fillStyle = 'rgba(226, 232, 240, 0.45)';
        ctx.beginPath();
        ctx.ellipse(joshX - 10 + drift, joshY - 5, 60, 30, Math.PI / 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(168, 85, 247, 0.4)'; // Cold IR top
        ctx.beginPath();
        ctx.ellipse(joshX - 5 + drift, joshY - 4, 32, 16, Math.PI / 12, 0, Math.PI * 2);
        ctx.fill();

        // Cloud motion vector arrows
        ctx.strokeStyle = '#00f5ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(joshX - 40, joshY + 15);
        ctx.lineTo(joshX + 20, joshY + 5);
        ctx.stroke();
        // Arrow head
        ctx.beginPath();
        ctx.moveTo(joshX + 20, joshY + 5);
        ctx.lineTo(joshX + 10, joshY + 1);
        ctx.lineTo(joshX + 12, joshY + 10);
        ctx.closePath();
        ctx.fillStyle = '#00f5ff';
        ctx.fill();

        ctx.fillStyle = '#67e8f9';
        ctx.font = '9px monospace';
        ctx.fillText('INSAT-3DS CMV 38 km/h (WSW)', joshX - 50, joshY + 30);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      running = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [activeTab, timeStepIndex, mode, currentScenario, cycloneParams]);

  if (!isOpen) return null;

  const scenarios: { id: HazardScenario; title: string; desc: string; rainfall: number }[] = [
    {
      id: 'HEAVY_RAINFALL',
      title: '1. Heavy Rainfall Scenario',
      desc: 'Active monsoon pulse (85 mm/24h) generating saturated topsoil runoff.',
      rainfall: 85,
    },
    {
      id: 'CLOUDBURST',
      title: '2. Cloudburst Scenario',
      desc: 'Sudden localized Himalayan orographic downpour (165 mm in 2 hours).',
      rainfall: 165,
    },
    {
      id: 'CYCLONE_APPROACHING_INDIA',
      title: '3. Cyclone Approaching India',
      desc: 'Severe tropical vortex pushing intense marine moisture into Western Himalayas.',
      rainfall: 140,
    },
    {
      id: 'DENSE_CLOUD_APPROACHING_JOSHIMATH',
      title: '4. Dense Cloud System Approaching Joshimath',
      desc: 'Western Disturbance moisture plume interacting with high Garhwal ridgelines.',
      rainfall: 95,
    },
    {
      id: 'EXTREME_RAINFALL_FLASH_FLOOD',
      title: '5. Extreme Rainfall & Flash Flood Scenario',
      desc: 'Torrential 240 mm/day event surging Alaknanda & Dhauliganga gorge levels.',
      rainfall: 240,
    },
    {
      id: 'COMBINED_LANDSLIDE_FLOOD',
      title: '6. Combined Landslide & Flood Scenario',
      desc: 'Multi-hazard threshold breach: slope failure along Sunil + river toe scour.',
      rainfall: 210,
    },
  ];

  return (
    <aside
      aria-label="Atmospheric Monitoring"
      className="absolute top-14 left-3 md:left-96 z-40 w-88 md:w-[500px] max-h-[calc(100vh-140px)] flex flex-col bg-slate-950/95 border border-cyan-500/70 rounded-xl backdrop-blur-md shadow-[0_0_40px_rgba(6,182,212,0.25)] font-mono-tech text-xs select-none overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900/95 border-b border-cyan-900/70">
        <div className="flex items-center gap-2">
          <Satellite className="w-4 h-4 text-cyan-400 animate-pulse" />
          <div>
            <h2 className="font-display font-bold text-xs text-white tracking-wider uppercase flex items-center gap-2">
              ATMOSPHERIC & CYCLONE MONITORING
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700">
                INSAT-3DS // MOSDAC
              </span>
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close Atmospheric Monitoring panel"
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Mode Status Watermark Banner */}
      {mode === 'SIMULATION' ? (
        <div className="p-2 bg-rose-950/80 border-b border-rose-500/60 text-rose-200 text-[10px] flex items-center gap-1.5 leading-tight">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 animate-bounce" />
          <span className="font-bold">
            SIMULATION — NOT REAL SATELLITE OBSERVATION OR AN OFFICIAL WEATHER FORECAST.
          </span>
        </div>
      ) : (
        <div className="p-1.5 bg-cyan-950/60 border-b border-cyan-800/40 text-cyan-300 text-[10px] flex items-center justify-between">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            REAL SATELLITE OBSERVATION // MOSDAC INSAT-3DS
          </span>
          <span className="text-[9px] text-slate-400">Delay: {obsData.processingDelayMinutes} min</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 bg-slate-900/60 px-3 pt-2 text-[11px]">
        <button
          type="button"
          onClick={() => setActiveTab('real_obs')}
          className={`px-3 py-1.5 border-b-2 font-medium cursor-pointer transition-colors ${
            activeTab === 'real_obs'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Real Obs
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('cloud_animation')}
          className={`px-3 py-1.5 border-b-2 font-medium cursor-pointer transition-colors ${
            activeTab === 'cloud_animation'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Synoptic View & Cloud Motion
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('cyclone_sim');
            if (mode !== 'SIMULATION') onModeChange('SIMULATION');
          }}
          className={`px-3 py-1.5 border-b-2 font-medium cursor-pointer transition-colors ${
            activeTab === 'cyclone_sim'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Cyclone & Cloud Scenarios
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('valley_impact')}
          className={`px-3 py-1.5 border-b-2 font-medium cursor-pointer transition-colors ${
            activeTab === 'valley_impact'
              ? 'border-purple-400 text-purple-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Joshimath Impact
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-3.5 space-y-3.5 overflow-y-auto flex-1">
        {/* TAB 1: REAL OBSERVATION TELEMETRY */}
        {activeTab === 'real_obs' && (
          <div className="space-y-3">
            {/* Status Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase block">DATA FEED STATUS</span>
                <span className="text-emerald-400 font-bold text-xs flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  DATA AVAILABLE
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Freshness: {obsData.processingDelayMinutes}m ago</span>
              </div>

              <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase block">CYCLONE WARNING</span>
                <span className="text-cyan-300 font-bold text-xs flex items-center gap-1 mt-0.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                  NO ACTIVE CYCLONE
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Arabian Sea & Bay of Bengal clear</span>
              </div>
            </div>

            {/* Instrument Sourcing */}
            <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 text-[10px] space-y-1">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">METEOROLOGICAL SENSOR:</span>
                <span className="text-cyan-300 font-medium">{obsData.satelliteSensor.split(' (')[0]}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">DATA PROVIDER:</span>
                <span className="text-slate-200">ISRO MOSDAC / SAC & IMD</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">SCAN TIMESTAMP:</span>
                <span className="text-amber-300 font-mono">{obsData.observationTimestamp}</span>
              </div>
            </div>

            {/* Atmospheric Metrics */}
            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block">CLOUD COVER:</span>
                <span className="text-cyan-300 font-bold text-sm mt-0.5">{obsData.cloudCoverPct}%</span>
                <span className="text-[9px] text-slate-400 block">Chamoli Grid</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block">CLOUD TOP TEMP:</span>
                <span className="text-purple-300 font-bold text-sm mt-0.5">{obsData.cloudTopTempCelsius}°C</span>
                <span className="text-[9px] text-slate-400 block">High Orographic</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block">QPE RAIN RATE:</span>
                <span className="text-emerald-400 font-bold text-sm mt-0.5">{obsData.rainfallEstimateMmHr} mm/h</span>
                <span className="text-[9px] text-slate-400 block">HEM Estimate</span>
              </div>
            </div>

            {/* Cloud Motion Vectors & Wind */}
            <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800 space-y-1.5 text-[10px]">
              <div className="flex items-center justify-between font-semibold text-slate-200">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Wind className="w-3.5 h-3.5" />
                  CLOUD MOTION VECTOR (INSAT-3DR CMV):
                </span>
                <span className="text-cyan-300 font-bold">{obsData.cloudMovementVector.speedKmH} km/h</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Steering Direction:</span>
                <span>{obsData.cloudMovementVector.directionLabel}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Surface Wind (Joshimath Valley):</span>
                <span>{obsData.surfaceWindKnots} kts from 210° (South-Southwest)</span>
              </div>
            </div>

            {/* Official IMD Bulletin */}
            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 text-[10px] space-y-1">
              <span className="text-slate-400 font-bold block uppercase flex items-center gap-1">
                <Info className="w-3 h-3 text-cyan-400" />
                OFFICIAL IMD BULLETIN & WARNING
              </span>
              <p className="text-slate-300 leading-relaxed font-sans text-xs">
                {obsData.imdWarningBulletin}
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: SYNOPTIC RADAR & CLOUD ANIMATION VIEW */}
        {activeTab === 'cloud_animation' && (
          <div className="space-y-3">
            <div className="relative rounded-lg overflow-hidden border border-cyan-800/80 bg-black">
              <canvas
                ref={canvasRef}
                width={460}
                height={260}
                className="w-full h-auto block select-none"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 border border-slate-800 text-[9px] text-cyan-300 font-mono">
                REGIONAL SYNOPTIC SCAN // 300 hPa STEERING
              </div>
            </div>

            {/* Timeline & Frame Player */}
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 rounded bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-800 cursor-pointer flex items-center gap-1 text-[10px]"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlaying ? 'PAUSE LOOP' : 'PLAY LOOP'}</span>
                  </button>
                  <span className="text-[10px] text-slate-300 font-bold">
                    FRAME {timeStepIndex + 1}/{timeSteps.length}: {timeSteps[timeStepIndex].label}
                  </span>
                </div>
                <span className="text-[9px] text-amber-300 font-mono">{timeSteps[timeStepIndex].time}</span>
              </div>

              {/* Step indicator buttons */}
              <div className="grid grid-cols-5 gap-1 text-[9px]">
                {timeSteps.map((step, idx) => (
                  <button
                    key={step.label}
                    type="button"
                    onClick={() => {
                      setTimeStepIndex(idx);
                      setIsPlaying(false);
                    }}
                    className={`py-1 rounded border text-center transition-all cursor-pointer ${
                      timeStepIndex === idx
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <div>{step.label}</div>
                    <div className="text-[8px] text-slate-400 truncate">{step.time}</div>
                  </button>
                ))}
              </div>

              <div className="text-[9px] text-slate-400 flex items-center justify-between pt-1">
                <span>Type: {timeSteps[timeStepIndex].type}</span>
                <span>CMV Displacement: 38 km/h</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CYCLONE & DISASTER SCENARIOS */}
        {activeTab === 'cyclone_sim' && (
          <div className="space-y-3">
            <div className="p-2 rounded bg-amber-950/60 border border-amber-500/60 text-amber-300 text-[10px]">
              ⚠️ SIMULATION MODE ACTIVE — Demonstrates severe tropical cyclone moisture tracks and cloudburst physics.
            </div>

            {/* Scenario Chooser */}
            <div>
              <label className="text-[10px] text-slate-400 font-semibold uppercase block mb-1.5">
                SELECT SIMULATION SCENARIO:
              </label>
              <div className="space-y-1.5">
                {scenarios.map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => {
                      onSelectScenario(sc.id);
                      onUpdateRainfall(sc.rainfall);
                    }}
                    className={`w-full p-2 rounded border text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                      currentScenario === sc.id
                        ? 'bg-amber-950/80 text-amber-200 border-amber-400 font-semibold shadow-md'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold">{sc.title}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/50 text-cyan-300">
                        {sc.rainfall} mm/24h
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-400 leading-normal">{sc.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Cyclone Parameters Configuration (When Cyclone scenario is chosen) */}
            {currentScenario === 'CYCLONE_APPROACHING_INDIA' && (
              <div className="p-3 rounded-lg bg-slate-900 border border-rose-800/80 space-y-2.5">
                <span className="text-[10px] font-bold text-rose-300 uppercase block">
                  CYCLONIC VORTEX MECHANICS:
                </span>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <label className="text-slate-400 block">ORIGIN BASIN:</label>
                    <select
                      value={cycloneParams.originSea}
                      onChange={(e) =>
                        onUpdateCycloneParams({
                          ...cycloneParams,
                          originSea: e.target.value as 'BAY_OF_BENGAL' | 'ARABIAN_SEA',
                        })
                      }
                      className="w-full mt-1 p-1 rounded bg-slate-950 border border-slate-700 text-slate-200"
                    >
                      <option value="BAY_OF_BENGAL">Bay of Bengal (East Coast)</option>
                      <option value="ARABIAN_SEA">Arabian Sea (West Coast)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block">STORM CATEGORY:</label>
                    <select
                      value={cycloneParams.category}
                      onChange={(e) =>
                        onUpdateCycloneParams({
                          ...cycloneParams,
                          category: e.target.value as CycloneParameters['category'],
                        })
                      }
                      className="w-full mt-1 p-1 rounded bg-slate-950 border border-slate-700 text-slate-200"
                    >
                      <option value="CYCLONIC_STORM">Cyclonic Storm (65-88 km/h)</option>
                      <option value="SEVERE_CYCLONIC_STORM">Severe Cyclonic (89-117 km/h)</option>
                      <option value="VERY_SEVERE_CYCLONIC_STORM">Very Severe (118-166 km/h)</option>
                      <option value="SUPER_CYCLONE">Super Cyclone (&gt;220 km/h)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">TRANSLATION SPEED:</span>
                    <span className="text-rose-300 font-bold">{cycloneParams.translationSpeedKmh} km/h</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="45"
                    step="1"
                    value={cycloneParams.translationSpeedKmh}
                    onChange={(e) =>
                      onUpdateCycloneParams({
                        ...cycloneParams,
                        translationSpeedKmh: Number(e.target.value),
                      })
                    }
                    className="w-full accent-rose-400 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">HIMALAYAN MOISTURE SURGE:</span>
                    <span className="text-cyan-300 font-bold">{cycloneParams.moistureSurgeIntensityPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="5"
                    value={cycloneParams.moistureSurgeIntensityPct}
                    onChange={(e) =>
                      onUpdateCycloneParams({
                        ...cycloneParams,
                        moistureSurgeIntensityPct: Number(e.target.value),
                      })
                    }
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: JOSHIMATH VALLEY EXPOSURE AUDIT */}
        {activeTab === 'valley_impact' && (
          <div className="space-y-3">
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1.5">
              <span className="text-[10px] text-cyan-400 font-bold uppercase block">
                CORRELATED LOCAL WEATHER IMPACT // JOSHIMATH
              </span>
              <p className="text-[10px] text-slate-300 leading-relaxed font-sans">
                Connecting atmospheric cloud water-content and rainfall rates to mapped real terrain, structures, and river channels.
              </p>
            </div>

            {/* Impact Highlights */}
            <div className="space-y-2">
              <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-[11px] font-semibold">
                  <span className="text-rose-400">High-Vulnerability Habitation Wards:</span>
                  <span className="text-rose-300">Sunil, Manohar Bagh, Marwari</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Precipitation exceeding 80 mm/24h causes rapid hydrostatic pore-pressure spike in unconsolidated moraine material.
                </p>
              </div>

              <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-[11px] font-semibold">
                  <span className="text-amber-400">Critical Hydrological Choke-Points:</span>
                  <span className="text-amber-300">Vishnuprayag Confluence</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Combined Alaknanda + Dhauliganga surge poses immediate hydraulic scour at Marwari Bridge and confluence suspension spans.
                </p>
              </div>

              <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-[11px] font-semibold">
                  <span className="text-emerald-400">Designated Relief Assembly Centers:</span>
                  <span className="text-emerald-300">KV Joshimath, GIC Grounds</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Located above the 1,900m ASL contour away from active riverbed flash-flood inundation paths.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={onFocusMapOnRainfallCore}
                className="py-1.5 px-2 rounded bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-800 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                Inspect Cloud/Rain Core
              </button>
              <button
                type="button"
                onClick={onFocusMapOnConfluence}
                className="py-1.5 px-2 rounded bg-slate-900 text-slate-200 hover:bg-slate-800 border border-slate-700 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5" />
                Inspect River Confluence
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
