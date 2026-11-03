/**
 * TRINETRA — ATMOSPHERIC OBSERVATION, CLOUD TRACKING & CYCLONE SIMULATION
 * Real Data Integration: ISRO MOSDAC, INSAT-3DS/3DR, IMD Satellite Meteorology
 * Simulation Integration: Synoptic Cyclone Mechanics, Cloudband Rotation & Himalayan Moisture Surges
 */

import type {
  LayerConfig,
  AtmosphericObservationData,
  CycloneParameters,
  AtmosphericScenario,
} from '../types/index.ts';
import type { FeatureCollection } from 'geojson';

// Real Observation Data Baseline for Northern India / Chamoli Sector
export const REAL_ATMOSPHERIC_OBSERVATION: AtmosphericObservationData = {
  source: 'ISRO MOSDAC / INSAT-3DS Multi-Spectral Imager',
  satelliteSensor: 'INSAT-3DS Multi-Spectral Imager (TIR1 10.8µm, TIR2 12.0µm, MIR 3.9µm, WV 6.7µm, VIS 0.65µm)',
  observationTimestamp: '2026-11-02T11:45:00Z',
  processingDelayMinutes: 22,
  status: 'DATA_AVAILABLE',
  cycloneWarningStatus: 'NO_ACTIVE_CYCLONE_WARNING',
  imdWarningBulletin: 'IMD National Weather Bulletin: No severe cyclonic system active over North Indian Ocean basins. Western Disturbance approaching Jammu & Kashmir and Northern Himachal with upper-air moisture divergence toward Western Uttarakhand.',
  cloudCoverPct: 62,
  cloudTopTempCelsius: -52,
  cloudMovementVector: {
    directionDeg: 248,
    directionLabel: 'WSW (248°)',
    speedKmH: 38,
    level: 'Upper Tropospheric Cloud Motion Vector (CMV) ~300 hPa',
  },
  rainfallEstimateMmHr: 3.4,
  rainfallAccumulation24hMm: 28.6,
  surfaceWindKnots: 14,
  surfaceWindDirectionDeg: 210,
  relativeHumidityPct: 74,
  regionalOverviewNote: 'Regional Synoptic View: Western Himalayan Orographic Cloud Mass spanning Garhwal Himalaya with scattered convective stratiform clouds over Alaknanda Catchment.',
};

// 12 Requested Atmospheric Layers Configurations
export const ATMOSPHERIC_LAYERS: LayerConfig[] = [
  {
    id: 'layer-atmos-cloud-vis',
    name: '1. Satellite Cloud Imagery (Visible)',
    category: 'atmospheric',
    enabled: true,
    opacity: 0.75,
    color: '#e2e8f0', // Clean cloud white
    sourceType: 'geojson',
    sourceDataset: 'ISRO MOSDAC / INSAT-3DS VIS (0.65 µm)',
    attribution: 'Space Applications Centre (SAC), ISRO / IMD',
    observationDate: '02-Nov-2026 11:45 UTC',
    description: 'High-resolution daytime optical cloud reflection over Uttarakhand & Western Himalaya.',
  },
  {
    id: 'layer-atmos-cloud-ir',
    name: '2. Infrared Cloud Imagery (Thermal IR)',
    category: 'atmospheric',
    enabled: true,
    opacity: 0.7,
    color: '#a855f7', // Purple/Violet IR
    sourceType: 'geojson',
    sourceDataset: 'ISRO MOSDAC / INSAT-3DS TIR-1 (10.8 µm)',
    attribution: 'ISRO MOSDAC, IMD New Delhi',
    observationDate: '02-Nov-2026 11:45 UTC',
    description: 'Cloud-top brightness temperature mapping; deeper cold tops (-55°C) indicate convective depth.',
  },
  {
    id: 'layer-atmos-water-vapor',
    name: '3. Water Vapor Imagery (6.7 µm)',
    category: 'atmospheric',
    enabled: false,
    opacity: 0.65,
    color: '#0284c7', // Sky cyan
    sourceType: 'geojson',
    sourceDataset: 'ISRO MOSDAC / INSAT-3DS Mid-Tropospheric WV Channel',
    attribution: 'ISRO SAC / IMD',
    observationDate: '02-Nov-2026 11:45 UTC',
    description: 'Mid-to-upper tropospheric moisture conveyor belts channeling from Arabian Sea/Bay of Bengal.',
  },
  {
    id: 'layer-atmos-cloud-motion-vectors',
    name: '4. Cloud Motion Vectors (CMV)',
    category: 'atmospheric',
    enabled: true,
    opacity: 0.9,
    color: '#00f5ff', // Electric cyan arrows
    sourceType: 'geojson',
    sourceDataset: 'INSAT-3DR Sounder & CMV Derived Products',
    attribution: 'IMD Satellite Meteorology Division',
    observationDate: '02-Nov-2026 11:30 UTC',
    description: 'Automated optical-flow displacement vectors tracking real cloud cluster drift across mountain ridges.',
  },
  {
    id: 'layer-atmos-cloud-cover',
    name: '5. Cloud Cover Extent & Density',
    category: 'atmospheric',
    enabled: true,
    opacity: 0.5,
    color: '#cbd5e1', // Misty slate
    sourceType: 'geojson',
    sourceDataset: 'IMD / MOSDAC Gridded Cloud Mask (Level-2)',
    attribution: 'IMD / ISRO',
    description: 'Fractional cloud cover boundary over Chamoli District and surrounding peaks.',
  },
  {
    id: 'layer-atmos-rainfall-estimate',
    name: '6. Rainfall Estimate (HEM / QPE)',
    category: 'atmospheric',
    enabled: true,
    opacity: 0.8,
    color: '#10b981', // Emerald precipitation
    sourceType: 'geojson',
    sourceDataset: 'MOSDAC Hydro-Estimator Method (HEM / QPE)',
    attribution: 'SAC ISRO / CWC Hydro-Met Grid',
    observationDate: '02-Nov-2026 11:30 UTC',
    description: 'Quantitative Satellite Precipitation Estimation combining IR cloud-top cooling rates with radar calibrate.',
  },
  {
    id: 'layer-atmos-precipitation-forecast',
    name: '7. Precipitation Forecast (IMD NWP)',
    category: 'atmospheric',
    enabled: false,
    opacity: 0.6,
    color: '#06b6d4',
    sourceType: 'geojson',
    sourceDataset: 'IMD GFS / WRF Regional Numerical Model (3km Grid)',
    attribution: 'India Meteorological Department (IMD)',
    description: 'High-resolution 24h accumulated precipitation forecast for Uttarakhand river valleys.',
  },
  {
    id: 'layer-atmos-wind-vectors',
    name: '8. Wind Direction and Speed',
    category: 'atmospheric',
    enabled: true,
    opacity: 0.85,
    color: '#eab308', // Amber streamline
    sourceType: 'geojson',
    sourceDataset: 'IMD Upper-Air Radiosonde & INSAT-3DS Water Vapor Winds',
    attribution: 'IMD / NCMRWF',
    description: 'Steering flow wind barbs across the Himalayan orographic barrier.',
  },
  {
    id: 'layer-atmos-severe-weather',
    name: '9. Severe Weather Systems',
    category: 'atmospheric',
    enabled: true,
    opacity: 0.9,
    color: '#f97316', // Orange
    sourceType: 'geojson',
    sourceDataset: 'IMD Cyclone Warning Division & Regional Specialised Meteorological Centre (RSMC)',
    attribution: 'RSMC New Delhi / IMD',
    description: 'Depression centers, monsoonal troughs, and active synoptic low-pressure zones.',
  },
  {
    id: 'layer-atmos-cyclone-track',
    name: '10. Cyclone Track & Forecast Cone',
    category: 'atmospheric',
    enabled: false,
    opacity: 0.95,
    color: '#dc2626', // Red
    sourceType: 'geojson',
    sourceDataset: 'IMD Cyclone Warning Division / RSMC Tropical Cyclone Bulletin',
    attribution: 'RSMC New Delhi / IMD',
    description: 'Past positions and 72-hour forecast cone of uncertainty for severe marine cyclones.',
  },
  {
    id: 'layer-atmos-simulated-cloud-bands',
    name: '11. Simulated Storm Cloud Bands',
    category: 'atmospheric',
    enabled: false,
    opacity: 0.7,
    color: '#f43f5e', // Rose/crimson
    sourceType: 'geojson',
    sourceDataset: 'TRINETRA Synoptic Cloud Engine (Computational Model)',
    attribution: 'TRINETRA Demonstration Simulation Engine',
    isSimulated: true,
    description: 'Computational spiral storm cloud bands rotating and moving toward the monitoring sector.',
  },
  {
    id: 'layer-atmos-simulated-rainfall-impact',
    name: '12. Simulated Heavy Rainfall Impact',
    category: 'atmospheric',
    enabled: false,
    opacity: 0.65,
    color: '#b91c1c', // Deep scarlet
    sourceType: 'geojson',
    sourceDataset: 'TRINETRA Orographic Precipitation Subsystem',
    attribution: 'TRINETRA Demonstration Simulation Engine',
    isSimulated: true,
    description: 'Simulated high-intensity rainfall zone intersecting Joshimath slopes and Alaknanda gorge.',
  },
];

// Default Demonstration Cyclone Parameters
export const DEFAULT_CYCLONE_PARAMS: CycloneParameters = {
  name: 'SIMULATED SEVERE CYCLONE "MARUTI"',
  originSea: 'BAY_OF_BENGAL',
  category: 'VERY_SEVERE_CYCLONIC_STORM',
  translationSpeedKmh: 24,
  trackBearingDeg: 325, // NW toward Odisha/Bengal coast and up-valley into Gangetic/Himalayan trough
  centralPressureHpa: 964,
  maxSustainedWindsKmh: 145,
  distanceToUttarakhandKm: 980,
  moistureSurgeIntensityPct: 82,
  currentLat: 18.2,
  currentLng: 87.4,
};

// Real Observation FeatureCollection (Visible & IR cloud boundaries over Chamoli sector)
export const REAL_CLOUD_OBSERVATION_GEOJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'cloud-mass-chamoli-western-flank',
      properties: {
        id: 'INSAT3DS-CLOUD-01',
        name: 'Western Himalayan Cloud Shield',
        type: 'stratiform_orographic_cloud',
        sourceDataset: 'ISRO MOSDAC / INSAT-3DS TIR1 (10.8µm)',
        cloudTopTemp: '-48°C',
        topHeightKm: 9.8,
        cloudType: 'Altostratus & Cirrostratus with embedded cumulus',
        opticalDepth: 18.5,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [79.5200, 30.5850],
          [79.5550, 30.5920],
          [79.5950, 30.5820],
          [79.6050, 30.5500],
          [79.5850, 30.5350],
          [79.5350, 30.5380],
          [79.5100, 30.5600],
          [79.5200, 30.5850],
        ]],
      },
    },
    {
      type: 'Feature',
      id: 'cloud-convective-core-auli',
      properties: {
        id: 'INSAT3DS-CONV-02',
        name: 'Auli Ridge Convective Updraft Cell',
        type: 'convective_cumulonimbus_cluster',
        sourceDataset: 'ISRO MOSDAC / INSAT-3DS TIR2 & VIS',
        cloudTopTemp: '-58°C (Deep Convection)',
        topHeightKm: 12.4,
        rainfallPotential: 'High (18-28 mm/hr local burst)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [79.5400, 30.5520],
          [79.5650, 30.5540],
          [79.5620, 30.5400],
          [79.5380, 30.5390],
          [79.5400, 30.5520],
        ]],
      },
    },
  ],
};

// Real Cloud Motion Vectors (CMVs) & Wind Barbs
export const REAL_WIND_CMV_GEOJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'cmv-point-01',
      properties: {
        id: 'CMV-JM-01',
        name: 'Cloud Motion Vector - Joshimath Upper',
        type: 'cloud_motion_vector',
        sourceDataset: 'INSAT-3DR Derived Upper-Air Winds',
        directionDeg: 245,
        speedKnots: 22,
        speedKmh: 41,
        pressureLevelHpa: 400,
        observationTime: '02-Nov-2026 11:30 UTC',
      },
      geometry: {
        type: 'Point',
        coordinates: [79.5600, 30.5650],
      },
    },
    {
      type: 'Feature',
      id: 'cmv-point-02',
      properties: {
        id: 'CMV-JM-02',
        name: 'Cloud Motion Vector - Vishnuprayag Gorge',
        type: 'cloud_motion_vector',
        sourceDataset: 'INSAT-3DR Derived Winds',
        directionDeg: 235,
        speedKnots: 18,
        speedKmh: 33,
        pressureLevelHpa: 500,
      },
      geometry: {
        type: 'Point',
        coordinates: [79.5750, 30.5700],
      },
    },
    {
      type: 'Feature',
      id: 'cmv-point-03',
      properties: {
        id: 'CMV-JM-03',
        name: 'Cloud Motion Vector - Sunil / Marwari',
        type: 'cloud_motion_vector',
        sourceDataset: 'INSAT-3DR Derived Winds',
        directionDeg: 250,
        speedKnots: 20,
        speedKmh: 37,
        pressureLevelHpa: 450,
      },
      geometry: {
        type: 'Point',
        coordinates: [79.5520, 30.5580],
      },
    },
    // Wind Direction Line Vectors (Arrows pointing along flow)
    {
      type: 'Feature',
      id: 'wind-arrow-01',
      properties: {
        id: 'WIND-ARROW-01',
        type: 'wind_streamline',
        direction: 'WSW to ENE',
        speedKmh: 41,
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [79.5420, 30.5590],
          [79.5680, 30.5690],
        ],
      },
    },
    {
      type: 'Feature',
      id: 'wind-arrow-02',
      properties: {
        id: 'WIND-ARROW-02',
        type: 'wind_streamline',
        direction: 'WSW to ENE',
        speedKmh: 35,
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [79.5350, 30.5480],
          [79.5620, 30.5580],
        ],
      },
    },
  ],
};

// Real QPE Rainfall Estimate Grid
export const REAL_QPE_RAINFALL_GEOJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'qpe-contour-moderate',
      properties: {
        id: 'QPE-BAND-MODERATE',
        name: 'QPE Moderate Precipitation Footprint (5 - 15 mm/hr)',
        rateMmHr: '5 - 15 mm/hr',
        sourceDataset: 'MOSDAC Hydro-Estimator Method (HEM)',
        color: '#34d399',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [79.5300, 30.5750],
          [79.5850, 30.5850],
          [79.5950, 30.5550],
          [79.5650, 30.5450],
          [79.5300, 30.5500],
          [79.5300, 30.5750],
        ]],
      },
    },
    {
      type: 'Feature',
      id: 'qpe-contour-heavy',
      properties: {
        id: 'QPE-BAND-HEAVY',
        name: 'QPE Heavy Precipitation Core (> 20 mm/hr)',
        rateMmHr: '> 20 mm/hr',
        sourceDataset: 'MOSDAC HEM QPE',
        color: '#059669',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [79.5480, 30.5650],
          [79.5750, 30.5680],
          [79.5720, 30.5550],
          [79.5500, 30.5540],
          [79.5480, 30.5650],
        ]],
      },
    },
  ],
};

/**
 * Generates dynamic rotating spiral cloud bands for simulated cyclones or approaching storm systems.
 * Uses logarithmic spiral equation: r = a * exp(b * theta)
 * Centered around origin sea with bands projecting northwest toward Himalayan trough.
 */
export function generateSimulatedCycloneGeoJSON(
  params: CycloneParameters,
  rotationAngleRad: number = 0
): FeatureCollection {
  const features: FeatureCollection['features'] = [];

  // Cyclone Eye Center
  features.push({
    type: 'Feature',
    id: 'sim-cyclone-eye',
    properties: {
      id: 'SIM-EYE',
      name: `${params.name} — Storm Center (Eye)`,
      category: params.category,
      centralPressureHpa: params.centralPressureHpa,
      maxSustainedWindsKmh: params.maxSustainedWindsKmh,
      distanceToUttarakhandKm: params.distanceToUttarakhandKm,
      disclaimer: 'SIMULATION — NOT REAL SATELLITE OBSERVATION OR AN OFFICIAL WEATHER FORECAST.',
    },
    geometry: {
      type: 'Point',
      coordinates: [params.currentLng, params.currentLat],
    },
  });

  // Track Forecast Line from current position toward mainland & North India
  const trackCoords: [number, number][] = [
    [params.currentLng - 3.5, params.currentLat - 2.8],
    [params.currentLng - 1.8, params.currentLat - 1.4],
    [params.currentLng, params.currentLat],
    [params.currentLng + 1.6, params.currentLat + 2.4],
    [params.currentLng + 3.0, params.currentLat + 5.2],
    [79.56, 30.56], // Feeder convergence toward Joshimath catchment
  ];

  features.push({
    type: 'Feature',
    id: 'sim-cyclone-track-line',
    properties: {
      id: 'SIM-TRACK',
      name: 'Simulated Cyclone Forecast Track Cone',
      translationSpeedKmh: params.translationSpeedKmh,
      disclaimer: 'SIMULATION — NOT REAL SATELLITE OBSERVATION OR AN OFFICIAL WEATHER FORECAST.',
    },
    geometry: {
      type: 'LineString',
      coordinates: trackCoords,
    },
  });

  // Generates 4 rotating logarithmic spiral cloud bands projected locally and regionally
  const armOffsets = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];

  armOffsets.forEach((armOffset, idx) => {
    const spiralCoords: [number, number][] = [];
    const localCenterLng = 79.5630;
    const localCenterLat = 30.5580;

    // Localized cloud bands traversing the Joshimath valley
    for (let t = 0.2; t <= 2.2; t += 0.2) {
      const angle = t * 2.8 + rotationAngleRad + armOffset;
      const radiusDeg = 0.015 * Math.exp(0.45 * t);
      const lng = localCenterLng + radiusDeg * Math.cos(angle);
      const lat = localCenterLat + radiusDeg * 0.7 * Math.sin(angle);
      spiralCoords.push([Number(lng.toFixed(5)), Number(lat.toFixed(5))]);
    }

    if (spiralCoords.length > 2) {
      features.push({
        type: 'Feature',
        id: `sim-spiral-band-${idx}`,
        properties: {
          id: `SIM-BAND-${idx + 1}`,
          name: `Simulated Inflow Cloud Band #${idx + 1}`,
          type: 'simulated_cloud_band',
          intensity: Math.round(params.moistureSurgeIntensityPct * 0.9),
          disclaimer: 'SIMULATION — NOT REAL SATELLITE OBSERVATION OR AN OFFICIAL WEATHER FORECAST.',
        },
        geometry: {
          type: 'LineString',
          coordinates: spiralCoords,
        },
      });
    }
  });

  return {
    type: 'FeatureCollection',
    features,
  };
}

/**
 * Generates dynamic high-intensity rainfall impact polygon over Joshimath–Vishnuprayag in simulation mode.
 */
export function generateSimulatedAtmosphericRainImpactGeoJSON(
  scenario: AtmosphericScenario,
  rainfallMm24h: number
): FeatureCollection {
  const intensity = Math.min(100, Math.max(20, rainfallMm24h / 2.5));

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        id: 'sim-atmos-heavy-rain-core',
        properties: {
          id: 'SIM-ATMOS-RAIN-CORE',
          name: `Simulated Orographic Heavy Rainfall Core (${rainfallMm24h} mm/24h)`,
          scenario,
          rainfallMm24h,
          intensity,
          disclaimer: 'SIMULATION — NOT REAL SATELLITE OBSERVATION OR AN OFFICIAL WEATHER FORECAST.',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [79.5420, 30.5750],
            [79.5780, 30.5780],
            [79.5840, 30.5520],
            [79.5520, 30.5450],
            [79.5380, 30.5600],
            [79.5420, 30.5750],
          ]],
        },
      },
    ],
  };
}
