import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateSimulationParameters,
  calculateSlopeInstabilityScore,
  calculateRiverStageRiseMeters,
  evaluateSimulationExposure,
  generateSimulatedInundationGeoJSON,
  DEFAULT_SIMULATION_PARAMETERS,
} from './simulationEngine.ts';
import {
  DEFAULT_CYCLONE_PARAMS,
  generateSimulatedCycloneGeoJSON,
  generateSimulatedAtmosphericRainImpactGeoJSON,
} from './atmosphericData.ts';

test('validateSimulationParameters clamps extreme numbers cleanly', () => {
  const result = validateSimulationParameters({
    rainfallMm24h: 9999,
    soilMoistureSaturationPct: -50,
    riverDischargeCumecs: 50,
  });

  assert.equal(result.rainfallMm24h, 400); // clamped to max 400
  assert.equal(result.soilMoistureSaturationPct, 10); // clamped to min 10
  assert.equal(result.riverDischargeCumecs, 100); // clamped to min 100
});

test('calculateRiverStageRiseMeters increases with higher discharge', () => {
  const lowRise = calculateRiverStageRiseMeters(400);
  const highRise = calculateRiverStageRiseMeters(2000);

  assert.ok(highRise > lowRise, 'Higher discharge must yield greater river stage rise');
  assert.ok(lowRise >= 0, 'Stage rise cannot be negative');
});

test('calculateSlopeInstabilityScore computes higher score for severe monsoon and low shear', () => {
  const benignParams = {
    ...DEFAULT_SIMULATION_PARAMETERS,
    rainfallMm24h: 10,
    soilMoistureSaturationPct: 25,
    slopeFailureThreshold: 0.9,
  };

  const severeParams = {
    ...DEFAULT_SIMULATION_PARAMETERS,
    rainfallMm24h: 220,
    soilMoistureSaturationPct: 95,
    slopeFailureThreshold: 0.2,
    hazardScenario: 'SLOPE_REACTIVATION' as const,
  };

  const benignScore = calculateSlopeInstabilityScore(benignParams);
  const severeScore = calculateSlopeInstabilityScore(severeParams);

  assert.ok(benignScore < 30, `Benign score ${benignScore} should be below 30`);
  assert.ok(severeScore > 70, `Severe score ${severeScore} should be above 70`);
});

test('evaluateSimulationExposure marks bridges and sectors at risk under GLOF conditions', () => {
  const glofParams = {
    ...DEFAULT_SIMULATION_PARAMETERS,
    riverDischargeCumecs: 2400,
    rainfallMm24h: 180,
    hazardScenario: 'GLOF_FLASH_FLOOD' as const,
  };

  const impact = evaluateSimulationExposure(glofParams);

  assert.ok(impact.criticalBridgesAtRisk.includes('Marwari Alaknanda Bridge'));
  assert.ok(impact.criticalBridgesAtRisk.includes('Vishnuprayag Confluence Suspension Bridge'));
  assert.ok(impact.buildingsExposedCount > 50);
  assert.equal(impact.carryingCapacityStressLevel, 'SEVERE_EXCEEDED');
});

test('generateSimulatedInundationGeoJSON produces valid GeoJSON polygon with disclaimer', () => {
  const geojson = generateSimulatedInundationGeoJSON(DEFAULT_SIMULATION_PARAMETERS);

  assert.equal(geojson.type, 'FeatureCollection');
  assert.ok(geojson.features.length > 0);
  const feature = geojson.features[0];
  assert.equal(feature.geometry.type, 'Polygon');
  assert.ok(
    String(feature.properties?.disclaimer).includes('SIMULATION — NOT A REAL-WORLD OBSERVATION'),
    'Disclaimer must be present in simulated layer properties'
  );
});

test('generateSimulatedCycloneGeoJSON produces spiral bands and eye with mandatory disclaimer', () => {
  const cycloneGeoJSON = generateSimulatedCycloneGeoJSON(DEFAULT_CYCLONE_PARAMS, 0.5);

  assert.equal(cycloneGeoJSON.type, 'FeatureCollection');
  assert.ok(cycloneGeoJSON.features.length >= 5, 'Should generate eye, track, and spiral bands');

  const eyeFeature = cycloneGeoJSON.features.find((f) => f.id === 'sim-cyclone-eye');
  assert.ok(eyeFeature, 'Eye feature must be present');
  assert.equal(eyeFeature?.geometry.type, 'Point');
  assert.ok(
    String(eyeFeature?.properties?.disclaimer).includes('SIMULATION — NOT REAL SATELLITE OBSERVATION'),
    'Mandatory disclaimer must be attached to simulated cyclone features'
  );

  const spiralBands = cycloneGeoJSON.features.filter((f) => String(f.id).startsWith('sim-spiral-band'));
  assert.ok(spiralBands.length >= 4, 'Should generate 4 spiral arms');
});

test('generateSimulatedAtmosphericRainImpactGeoJSON produces localized heavy rainfall polygon', () => {
  const rainGeoJSON = generateSimulatedAtmosphericRainImpactGeoJSON('EXTREME_RAINFALL_FLASH_FLOOD', 220);

  assert.equal(rainGeoJSON.type, 'FeatureCollection');
  assert.equal(rainGeoJSON.features.length, 1);
  const feature = rainGeoJSON.features[0];
  assert.equal(feature.geometry.type, 'Polygon');
  assert.equal(feature.properties?.rainfallMm24h, 220);
  assert.ok(
    String(feature.properties?.disclaimer).includes('SIMULATION — NOT REAL SATELLITE OBSERVATION'),
    'Mandatory disclaimer must be attached to simulated rain impact'
  );
});
