/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TRINETRA — LAPTOP 1: HIMALAYAN SATELLITE MONITORING & DISASTER OBSERVATION STATION
 * Study Area: Joshimath – Vishnuprayag, Chamoli District, Uttarakhand, India.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { Header } from './components/Header.tsx';
import { SatelliteMap } from './components/SatelliteMap.tsx';
import { LayerPanel } from './components/LayerPanel.tsx';
import { FeatureInfoPanel } from './components/FeatureInfoPanel.tsx';
import { MonitoringDock } from './components/MonitoringDock.tsx';
import { SimulationControls } from './components/SimulationControls.tsx';
import { ConnectionPanel } from './components/ConnectionPanel.tsx';
import { CarryingCapacityModal } from './components/CarryingCapacityModal.tsx';
import { StudyAreaModal } from './components/StudyAreaModal.tsx';
import { MapLegend } from './components/MapLegend.tsx';
import { AtmosphericPanel } from './components/AtmosphericPanel.tsx';

import type {
  OperatingMode,
  BasemapId,
  LayerConfig,
  SelectedFeature,
  SimulationParameters,
  SimulationImpact,
  Laptop2Config,
  TransmissionLog,
  WeatherSatelliteStatus,
  CycloneParameters,
  AtmosphericTelemetryState,
} from './types/index.ts';

import { DEFAULT_LAYERS, BASEMAPS } from './services/mapLayers.ts';
import { STUDY_AREA_CONFIG } from './services/geographicData.ts';
import {
  DEFAULT_SIMULATION_PARAMETERS,
  evaluateSimulationExposure,
  generateSimulatedInundationGeoJSON,
  generateSimulatedSlopeHazardGeoJSON,
} from './services/simulationEngine.ts';
import {
  DEFAULT_CYCLONE_PARAMS,
  REAL_ATMOSPHERIC_OBSERVATION,
  generateSimulatedCycloneGeoJSON,
  generateSimulatedAtmosphericRainImpactGeoJSON,
} from './services/atmosphericData.ts';
import { SnapshotService } from './services/snapshotService.ts';

export default function App() {
  // Operating Mode
  const [mode, setMode] = useState<OperatingMode>('REAL_DATA');

  // Basemap & Layer Configuration
  const [activeBasemap, setActiveBasemap] = useState<BasemapId>('satellite');
  const [layers, setLayers] = useState<LayerConfig[]>(DEFAULT_LAYERS);

  // Atmospheric & Cyclone State
  const [isAtmosphericOpen, setIsAtmosphericOpen] = useState<boolean>(false);
  const [weatherSatelliteStatus] = useState<WeatherSatelliteStatus>('CONNECTED');
  const [cycloneParams, setCycloneParams] = useState<CycloneParameters>(DEFAULT_CYCLONE_PARAMS);
  const [atmosphericRotation, setAtmosphericRotation] = useState<number>(0);

  // Map Telemetry State
  const mapInstanceRef = useRef<MapLibreMap | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(STUDY_AREA_CONFIG.defaultZoom);
  const [mouseCoords, setMouseCoords] = useState<{ lng: number; lat: number; elev?: number } | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<SelectedFeature | null>(null);

  // Simulation State
  const [simParams, setSimParams] = useState<SimulationParameters>(DEFAULT_SIMULATION_PARAMETERS);
  const [simImpact, setSimImpact] = useState<SimulationImpact>(() =>
    evaluateSimulationExposure(DEFAULT_SIMULATION_PARAMETERS)
  );
  const [isSimPanelOpen, setIsSimPanelOpen] = useState<boolean>(true);

  // Modals Visibility
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState<boolean>(false);
  const [isCarryingCapacityOpen, setIsCarryingCapacityOpen] = useState<boolean>(false);
  const [isStudyAreaOpen, setIsStudyAreaOpen] = useState<boolean>(false);

  // Laptop 2 Connection & Transmission State
  const [laptop2Config, setLaptop2Config] = useState<Laptop2Config>({
    destinationIp: '192.168.1.102',
    destinationPort: 8080,
    autoTransmit: false,
    intervalSeconds: 10,
    isConnected: true, // Connected to local backend relay by default
    lastTransmissionStatus: 'IDLE',
    relayUrl: '/api/snapshot',
  });
  const [transmissionLogs, setTransmissionLogs] = useState<TransmissionLog[]>([]);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [nextScheduledSeconds, setNextScheduledSeconds] = useState<number>(10);
  const [statusToast, setStatusToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Recalculate simulation impact when simulation parameters change
  useEffect(() => {
    const impact = evaluateSimulationExposure(simParams);
    setSimImpact(impact);
  }, [simParams]);

  // Animation rotation loop for simulated storm bands
  useEffect(() => {
    if (mode !== 'SIMULATION') return;
    const interval = setInterval(() => {
      setAtmosphericRotation((r) => (r + 0.05) % (2 * Math.PI));
    }, 250);
    return () => clearInterval(interval);
  }, [mode]);

  // Derived dynamic simulation GeoJSON layers
  const simulatedInundationData = React.useMemo(() => {
    return generateSimulatedInundationGeoJSON(simParams);
  }, [simParams]);

  const simulatedSlopeHazardData = React.useMemo(() => {
    return generateSimulatedSlopeHazardGeoJSON(simParams);
  }, [simParams]);

  const simulatedCycloneData = React.useMemo(() => {
    if (mode !== 'SIMULATION') return null;
    return generateSimulatedCycloneGeoJSON(cycloneParams, atmosphericRotation);
  }, [mode, cycloneParams, atmosphericRotation]);

  const simulatedAtmosphericRainData = React.useMemo(() => {
    if (mode !== 'SIMULATION') return null;
    return generateSimulatedAtmosphericRainImpactGeoJSON(
      simParams.hazardScenario as any,
      simParams.rainfallMm24h
    );
  }, [mode, simParams.hazardScenario, simParams.rainfallMm24h]);

  // Toggle Layer visibility
  const handleToggleLayer = useCallback((layerId: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === layerId ? { ...l, enabled: !l.enabled } : l))
    );
  }, []);

  const handleSetLayerOpacity = useCallback((layerId: string, opacity: number) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === layerId ? { ...l, opacity } : l))
    );
  }, []);

  const handleShowAllLayers = useCallback(() => {
    setLayers((prev) => prev.map((l) => ({ ...l, enabled: true })));
  }, []);

  const handleHideAllOverlays = useCallback(() => {
    setLayers((prev) =>
      prev.map((l) => (l.category === 'basemap' ? l : { ...l, enabled: false }))
    );
  }, []);

  const handleResetLayers = useCallback(() => {
    setLayers(DEFAULT_LAYERS);
    setActiveBasemap('satellite');
  }, []);

  // Show status notification toast
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setStatusToast({ message, type });
    setTimeout(() => {
      setStatusToast(null);
    }, 4500);
  };

  // Perform Map Snapshot Capture and Transmission
  const performSnapshotTransmission = useCallback(async () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    setIsCapturing(true);
    const snapshotService = SnapshotService.getInstance();

    try {
      const mapBlob = await snapshotService.captureMapOnlyCanvas(map);
      const activeLayerNames = layers.filter((l) => l.enabled).map((l) => l.name);

      const atmosphericTelemetry: AtmosphericTelemetryState = {
        source: REAL_ATMOSPHERIC_OBSERVATION.source,
        timestamp: REAL_ATMOSPHERIC_OBSERVATION.observationTimestamp,
        status: weatherSatelliteStatus,
        cloudCoverPct: REAL_ATMOSPHERIC_OBSERVATION.cloudCoverPct,
        rainfallEstimateMmHr: REAL_ATMOSPHERIC_OBSERVATION.rainfallEstimateMmHr,
        rainfallAccumulation24hMm: simParams.rainfallMm24h || REAL_ATMOSPHERIC_OBSERVATION.rainfallAccumulation24hMm,
        cycloneWarningStatus: REAL_ATMOSPHERIC_OBSERVATION.cycloneWarningStatus,
        isSimulatedActive: mode === 'SIMULATION',
        simulatedCycloneCategory: mode === 'SIMULATION' ? cycloneParams.category : undefined,
      };

      const metadata = snapshotService.buildSnapshotMetadata({
        mode,
        imagerySource: BASEMAPS[activeBasemap].name,
        observationTimestamp: mode === 'REAL_DATA' ? '2023-01-08T06:30:00Z (ISRO Sentinel-1 InSAR)' : null,
        map,
        visibleLayers: activeLayerNames,
        isSimulated: mode === 'SIMULATION',
        simulationParameters: mode === 'SIMULATION' ? simParams : undefined,
        exposureSummary: mode === 'SIMULATION' ? simImpact : undefined,
        atmosphericTelemetry,
        isAtmosphericSimulated: mode === 'SIMULATION',
      });

      const result = await snapshotService.transmitSnapshot(mapBlob, metadata, laptop2Config);

      setTransmissionLogs((prev) => [result.log, ...prev].slice(0, 50));
      setLaptop2Config((prev) => ({
        ...prev,
        lastTransmissionTime: new Date().toLocaleTimeString(),
        lastTransmissionStatus: result.success ? 'SUCCESS' : 'FAILED',
        lastTransmissionPayloadSize: `${(mapBlob.size / 1024).toFixed(1)} KB`,
      }));

      if (result.success) {
        showToast(`Map snapshot transmitted to Laptop 2 (${(mapBlob.size / 1024).toFixed(1)} KB)`, 'success');
      } else {
        showToast(result.log.message, 'error');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Transmission capture failed';
      showToast(msg, 'error');
    } finally {
      setIsCapturing(false);
    }
  }, [mode, activeBasemap, layers, simParams, simImpact, laptop2Config, weatherSatelliteStatus, cycloneParams]);

  // Automated scheduled transmission interval timer
  useEffect(() => {
    if (!laptop2Config.autoTransmit || !laptop2Config.isConnected) {
      setNextScheduledSeconds(laptop2Config.intervalSeconds);
      return;
    }

    const interval = setInterval(() => {
      setNextScheduledSeconds((prev) => {
        if (prev <= 1) {
          performSnapshotTransmission();
          return laptop2Config.intervalSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [laptop2Config.autoTransmit, laptop2Config.isConnected, laptop2Config.intervalSeconds, performSnapshotTransmission]);

  // Laptop 2 ping probe
  const handlePingLaptop2 = async () => {
    const service = SnapshotService.getInstance();
    const result = await service.pingLaptop2(laptop2Config.destinationIp, laptop2Config.destinationPort);
    if (result.reachable) {
      showToast(`Ping success: ${result.message} (${result.latencyMs}ms)`, 'success');
    } else {
      showToast(`Ping failed: ${result.message}`, 'error');
    }
  };

  // Reset map view to Joshimath center
  const handleResetMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: STUDY_AREA_CONFIG.center,
        zoom: STUDY_AREA_CONFIG.defaultZoom,
        pitch: 35,
        bearing: -15,
        duration: 1200,
      });
    }
  };

  // Fly to specific coordinates
  const handleFlyTo = (coords: [number, number], zoom = 16) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: coords,
        zoom,
        pitch: 40,
        duration: 1000,
      });
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* Top Technical Station Header */}
      <Header
        mode={mode}
        onModeChange={(newMode) => {
          setMode(newMode);
          if (newMode === 'SIMULATION') {
            setIsSimPanelOpen(true);
            showToast('Operating Mode changed to DISASTER SIMULATION (Demo overlays active)', 'info');
          } else {
            showToast('Operating Mode changed to REAL DATA OBSERVATION', 'info');
          }
        }}
        laptop2Config={laptop2Config}
        onOpenLaptop2Modal={() => setIsConnectionModalOpen(true)}
        activeBasemapName={BASEMAPS[activeBasemap].name}
        mouseCoords={mouseCoords}
        currentZoom={currentZoom}
        weatherSatelliteStatus={weatherSatelliteStatus}
        isCloudSimulationActive={mode === 'SIMULATION'}
        onOpenAtmosphericPanel={() => setIsAtmosphericOpen(true)}
      />

      {/* Main 75-85% Working Area: Full Satellite & Geospatial Map */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        <SatelliteMap
          activeBasemap={activeBasemap}
          layers={layers}
          mode={mode}
          simulatedInundationData={simulatedInundationData}
          simulatedSlopeHazardData={simulatedSlopeHazardData}
          simulatedCycloneData={simulatedCycloneData}
          simulatedAtmosphericRainData={simulatedAtmosphericRainData}
          selectedFeature={selectedFeature}
          onFeatureSelect={(feature) => {
            setSelectedFeature(feature);
            if (feature) {
              setIsSimPanelOpen(false);
            }
          }}
          onCoordinatesChange={setMouseCoords}
          onZoomChange={setCurrentZoom}
          onMapInstanceReady={(map) => {
            mapInstanceRef.current = map;
          }}
        />

        {/* Collapsible Geospatial Layers Panel */}
        <LayerPanel
          layers={layers}
          onToggleLayer={handleToggleLayer}
          onSetLayerOpacity={handleSetLayerOpacity}
          onShowAllLayers={handleShowAllLayers}
          onHideAllOverlays={handleHideAllOverlays}
          onResetLayers={handleResetLayers}
          activeBasemap={activeBasemap}
          onSelectBasemap={setActiveBasemap}
          isSimMode={mode === 'SIMULATION'}
        />

        {/* Feature Inspection Panel */}
        <FeatureInfoPanel
          feature={selectedFeature}
          onClose={() => setSelectedFeature(null)}
          onZoomToFeature={(coords) => handleFlyTo(coords, 17)}
        />

        {/* Simulation Controls Panel (Visible in Simulation Mode) */}
        {mode === 'SIMULATION' && (
          <SimulationControls
            parameters={simParams}
            onChangeParameters={setSimParams}
            impact={simImpact}
            isOpen={isSimPanelOpen}
            onClose={() => setIsSimPanelOpen(false)}
          />
        )}

        {/* Map Legend */}
        <MapLegend mode={mode} />

        {/* Bottom Monitoring Toolbar Dock */}
        <MonitoringDock
          mode={mode}
          onModeChange={setMode}
          onResetMap={handleResetMap}
          onCaptureSnapshot={performSnapshotTransmission}
          isCapturing={isCapturing}
          onOpenLaptop2Modal={() => setIsConnectionModalOpen(true)}
          onOpenCarryingCapacityModal={() => setIsCarryingCapacityOpen(true)}
          onOpenStudyAreaModal={() => setIsStudyAreaOpen(true)}
          onToggleSimulationPanel={() => setIsSimPanelOpen(!isSimPanelOpen)}
          isSimulationPanelOpen={isSimPanelOpen}
          onOpenAtmosphericPanel={() => setIsAtmosphericOpen(!isAtmosphericOpen)}
          isAtmosphericPanelOpen={isAtmosphericOpen}
          laptop2Config={laptop2Config}
          nextScheduledSeconds={nextScheduledSeconds}
        />
      </main>

      {/* Atmospheric & Cyclone Monitoring Panel */}
      <AtmosphericPanel
        isOpen={isAtmosphericOpen}
        onClose={() => setIsAtmosphericOpen(false)}
        mode={mode}
        onModeChange={(newMode) => {
          setMode(newMode);
          if (newMode === 'SIMULATION') {
            setIsSimPanelOpen(true);
          }
        }}
        currentScenario={simParams.hazardScenario}
        onSelectScenario={(scenario) => {
          setSimParams((prev) => ({ ...prev, hazardScenario: scenario }));
          if (mode !== 'SIMULATION') {
            setMode('SIMULATION');
            showToast(`Switched to Simulation: ${scenario.replace(/_/g, ' ')}`, 'info');
          }
        }}
        cycloneParams={cycloneParams}
        onUpdateCycloneParams={setCycloneParams}
        rainfallMm24h={simParams.rainfallMm24h}
        onUpdateRainfall={(rainfall) => setSimParams((prev) => ({ ...prev, rainfallMm24h: rainfall }))}
        onFocusMapOnRainfallCore={() => handleFlyTo([79.560, 30.565], 15.5)}
        onFocusMapOnConfluence={() => handleFlyTo([79.5772, 30.5731], 16.5)}
      />

      {/* Notification Toast */}
      {statusToast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-20 right-4 z-50 px-4 py-2.5 rounded-lg font-mono-tech text-xs shadow-2xl backdrop-blur-md border flex items-center gap-2 transition-all duration-300 ${
            statusToast.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
              : statusToast.type === 'error'
              ? 'bg-rose-950/90 text-rose-300 border-rose-500/80 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
              : 'bg-cyan-950/90 text-cyan-300 border-cyan-500/80 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-current animate-ping" />
          <span>{statusToast.message}</span>
        </div>
      )}

      {/* Laptop 2 Connection & Telemetry Modal */}
      <ConnectionPanel
        config={laptop2Config}
        onUpdateConfig={(updated) => setLaptop2Config((prev) => ({ ...prev, ...updated }))}
        logs={transmissionLogs}
        onManualCapture={performSnapshotTransmission}
        onPing={handlePingLaptop2}
        isOpen={isConnectionModalOpen}
        onClose={() => setIsConnectionModalOpen(false)}
        nextScheduledSeconds={nextScheduledSeconds}
      />

      {/* Carrying Capacity Assessment Modal */}
      <CarryingCapacityModal
        isOpen={isCarryingCapacityOpen}
        onClose={() => setIsCarryingCapacityOpen(false)}
        onZoomToSector={(coords) => handleFlyTo(coords, 16.5)}
      />

      {/* Study Area Navigation Modal */}
      <StudyAreaModal
        isOpen={isStudyAreaOpen}
        onClose={() => setIsStudyAreaOpen(false)}
        onNavigateToCoords={(coords, zoom) => handleFlyTo(coords, zoom)}
      />
    </div>
  );
}
