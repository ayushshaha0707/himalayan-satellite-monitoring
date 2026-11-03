/**
 * TRINETRA — LAPTOP 1: SATELLITE OBSERVATION STATION
 * Carrying Capacity Assessment & Relocation Planning Analysis Modal
 */

import React from 'react';
import { X, FileSpreadsheet, ShieldAlert, AlertTriangle, CheckCircle, ArrowRight, MapPin, Building, Activity } from 'lucide-react';

interface CarryingCapacityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onZoomToSector: (coords: [number, number]) => void;
}

export const CarryingCapacityModal: React.FC<CarryingCapacityModalProps> = ({
  isOpen,
  onClose,
  onZoomToSector,
}) => {
  if (!isOpen) return null;

  const sectors = [
    {
      name: 'Sunil Ward (Sector 1)',
      status: 'CAPACITY EXCEEDED // DANGER',
      statusColor: 'text-rose-400 bg-rose-950/80 border-rose-600',
      slope: '32°',
      currentStructures: 215,
      sustainableLimit: 60,
      excessPct: '+258%',
      geology: 'Unconsolidated moraine debris, subsurface piping',
      recommendation: 'Immediate structural load shedding & staged relocation to safe plateau',
      coords: [79.5540, 30.5592] as [number, number],
    },
    {
      name: 'Manohar Bagh (Sector 2)',
      status: 'CAPACITY EXCEEDED // DANGER',
      statusColor: 'text-rose-400 bg-rose-950/80 border-rose-600',
      slope: '28°',
      currentStructures: 184,
      sustainableLimit: 65,
      excessPct: '+183%',
      geology: 'Active tension crack corridor beneath Auli ropeway line',
      recommendation: 'Prohibit heavy construction; divert internal wastewater runoff',
      coords: [79.5585, 30.5588] as [number, number],
    },
    {
      name: 'Marwari & JP Colony (Sector 4 - Toe)',
      status: 'HYDRAULIC TOE SCOUR // SEVERE',
      statusColor: 'text-rose-400 bg-rose-950/80 border-rose-600',
      slope: '38°',
      currentStructures: 92,
      sustainableLimit: 25,
      excessPct: '+268%',
      geology: 'Alaknanda riverbed toe erosion & aquifer discharge channel',
      recommendation: 'Construct toe-revetment spurs; relocate riverside habitation',
      coords: [79.5602, 30.5628] as [number, number],
    },
    {
      name: 'Upper Bazar & Jyotirmath (Sector 6)',
      status: 'AT SUSTAINABILITY CEILING',
      statusColor: 'text-amber-400 bg-amber-950/80 border-amber-600',
      slope: '22°',
      currentStructures: 310,
      sustainableLimit: 290,
      excessPct: '+7%',
      geology: 'Moderate consolidated slope mantle over bedrock outcrop',
      recommendation: 'Preserve heritage structures; enforce strict height limits',
      coords: [79.5635, 30.5582] as [number, number],
    },
    {
      name: 'Tapovan / Pipalkoti Relocation Shelf',
      status: 'DESIGNATED SAFE RELOCATION ZONE',
      statusColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-600',
      slope: '12°',
      currentStructures: 45,
      sustainableLimit: 400,
      excessPct: 'Optimal Buffer Available',
      geology: 'Stable crystalline Vaikrita Group bedrock formation',
      recommendation: 'Recommended permanent rehabilitation township',
      coords: [79.6050, 30.5610] as [number, number],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="w-full max-w-3xl bg-slate-950 border border-purple-800/80 rounded-xl shadow-[0_0_50px_rgba(168,85,247,0.2)] flex flex-col font-mono-tech text-xs overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-purple-950/50 border-b border-purple-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-900/70 text-purple-300">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm text-slate-100 tracking-wider">
                HABITATION CARRYING CAPACITY & RELOCATION ASSESSMENT
              </h2>
              <p className="text-[10px] text-purple-300/80">
                Joshimath Hill Slope Structural Load vs Geotechnical Equilibrium
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

        {/* Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Executive Scientific Summary */}
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-[11px]">
              <ShieldAlert className="w-4 h-4" />
              GEOTECHNICAL BASELINE (MISHRA COMMITTEE 1976 & NDMA 2023)
            </div>
            <p className="leading-relaxed font-sans text-xs">
              Joshimath is built on an ancient, unconsolidated paleo-landslide deposit rather than in-situ bedrock. Heavy multi-story reinforced concrete structures, inadequate municipal subsurface drainage, and continuous Alaknanda toe undercutting have caused the slope's mechanical shear strength to drop below the safety threshold.
            </p>
          </div>

          {/* Sector Breakdown Cards */}
          <div className="space-y-3">
            <div className="text-[11px] font-semibold text-slate-300 uppercase">
              WARD SECTOR-BY-SECTOR LOAD CAPACITY AUDIT:
            </div>

            {sectors.map((sec) => (
              <div
                key={sec.name}
                className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="font-bold text-slate-100 text-xs flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    {sec.name}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${sec.statusColor}`}>
                    {sec.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] bg-slate-950/60 p-2 rounded border border-slate-800/80">
                  <div>
                    <span className="text-slate-400 block">SLOPE ANGLE:</span>
                    <span className="font-bold text-slate-200">{sec.slope}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">CURRENT STRUCTURES:</span>
                    <span className="font-bold text-slate-200">{sec.currentStructures}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">MAX CAPACITY:</span>
                    <span className="font-bold text-cyan-300">{sec.sustainableLimit}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">EXCESS LOAD:</span>
                    <span className="font-bold text-rose-400">{sec.excessPct}</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400">
                  <span className="text-slate-300 font-semibold">Substrate:</span> {sec.geology}
                </div>

                <div className="text-[10px] text-amber-300/90 flex items-start gap-1">
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                  <span>{sec.recommendation}</span>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onZoomToSector(sec.coords);
                      onClose();
                    }}
                    className="text-[10px] text-cyan-300 hover:text-cyan-200 underline cursor-pointer"
                  >
                    Locate Sector on Satellite Map →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
