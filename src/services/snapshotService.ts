/**
 * TRINETRA — LAPTOP 1: SATELLITE OBSERVATION STATION
 * Snapshot Capture & Laptop 2 Telemetry Transmission Service
 */

import type { SnapshotPayload, TransmissionLog, Laptop2Config, OperatingMode, SimulationParameters, SimulationImpact } from '../types/index.ts';
import type { Map as MapLibreMap } from 'maplibre-gl';

export class SnapshotService {
  private static instance: SnapshotService;
  private isTransmitting = false;

  public static getInstance(): SnapshotService {
    if (!SnapshotService.instance) {
      SnapshotService.instance = new SnapshotService();
    }
    return SnapshotService.instance;
  }

  /**
   * Captures pure map canvas as high-resolution PNG data URL or Blob.
   * Excludes application headers, panels, sidebars, and control buttons.
   */
  public captureMapOnlyCanvas(map: MapLibreMap): Promise<Blob> {
    return new Promise((resolve, reject) => {
      try {
        const canvas = map.getCanvas();
        if (!canvas) {
          reject(new Error('Map canvas is not initialized or accessible.'));
          return;
        }

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create Blob from MapLibre canvas.'));
            }
          },
          'image/png',
          0.95
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Captures map data URL for immediate preview.
   */
  public captureMapDataUrl(map: MapLibreMap): string {
    const canvas = map.getCanvas();
    return canvas.toDataURL('image/png', 0.9);
  }

  /**
   * Builds the structured telemetry payload.
   */
  public buildSnapshotMetadata(options: {
    stationId?: string;
    studyArea?: string;
    mode: OperatingMode;
    imagerySource: string;
    observationTimestamp?: string | null;
    map: MapLibreMap;
    visibleLayers: string[];
    isSimulated: boolean;
    simulationParameters?: SimulationParameters;
    exposureSummary?: SimulationImpact;
    atmosphericTelemetry?: import('../types/index.ts').AtmosphericTelemetryState;
    isAtmosphericSimulated?: boolean;
  }): SnapshotPayload {
    const center = options.map.getCenter();
    return {
      stationId: options.stationId || 'TRINETRA-OBS-STATION-01',
      studyArea: options.studyArea || 'Joshimath – Vishnuprayag, Chamoli District, Uttarakhand, India',
      timestamp: new Date().toISOString(),
      mode: options.mode,
      imagerySource: options.imagerySource,
      observationTimestamp: options.observationTimestamp || null,
      mapCenter: [Number(center.lng.toFixed(5)), Number(center.lat.toFixed(5))],
      zoomLevel: Number(options.map.getZoom().toFixed(2)),
      bearing: Number(options.map.getBearing().toFixed(1)),
      pitch: Number(options.map.getPitch().toFixed(1)),
      visibleLayers: options.visibleLayers,
      isSimulated: options.isSimulated,
      simulationParameters: options.simulationParameters,
      exposureSummary: options.exposureSummary,
      atmosphericTelemetry: options.atmosphericTelemetry,
      isAtmosphericSimulated: options.isAtmosphericSimulated,
    };
  }

  /**
   * Transmits map viewport snapshot and metadata to the backend via POST /api/snapshot.
   * Uses multipart/form-data as strictly requested.
   */
  public async transmitSnapshot(
    mapBlob: Blob,
    metadata: SnapshotPayload,
    config: Laptop2Config
  ): Promise<{ success: boolean; log: TransmissionLog }> {
    if (this.isTransmitting) {
      throw new Error('Upload currently in progress. Overlapping transmissions prevented.');
    }

    this.isTransmitting = true;
    const startTime = performance.now();
    const destinationTarget = `${config.destinationIp}:${config.destinationPort}`;

    try {
      const formData = new FormData();
      formData.append('image', mapBlob, `trinetra-joshimath-${Date.now()}.png`);
      formData.append('metadata', JSON.stringify(metadata));
      formData.append('targetIp', config.destinationIp);
      formData.append('targetPort', String(config.destinationPort));

      // Primary endpoint on the station backend
      const response = await fetch('/api/snapshot', {
        method: 'POST',
        body: formData,
      });

      const durationMs = Math.round(performance.now() - startTime);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Station backend responded with HTTP ${response.status}: ${errorText || 'Transmission rejected'}`);
      }

      const responseData = await response.json();
      const log: TransmissionLog = {
        id: responseData.transmissionId || `TX-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        status: 'SUCCESS',
        bytesSent: mapBlob.size,
        durationMs,
        destination: destinationTarget,
        message: responseData.message || `Dispatched to Laptop 2 (${(mapBlob.size / 1024).toFixed(1)} KB in ${durationMs}ms)`,
      };

      return { success: true, log };
    } catch (err) {
      const durationMs = Math.round(performance.now() - startTime);
      const errorMessage = err instanceof Error ? err.message : 'Unknown network failure';
      const log: TransmissionLog = {
        id: `TX-ERR-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        status: 'FAILED',
        bytesSent: mapBlob.size,
        durationMs,
        destination: destinationTarget,
        message: `Transmission failed: ${errorMessage}`,
      };
      return { success: false, log };
    } finally {
      this.isTransmitting = false;
    }
  }

  /**
   * Pings Laptop 2 destination backend to verify live connectivity.
   */
  public async pingLaptop2(ip: string, port: number): Promise<{ reachable: boolean; latencyMs: number; message: string }> {
    const start = performance.now();
    try {
      const res = await fetch(`/api/laptop2/ping?ip=${encodeURIComponent(ip)}&port=${encodeURIComponent(port)}`);
      const data = await res.json();
      const latencyMs = Math.round(performance.now() - start);
      return {
        reachable: data.reachable === true,
        latencyMs: data.latencyMs || latencyMs,
        message: data.message || (data.reachable ? 'Laptop 2 Command Center reachable' : 'Host unreachable on designated port'),
      };
    } catch (err) {
      return {
        reachable: false,
        latencyMs: 0,
        message: err instanceof Error ? err.message : 'Ping probe connection failed',
      };
    }
  }
}
