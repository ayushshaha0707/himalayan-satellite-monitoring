/**
 * TRINETRA — LAPTOP 1: SATELLITE OBSERVATION STATION
 * Official Study Area Selection & Bounding Box Inspection Modal
 */

import React from 'react';
import { X, MapPin, Compass, Mountain, CheckCircle, Navigation } from 'lucide-react';
import { STUDY_AREA_CONFIG } from '../services/geographicData.ts';

interface StudyAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToCoords: (coords: [number, number], zoom?: number) => void;
}

export const StudyAreaModal: React.FC<StudyAreaModalProps> = ({
  isOpen,
  onClose,
  onNavigateToCoords,
}) => {
  if (!isOpen) return null;

  const keyFocusLocations = [
    {
      name: 'Joshimath Town Center (Upper & Lower Bazar)',
      desc: 'Urban habitation core, historic math, dense commercial masonry',
      coords: [79.5630, 30.5580] as [number, number],
      zoom: 15.5,
    },
    {
      name: 'Vishnuprayag River Confluence',
      desc: 'Panch Prayag meeting point of Alaknanda and Dhauliganga Rivers in granite gorge',
      coords: [79.5742, 30.5694] as [number, number],
      zoom: 16.0,
    },
    {
      name: 'Marwari Alaknanda Bridge & Slope Toe',
      desc: 'Toe of Joshimath moraine mass; vital NH-7 bridge and hydraulic erosion zone',
      coords: [79.5605, 30.5624] as [number, number],
      zoom: 16.2,
    },
    {
      name: 'Sunil Ward & Crown Scarp Zone',
      desc: 'Upper residential ward exhibiting deep tension cracks in 2023',
      coords: [79.5540, 30.5592] as [number, number],
      zoom: 16.0,
    },
    {
      name: 'Dhauliganga Valley & Tapovan Approach',
      desc: 'Hydropower corridor and glacial flash-flood pathway from Niti Valley',
      coords: [79.6050, 30.5610] as [number, number],
      zoom: 14.5,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="w-full max-w-xl bg-slate-950 border border-cyan-800/80 rounded-xl shadow-[0_0_50px_rgba(6,182,212,0.2)] flex flex-col font-mono-tech text-xs overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm text-slate-100 tracking-wider">
                OFFICIAL STUDY AREA // JOSHIMATH – VISHNUPRAYAG
              </h2>
              <p className="text-[10px] text-slate-400">
                Chamoli District, Uttarakhand, India
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

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Coordinates Overview */}
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="text-[11px] font-semibold text-cyan-300 uppercase flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              GEODETIC BOUNDING EXTENT
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <span className="text-slate-400 block">INITIAL CENTER:</span>
                <span className="font-bold text-slate-100">
                  {STUDY_AREA_CONFIG.center[1]}°N, {STUDY_AREA_CONFIG.center[0]}°E
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">ELEVATION RANGE:</span>
                <span className="font-bold text-slate-100">
                  {STUDY_AREA_CONFIG.elevationRange.min}m – {STUDY_AREA_CONFIG.elevationRange.max}m ASL
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">SOUTH-WEST BOUND:</span>
                <span className="text-slate-300 font-mono">
                  {STUDY_AREA_CONFIG.bounds[0][1]}°N, {STUDY_AREA_CONFIG.bounds[0][0]}°E
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">NORTH-EAST BOUND:</span>
                <span className="text-slate-300 font-mono">
                  {STUDY_AREA_CONFIG.bounds[1][1]}°N, {STUDY_AREA_CONFIG.bounds[1][0]}°E
                </span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
              <span className="text-slate-300 font-semibold">Tectonic Context:</span> {STUDY_AREA_CONFIG.geologicalSetting}
            </div>
          </div>

          {/* Quick Navigation to Key Focus Sites */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-slate-300 uppercase">
              SELECT SUB-REGIONAL MONITORING FOCUS:
            </div>

            <div className="space-y-2">
              {keyFocusLocations.map((loc) => (
                <div
                  key={loc.name}
                  className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {loc.name}
                    </div>
                    <p className="text-[10px] text-slate-400 font-sans">{loc.desc}</p>
                    <div className="text-[9px] text-cyan-400/80 font-mono">
                      {loc.coords[1].toFixed(4)}°N, {loc.coords[0].toFixed(4)}°E (Zoom {loc.zoom}x)
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onNavigateToCoords(loc.coords, loc.zoom);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-800/80 font-semibold text-[10px] flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Navigation className="w-3 h-3" />
                    Inspect
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
