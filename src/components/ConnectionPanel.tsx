/**
 * TRINETRA — LAPTOP 1: SATELLITE OBSERVATION STATION
 * Laptop 2 Command Center Link & Telemetry Dispatch Panel
 */

import React, { useState } from 'react';
import {
  Wifi,
  WifiOff,
  Server,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  FileCode,
  RefreshCw,
  Sliders,
  Activity,
} from 'lucide-react';
import type { Laptop2Config, TransmissionLog } from '../types/index.ts';

interface ConnectionPanelProps {
  config: Laptop2Config;
  onUpdateConfig: (updated: Partial<Laptop2Config>) => void;
  logs: TransmissionLog[];
  onManualCapture: () => void;
  onPing: () => void;
  isOpen: boolean;
  onClose: () => void;
  nextScheduledSeconds: number;
}

export const ConnectionPanel: React.FC<ConnectionPanelProps> = ({
  config,
  onUpdateConfig,
  logs,
  onManualCapture,
  onPing,
  isOpen,
  onClose,
  nextScheduledSeconds,
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'logs' | 'contract'>('status');
  const [tempIp, setTempIp] = useState(config.destinationIp);
  const [tempPort, setTempPort] = useState(String(config.destinationPort));

  if (!isOpen) return null;

  const handleApplyConnection = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      destinationIp: tempIp.trim(),
      destinationPort: parseInt(tempPort, 10) || 8080,
      isConnected: true,
    });
  };

  const handleDisconnect = () => {
    onUpdateConfig({
      isConnected: false,
      autoTransmit: false,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
      <div className="w-full max-w-2xl bg-slate-950 border border-cyan-800/80 rounded-xl shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col font-mono-tech text-xs overflow-hidden max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg ${config.isConnected ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm text-slate-100 tracking-wider">
                LAPTOP 2 // COMMAND CENTER LINK
              </h2>
              <p className="text-[10px] text-slate-400">
                Ground Station Telemetry & Map Viewport Relocation Pipeline
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-4 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('status')}
            className={`px-3 py-1.5 border-b-2 font-medium cursor-pointer ${
              activeTab === 'status'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Link Status & Config
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 border-b-2 font-medium cursor-pointer ${
              activeTab === 'logs'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Transmission Logs ({logs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contract')}
            className={`px-3 py-1.5 border-b-2 font-medium cursor-pointer ${
              activeTab === 'contract'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            API Contract Spec
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {activeTab === 'status' && (
            <div className="space-y-4">
              {/* Connection Status Box */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                  <span className="text-[9px] text-slate-400 uppercase">LINK STATE</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        config.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                      }`}
                    />
                    <span className={`font-bold ${config.isConnected ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {config.isConnected ? 'CONNECTED' : 'DISCONNECTED'}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                  <span className="text-[9px] text-slate-400 uppercase">NEXT TRANSMISSION</span>
                  <div className="font-bold text-cyan-300 mt-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {config.autoTransmit ? `${nextScheduledSeconds}s` : 'MANUAL'}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                  <span className="text-[9px] text-slate-400 uppercase">LAST DISPATCH</span>
                  <div className="font-bold text-slate-200 mt-1 truncate">
                    {config.lastTransmissionTime || 'None'}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                  <span className="text-[9px] text-slate-400 uppercase">TRANSMISSION RESULT</span>
                  <div
                    className={`font-bold mt-1 ${
                      config.lastTransmissionStatus === 'SUCCESS'
                        ? 'text-emerald-400'
                        : config.lastTransmissionStatus === 'FAILED'
                        ? 'text-rose-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {config.lastTransmissionStatus}
                  </div>
                </div>
              </div>

              {/* IP & Port Settings Form */}
              <form onSubmit={handleApplyConnection} className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="text-[11px] font-semibold text-cyan-400 uppercase">
                  DESTINATION COMMAND CENTER (LAPTOP 2)
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] text-slate-400 block">DESTINATION IP ADDRESS</label>
                    <input
                      type="text"
                      value={tempIp}
                      onChange={(e) => setTempIp(e.target.value)}
                      placeholder="192.168.1.102"
                      className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-slate-100 focus:border-cyan-400 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 block">TCP PORT</label>
                    <input
                      type="number"
                      value={tempPort}
                      onChange={(e) => setTempPort(e.target.value)}
                      placeholder="8080"
                      className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-slate-100 focus:border-cyan-400 outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <Wifi className="w-3.5 h-3.5" />
                    Connect Link
                  </button>
                  <button
                    type="button"
                    onClick={onPing}
                    className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    Ping Probe
                  </button>
                  {config.isConnected && (
                    <button
                      type="button"
                      onClick={handleDisconnect}
                      className="px-3 py-1.5 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800/80 cursor-pointer"
                    >
                      Disconnect
                    </button>
                  )}
                </div>
              </form>

              {/* Automatic Dispatch Schedule Controls */}
              <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-200">
                      AUTOMATIC RECURRING TRANSMISSION
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Periodically extracts pure map viewport and syncs metadata
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.autoTransmit}
                      onChange={(e) => onUpdateConfig({ autoTransmit: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">DISPATCH INTERVAL:</span>
                    <span className="text-cyan-300 font-bold">{config.intervalSeconds} SECONDS</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={config.intervalSeconds}
                    onChange={(e) => onUpdateConfig({ intervalSeconds: Number(e.target.value) })}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>5s (Rapid Sync)</span>
                    <span>10s (Default)</span>
                    <span>60s (Bandwidth Saver)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-end">
                  <button
                    type="button"
                    onClick={onManualCapture}
                    className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center gap-1.5 cursor-pointer shadow-lg"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Transmit Immediate Snapshot Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span>RECENT TRANSMISSION ACTIVITY</span>
                <span>{logs.length} logged packets</span>
              </div>

              {logs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 italic bg-slate-900/60 rounded-lg border border-slate-800">
                  No transmissions sent yet. Click "Transmit Immediate Snapshot Now" to test.
                </div>
              ) : (
                <div className="space-y-2 max-h-[360px] overflow-y-auto">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 rounded bg-slate-900/90 border border-slate-800 flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-2">
                        {log.status === 'SUCCESS' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className="font-semibold text-slate-200">{log.message}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                            <span>Target: {log.destination}</span>
                            <span>•</span>
                            <span>{log.durationMs}ms</span>
                            <span>•</span>
                            <span>{(log.bytesSent / 1024).toFixed(1)} KB</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {log.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'contract' && (
            <div className="space-y-3 font-mono-tech text-[11px]">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                <span className="text-cyan-400 font-bold block mb-1">
                  CONTRACT SPECIFICATION: POST /api/snapshot
                </span>
                <p className="text-[10px] text-slate-400 mb-2">
                  Laptop 1 dispatches pure map viewport frames to Laptop 2 using standard multipart/form-data.
                </p>

                <div className="bg-slate-950 p-2 rounded border border-slate-800 text-[10px] text-slate-200 overflow-x-auto space-y-1">
                  <div>POST /api/snapshot HTTP/1.1</div>
                  <div>Content-Type: multipart/form-data</div>
                  <div className="text-cyan-300">
                    - image: &lt;PNG image blob&gt; (Pure map viewport only)
                  </div>
                  <div className="text-cyan-300">- metadata: JSON string:</div>
                  <pre className="text-[9px] text-slate-300 pl-4">
{`{
  "stationId": "TRINETRA-OBS-01",
  "studyArea": "Joshimath – Vishnuprayag",
  "timestamp": "2026-11-01T11:45:00.000Z",
  "mode": "REAL_DATA" | "SIMULATION",
  "imagerySource": "ESRI World Imagery / Sentinel-2",
  "mapCenter": [79.5630, 30.5580],
  "zoomLevel": 14.2,
  "visibleLayers": ["roads", "rivers", "buildings", "insar"],
  "simulationParameters": { ... },
  "exposureSummary": { ... }
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
