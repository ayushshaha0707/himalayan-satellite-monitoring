/**
 * TRINETRA — HIMALAYAN SATELLITE MONITORING STATION
 * Pure simulation math, exposure calculations, and carrying capacity estimation.
 * 
 * DISCLAIMER:
 * SIMULATION — NOT A REAL-WORLD OBSERVATION OR OFFICIAL WARNING.
 * Computational demonstration for decision-support and stress-testing.
 */

import type { SimulationParameters, SimulationImpact } from '../types/index.ts';
import type { FeatureCollection } from 'geojson';

export const DEFAULT_SIMULATION_PARAMETERS: SimulationParameters = {
  rainfallMm24h: 85,             // 85 mm in 24h
  soilMoistureSaturationPct: 65, // 65% saturated
  riverDischargeCumecs: 750,     // 750 m3/s (Combined Alaknanda + Dhauliganga)
  slopeFailureThreshold: 0.55,  // 0.55 stability index
  hazardScenario: 'MONSOON_SURGE',
};

/**
 * Validates simulation input parameters within physically sensible ranges.
 */
export function validateSimulationParameters(params: Partial<SimulationParameters>): SimulationParameters {
  const rainfall = Math.max(0, Math.min(params.rainfallMm24h ?? DEFAULT_SIMULATION_PARAMETERS.rainfallMm24h, 400));
  const moisture = Math.max(10, Math.min(params.soilMoistureSaturationPct ?? DEFAULT_SIMULATION_PARAMETERS.soilMoistureSaturationPct, 100));
  const discharge = Math.max(100, Math.min(params.riverDischargeCumecs ?? DEFAULT_SIMULATION_PARAMETERS.riverDischargeCumecs, 4000));
  const slopeThreshold = Math.max(0.1, Math.min(params.slopeFailureThreshold ?? DEFAULT_SIMULATION_PARAMETERS.slopeFailureThreshold, 1.0));
  const scenario = params.hazardScenario ?? DEFAULT_SIMULATION_PARAMETERS.hazardScenario;

  return {
    rainfallMm24h: Number(rainfall.toFixed(1)),
    soilMoistureSaturationPct: Number(moisture.toFixed(1)),
    riverDischargeCumecs: Math.round(discharge),
    slopeFailureThreshold: Number(slopeThreshold.toFixed(2)),
    hazardScenario: scenario,
  };
}

/**
 * Computes composite slope instability risk score [0 - 100].
 * Factor of Safety approximation based on rainfall intensity, saturation, and shear threshold.
 */
export function calculateSlopeInstabilityScore(params: SimulationParameters): number {
  const rainFactor = (params.rainfallMm24h / 250) * 40;
  const moistureFactor = ((params.soilMoistureSaturationPct - 20) / 80) * 35;
  const resistanceFactor = (1 - params.slopeFailureThreshold) * 25;
  
  let scenarioMultiplier = 1.0;
  if (params.hazardScenario === 'SLOPE_REACTIVATION') scenarioMultiplier = 1.25;
  if (params.hazardScenario === 'GLOF_FLASH_FLOOD') scenarioMultiplier = 1.15;

  const rawScore = (rainFactor + moistureFactor + resistanceFactor) * scenarioMultiplier;
  return Math.min(100, Math.max(0, Number(rawScore.toFixed(1))));
}

/**
 * Computes estimated river stage rise in meters above normal riverbed.
 * Based on Manning's equation simplification for steep mountain gorges.
 */
export function calculateRiverStageRiseMeters(dischargeCumecs: number): number {
  // Normal baseline discharge is ~300 cumecs
  const excess = Math.max(0, dischargeCumecs - 300);
  // Mountain gorge with steep sides: depth scales approximately as H ~ k * Q^0.4
  const stageRise = Math.pow(excess / 120, 0.42);
  return Number(stageRise.toFixed(2));
}

/**
 * Evaluates multi-hazard exposure and carrying capacity stress.
 */
export function evaluateSimulationExposure(params: SimulationParameters): SimulationImpact {
  const instabilityScore = calculateSlopeInstabilityScore(params);
  const stageRise = calculateRiverStageRiseMeters(params.riverDischargeCumecs);

  // Inundated area scaling (sq km in gorge)
  const inundatedArea = 0.45 + (params.riverDischargeCumecs / 2000) * 1.8;
  
  // Building exposure estimation based on mapped Joshimath footprints
  let buildingsExposed = 0;
  if (instabilityScore > 75) {
    buildingsExposed = Math.round(180 + (instabilityScore - 75) * 12);
  } else if (instabilityScore > 50) {
    buildingsExposed = Math.round(45 + (instabilityScore - 50) * 5.4);
  } else {
    buildingsExposed = Math.round(instabilityScore * 0.9);
  }

  // Road exposure in kilometers (NH-7 + Auli Road)
  const roadExposed = Number((1.2 + (instabilityScore / 100) * 5.8).toFixed(2));

  // Bridges at risk
  const bridgesAtRisk: string[] = [];
  if (stageRise > 3.5 || params.hazardScenario === 'GLOF_FLASH_FLOOD') {
    bridgesAtRisk.push('Marwari Alaknanda Bridge');
  }
  if (stageRise > 2.0 || params.riverDischargeCumecs > 1200) {
    bridgesAtRisk.push('Vishnuprayag Confluence Suspension Bridge');
  }

  // High risk zones
  const highRiskZones: string[] = [];
  if (instabilityScore > 65) {
    highRiskZones.push('Sunil Ward (Sector 1 - Crown Tension Scarp)');
    highRiskZones.push('Manohar Bagh (Sector 2 - Auli Ropeway Axis)');
  }
  if (instabilityScore > 50) {
    highRiskZones.push('Marwari & JP Colony (Toe Slope Hydraulic Zone)');
    highRiskZones.push('Singhdhar Sector');
  }
  if (stageRise > 2.5) {
    highRiskZones.push('Vishnuprayag River Gorge & Confluence Flats');
  }

  // Recommended evacuation sectors
  const evacuationSectors: string[] = [];
  if (instabilityScore > 70) {
    evacuationSectors.push('Sector 1: Upper Sunil Scarp Zone');
    evacuationSectors.push('Sector 4: Marwari Lower Riverside Toe');
  }
  if (instabilityScore > 85) {
    evacuationSectors.push('Sector 2: Manohar Bagh Ropeway Corridor');
    evacuationSectors.push('Sector 5: Singhdhar Eastern Slope');
  }

  // Carrying capacity stress determination
  let carryingCapacityStressLevel: SimulationImpact['carryingCapacityStressLevel'] = 'MODERATE';
  if (instabilityScore > 75 || buildingsExposed > 120 || params.riverDischargeCumecs > 2000) {
    carryingCapacityStressLevel = 'SEVERE_EXCEEDED';
  } else if (instabilityScore > 50 || buildingsExposed > 50 || params.riverDischargeCumecs > 1200) {
    carryingCapacityStressLevel = 'CRITICAL';
  }

  return {
    inundatedAreaSqKm: Number(inundatedArea.toFixed(2)),
    buildingsExposedCount: buildingsExposed,
    roadLengthExposedKm: roadExposed,
    criticalBridgesAtRisk: bridgesAtRisk,
    highRiskZones,
    recommendedEvacuationSectors: evacuationSectors,
    carryingCapacityStressLevel,
  };
}

/**
 * Generates dynamic GeoJSON layer for simulated river overflow & inundation polygon.
 */
export function generateSimulatedInundationGeoJSON(params: SimulationParameters): FeatureCollection {
  const stageRise = calculateRiverStageRiseMeters(params.riverDischargeCumecs);
  const bufferWidth = 0.0008 + (stageRise / 10) * 0.0022; // In degrees (~90m to 250m buffer)

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        id: 'sim-flood-alaknanda-gorge',
        properties: {
          id: 'sim-inundation-alaknanda',
          name: 'Simulated Alaknanda River Surge Inundation Zone',
          type: 'simulated_flood_extent',
          sourceDataset: 'TRINETRA Hydrodynamic Gorge Model (Demo Simulation)',
          riverStageRiseMeters: stageRise,
          dischargeCumecs: params.riverDischargeCumecs,
          disclaimer: 'SIMULATION — NOT A REAL-WORLD OBSERVATION OR OFFICIAL WARNING.',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [79.5850 + bufferWidth, 30.5890],
            [79.5810 + bufferWidth, 30.5830],
            [79.5765 + bufferWidth, 30.5750],
            [79.5742 + bufferWidth * 1.5, 30.5694], // Vishnuprayag confluence spreading
            [79.5700 + bufferWidth, 30.5665],
            [79.5645 + bufferWidth, 30.5640],
            [79.5595 + bufferWidth, 30.5620],
            [79.5530 + bufferWidth, 30.5590],
            [79.5460 + bufferWidth, 30.5540],
            [79.5380 + bufferWidth, 30.5480],
            // Return boundary (opposite riverbank)
            [79.5380 - bufferWidth, 30.5480],
            [79.5460 - bufferWidth, 30.5540],
            [79.5530 - bufferWidth, 30.5590],
            [79.5595 - bufferWidth, 30.5620],
            [79.5645 - bufferWidth, 30.5640],
            [79.5700 - bufferWidth, 30.5665],
            [79.5742 - bufferWidth * 1.5, 30.5694],
            [79.5765 - bufferWidth, 30.5750],
            [79.5810 - bufferWidth, 30.5830],
            [79.5850 - bufferWidth, 30.5890],
            [79.5850 + bufferWidth, 30.5890],
          ]],
        },
      },
    ],
  };
}

/**
 * Generates dynamic GeoJSON layer for simulated slope failure & debris runout path.
 */
export function generateSimulatedSlopeHazardGeoJSON(params: SimulationParameters): FeatureCollection {
  const instabilityScore = calculateSlopeInstabilityScore(params);
  const opacity = Math.min(0.85, Math.max(0.25, instabilityScore / 100));

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        id: 'sim-slope-runout-zone',
        properties: {
          id: 'sim-slope-instability-zone',
          name: 'Simulated Joshimath Slope Reactivation Corridor',
          type: 'simulated_slope_hazard',
          instabilityScore,
          opacity,
          saturationPct: params.soilMoistureSaturationPct,
          rainfallMm24h: params.rainfallMm24h,
          sourceDataset: 'TRINETRA Geotechnical Simulation Subsystem',
          disclaimer: 'SIMULATION — NOT A REAL-WORLD OBSERVATION OR OFFICIAL WARNING.',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [79.5515, 30.5635],
            [79.5650, 30.5645],
            [79.5680, 30.5595],
            [79.5640, 30.5530],
            [79.5520, 30.5550],
            [79.5515, 30.5635],
          ]],
        },
      },
    ],
  };
}
