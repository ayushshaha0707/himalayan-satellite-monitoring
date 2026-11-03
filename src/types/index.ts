/**
 * TRINETRA — LAPTOP 1: SATELLITE OBSERVATION STATION
 * Types and interfaces for geospatial monitoring, atmospheric tracking, simulation, and Laptop 2 telemetry.
 */

export type OperatingMode = 'REAL_DATA' | 'SIMULATION';

export type BasemapId = 'satellite' | 'terrain' | 'dark' | 'osm';

export type WeatherSatelliteStatus = 'CONNECTED' | 'DELAYED' | 'UNAVAILABLE';

export interface GeoCoordinate {
  longitude: number;
  latitude: number;
  elevation?: number;
}

export interface MapExtent {
  north: number;
  south: number;
  east: number;
  west: number;
}

export type LayerCategory =
  | 'basemap'
  | 'transport'
  | 'habitation'
  | 'hydrology'
  | 'facilities'
  | 'terrain'
  | 'geohazards'
  | 'atmospheric'
  | 'simulation';

export interface LayerConfig {
  id: string;
  name: string;
  category: LayerCategory;
  enabled: boolean;
  opacity: number;
  color: string;
  sourceType: 'geojson' | 'raster' | 'vector';
  sourceDataset: string;
  attribution: string;
  observationDate?: string;
  isDerived?: boolean;
  isSimulated?: boolean;
  description: string;
}

export interface MapFeatureProperties {
  id: string;
  name?: string;
  type: string;
  category: LayerCategory;
  sourceDataset: string;
  elevationMeters?: number;
  coordinates: [number, number];
  [key: string]: unknown;
}

export interface SelectedFeature {
  id: string;
  name: string;
  type: string;
  category: string;
  sourceDataset: string;
  coordinates: [number, number];
  elevationMeters?: number;
  properties: Record<string, unknown>;
  geometryType: string;
}

export type HazardScenario =
  | 'MONSOON_SURGE'
  | 'GLOF_FLASH_FLOOD'
  | 'SLOPE_REACTIVATION'
  | 'HEAVY_RAINFALL'
  | 'CLOUDBURST'
  | 'CYCLONE_APPROACHING_INDIA'
  | 'DENSE_CLOUD_APPROACHING_JOSHIMATH'
  | 'EXTREME_RAINFALL_FLASH_FLOOD'
  | 'COMBINED_LANDSLIDE_FLOOD';

export type AtmosphericScenario = HazardScenario;

export interface CycloneParameters {
  name: string;
  originSea: 'BAY_OF_BENGAL' | 'ARABIAN_SEA';
  category: 'DEEP_DEPRESSION' | 'CYCLONIC_STORM' | 'SEVERE_CYCLONIC_STORM' | 'VERY_SEVERE_CYCLONIC_STORM' | 'SUPER_CYCLONE';
  translationSpeedKmh: number;    // 15 - 45 km/h
  trackBearingDeg: number;        // e.g. 320° (NW toward mainland)
  centralPressureHpa: number;     // 940 - 998 hPa
  maxSustainedWindsKmh: number;   // 85 - 220 km/h
  distanceToUttarakhandKm: number;// Distance to Joshimath along feeder trough
  moistureSurgeIntensityPct: number; // 20 - 100% moisture push
  currentLat: number;
  currentLng: number;
}

export interface SimulationParameters {
  rainfallMm24h: number;         // 0 - 350 mm/day
  soilMoistureSaturationPct: number; // 20 - 100 %
  riverDischargeCumecs: number;  // 150 - 3200 m3/s (Alaknanda + Dhauliganga)
  slopeFailureThreshold: number; // 0.1 - 1.0 (shear resistance factor)
  hazardScenario: HazardScenario;
  cycloneConfig?: CycloneParameters;
}

export interface SimulationImpact {
  inundatedAreaSqKm: number;
  buildingsExposedCount: number;
  roadLengthExposedKm: number;
  criticalBridgesAtRisk: string[];
  highRiskZones: string[];
  recommendedEvacuationSectors: string[];
  carryingCapacityStressLevel: 'MODERATE' | 'CRITICAL' | 'SEVERE_EXCEEDED';
  downstreamSurgeNotice?: string;
  synopticMoistureNotice?: string;
}

export interface AtmosphericObservationData {
  source: string;                    // e.g. "INSAT-3DS Imager / ISRO MOSDAC"
  satelliteSensor: string;           // "INSAT-3DS Multi-Spectral Imager (TIR1, TIR2, MIR, WV, VIS)"
  observationTimestamp: string;      // UTC / IST observation timestamp
  processingDelayMinutes: number;    // Delay in minutes (e.g. 24 min)
  status: 'DATA_AVAILABLE' | 'DATA_DELAYED' | 'SOURCE_UNAVAILABLE';
  cycloneWarningStatus: 'NO_ACTIVE_CYCLONE_WARNING' | 'DEPRESSION_WATCH' | 'CYCLONE_ALERT_ORANGE' | 'CYCLONE_WARNING_RED';
  imdWarningBulletin: string;
  cloudCoverPct: number;             // Fractional cloud cover % over Chamoli sector
  cloudTopTempCelsius: number;       // Cloud top brightness temperature (e.g. -58°C)
  cloudMovementVector: {
    directionDeg: number;            // Vector direction
    directionLabel: string;          // e.g. "WSW (245°)"
    speedKmH: number;                // e.g. 42 km/h
    level: string;                   // "Upper Tropospheric Cloud Motion Vector (CMV)"
  };
  rainfallEstimateMmHr: number;      // Quantitative Precipitation Estimation (QPE / HEM)
  rainfallAccumulation24hMm: number; // Gridded 24h estimation
  surfaceWindKnots: number;
  surfaceWindDirectionDeg: number;
  relativeHumidityPct: number;
  regionalOverviewNote: string;
}

export interface AtmosphericTelemetryState {
  layerVisibility?: Record<string, boolean>;
  dataSource?: string;
  latestObservationTimestamp?: string;
  cloudImageryTimestamp?: string;
  weatherObservationStatus?: WeatherSatelliteStatus;
  selectedScenario?: HazardScenario;
  isAtmosphericSimulated?: boolean;
  cycloneParams?: CycloneParameters;
  source?: string;
  timestamp?: string;
  status?: WeatherSatelliteStatus | string;
  cloudCoverPct?: number;
  rainfallEstimateMmHr?: number;
  rainfallAccumulation24hMm?: number;
  cycloneWarningStatus?: string;
  isSimulatedActive?: boolean;
  simulatedCycloneCategory?: string;
}

export interface Laptop2Config {
  destinationIp: string;
  destinationPort: number;
  autoTransmit: boolean;
  intervalSeconds: number;
  isConnected: boolean;
  lastTransmissionTime?: string;
  lastTransmissionStatus: 'SUCCESS' | 'FAILED' | 'PENDING' | 'IDLE';
  lastTransmissionPayloadSize?: string;
  relayUrl: string;
}

export interface SnapshotPayload {
  stationId: string;
  studyArea: string;
  timestamp: string;
  mode: OperatingMode;
  imagerySource: string;
  observationTimestamp: string | null;
  mapCenter: [number, number];
  zoomLevel: number;
  bearing: number;
  pitch: number;
  visibleLayers: string[];
  isSimulated: boolean;
  simulationParameters?: SimulationParameters;
  exposureSummary?: SimulationImpact;
  atmosphericTelemetry?: AtmosphericTelemetryState;
  isAtmosphericSimulated?: boolean;
  imageDataUrl?: string; // base64 preview
}

export interface TransmissionLog {
  id: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED' | 'TRANSMITTING';
  bytesSent: number;
  durationMs: number;
  destination: string;
  message: string;
}
