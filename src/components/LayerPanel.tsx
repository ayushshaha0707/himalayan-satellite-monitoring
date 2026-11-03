/**
 * TRINETRA — LAPTOP 1: SATELLITE OBSERVATION STATION
 * Collapsible Geospatial Layers Panel with Legends and Attribution
 */

import React, { useState } from 'react';
import {
  Layers,
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  RefreshCw,
  Sliders,
  CheckSquare,
  Square,
  Satellite,
  Mountain,
  Map,
  Compass,
  Info,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import type { LayerConfig, BasemapId } from '../types/index.ts';
import { BASEMAPS } from '../services/mapLayers.ts';

interface LayerPanelProps {
  layers: LayerConfig[];
  onToggleLayer: (layerId: string) => void;
  onSetLayerOpacity: (layerId: string, opacity: number) => void;
  onShowAllLayers: () => void;
  onHideAllOverlays: () => void;
  onResetLayers: () => void;
  activeBasemap: BasemapId;
  onSelectBasemap: (basemapId: BasemapId) => void;
  isSimMode: boolean;
}

export const LayerPanel: React.FC<LayerPanelProps> = ({
  layers,
  onToggleLayer,
  onShowAllLayers,
  onHideAllOverlays,
  onResetLayers,
  activeBasemap,
  onSelectBasemap,
  isSimMode,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    basemaps: true,
    transport: true,
    hydrology: true,
    habitation: true,
    facilities: true,
    geohazards: true,
    terrain: false,
    atmospheric: true,
    simulation: true,
  });

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const categories = [
    { id: 'atmospheric', label: 'Atmospheric & Cyclone Monitoring', icon: '🛰️' },
    { id: 'transport', label: 'Roads & Infrastructure', icon: '🛣️' },
    { id: 'hydrology', label: 'Rivers & Water Systems', icon: '🌊' },
    { id: 'habitation', label: 'Habitation & Settlements', icon: '🏘️' },
    { id: 'facilities', label: 'Critical Facilities & Healthcare', icon: '🏥' },
    { id: 'geohazards', label: 'Geohazards & InSAR Subsidence', icon: '⚠️' },
    { id: 'terrain', label: 'Terrain, Elevation & Slope', icon: '⛰️' },
    { id: 'simulation', label: 'Demonstration Simulation Overlays', icon: '🔬' },
  ];

  const activeLayerCount = layers.filter((l) => l.enabled).length;

  if (!isOpen) {
    return (
      <div className="absolute top-14 left-3 z-20 select-none font-mono-tech">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Expand Geospatial Layers panel"
          className="px-3 py-2 rounded-lg bg-slate-950/95 border border-cyan-800/80 hover:border-cyan-400 text-slate-200 hover:text-white backdrop-blur-md shadow-2xl flex items-center gap-2.5 cursor-pointer group transition-all duration-200"
          title="Expand Geospatial Layers Panel"
        >
          <div className="relative">
            <Layers className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          </div>
          <span className="text-xs font-display font-semibold uppercase tracking-wider text-cyan-300">
            GEOSPATIAL LAYERS
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
            {activeLayerCount} Active
          </span>
          <Maximize2 className="w-3.5 h-3.5 text-cyan-400 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div
      className="absolute top-14 left-3 z-20 flex flex-col transition-all duration-300 max-h-[calc(100vh-140px)] w-80 md:w-96 select-none"
    >
      {/* Panel Toggle Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-950/95 border border-cyan-900/50 rounded-t-lg backdrop-blur-md shadow-xl text-slate-100">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-xs font-display tracking-wider font-semibold uppercase text-cyan-300">
            GEOSPATIAL LAYERS
          </span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/80">
            {activeLayerCount}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-mono-tech">
          <button
            type="button"
            onClick={onShowAllLayers}
            className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
            title="Enable all available layers"
          >
            All
          </button>
          <button
            type="button"
            onClick={onHideAllOverlays}
            className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
            title="Hide all vector overlays"
          >
            Hide
          </button>
          <button
            type="button"
            onClick={onResetLayers}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 cursor-pointer"
            title="Reset to default operational state"
          >
            <RefreshCw className="w-2.5 h-2.5" />
          </button>
          {/* Explicit Minimize Option Button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Minimize Geospatial Layers panel"
            className="px-2 py-0.5 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 hover:text-white border border-cyan-800/80 cursor-pointer flex items-center gap-1 font-semibold"
            title="Minimize Geospatial Layers Panel"
          >
            <Minimize2 className="w-3 h-3 text-cyan-400" />
            <span>Minimize</span>
          </button>
        </div>
      </div>

      {/* Panel Scrollable Body */}
      {isOpen && (
        <div className="flex-1 overflow-y-auto p-3 bg-slate-950/90 border-x border-b border-cyan-950/50 rounded-b-lg backdrop-blur-md shadow-2xl space-y-3 font-mono-tech text-xs">
          {/* Basemap Selection Box */}
          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Satellite className="w-3.5 h-3.5" />
                REFERENCE BASEMAP
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(BASEMAPS) as BasemapId[]).map((bmKey) => {
                const bm = BASEMAPS[bmKey];
                const isActive = activeBasemap === bmKey;
                return (
                  <button
                    key={bm.id}
                    type="button"
                    onClick={() => onSelectBasemap(bm.id)}
                    className={`px-2 py-1.5 rounded text-[11px] text-left transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/60 font-semibold shadow-[0_0_8px_rgba(6,182,212,0.25)]'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800/80 hover:text-slate-200'
                    }`}
                  >
                    <div className="truncate font-medium">{bm.name.split(' (')[0]}</div>
                    <div className="text-[9px] text-slate-400 truncate">{bm.category}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Layer Categories */}
          {categories.map((cat) => {
            const catLayers = layers.filter((l) => {
              if (cat.id === 'simulation') return l.category === 'simulation';
              return l.category === cat.id;
            });
            if (catLayers.length === 0) return null;

            const isExpanded = !!expandedCategories[cat.id];
            const activeCount = catLayers.filter((l) => l.enabled).length;

            return (
              <div
                key={cat.id}
                className="rounded-lg bg-slate-900/80 border border-slate-800/90 overflow-hidden"
              >
                {/* Category Header */}
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full px-2.5 py-1.5 flex items-center justify-between text-left hover:bg-slate-800/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{cat.icon}</span>
                    <span className="text-[11px] font-semibold text-slate-200 uppercase">
                      {cat.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {activeCount}/{catLayers.length}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Category Items */}
                {isExpanded && (
                  <div className="px-2.5 py-2 space-y-2 border-t border-slate-800/60 bg-slate-950/40">
                    {catLayers.map((layer) => (
                      <div
                        key={layer.id}
                        className={`p-2 rounded border transition-all ${
                          layer.enabled
                            ? 'bg-slate-900/90 border-slate-700/80'
                            : 'bg-slate-950/60 border-slate-900 opacity-60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <label className="flex items-start gap-2 cursor-pointer flex-1">
                            <input
                              type="checkbox"
                              checked={layer.enabled}
                              onChange={() => onToggleLayer(layer.id)}
                              className="mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0 cursor-pointer"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                                  style={{ backgroundColor: layer.color }}
                                />
                                <span
                                  className={`text-[11px] font-medium leading-tight ${
                                    layer.enabled ? 'text-slate-100' : 'text-slate-400'
                                  }`}
                                >
                                  {layer.name}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 leading-normal mt-0.5">
                                {layer.description}
                              </p>
                            </div>
                          </label>
                        </div>

                        {/* Attribution & Data Sourcing */}
                        <div className="mt-1 pt-1 border-t border-slate-800/60 flex items-center justify-between text-[9px] text-slate-400">
                          <span className="truncate max-w-[200px]" title={layer.sourceDataset}>
                            Src: {layer.sourceDataset}
                          </span>
                          {layer.observationDate && (
                            <span className="text-cyan-400/90">{layer.observationDate}</span>
                          )}
                          {layer.isSimulated && (
                            <span className="text-amber-400 font-semibold">SIMULATION</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
