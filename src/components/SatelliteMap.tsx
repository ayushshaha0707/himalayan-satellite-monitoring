/**
 * TRINETRA — LAPTOP 1: SATELLITE OBSERVATION STATION
 * Interactive MapLibre GL JS Map Component
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import {
  Map as MapLibreMap,
  NavigationControl,
  ScaleControl,
  FullscreenControl,
  Marker,
  setWorkerUrl,
  type StyleSpecification,
  type RasterTileSource,
  type GeoJSONSource,
} from 'maplibre-gl';
import maplibreglWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';

// Fix Vite worker bundling for MapLibre GL JS
setWorkerUrl(maplibreglWorkerUrl);
import type { LayerConfig, BasemapId, SelectedFeature, OperatingMode } from '../types/index.ts';
import { BASEMAPS } from '../services/mapLayers.ts';
import {
  STUDY_AREA_CONFIG,
  RIVERS_GEOJSON,
  ROADS_GEOJSON,
  SETTLEMENTS_GEOJSON,
  BUILDINGS_GEOJSON,
  FACILITIES_GEOJSON,
  INSAR_DEFORMATION_GEOJSON,
  LANDSLIDE_INVENTORY_GEOJSON,
  ELEVATION_CONTOURS_GEOJSON,
} from '../services/geographicData.ts';
import {
  REAL_CLOUD_OBSERVATION_GEOJSON,
  REAL_WIND_CMV_GEOJSON,
  REAL_QPE_RAINFALL_GEOJSON,
} from '../services/atmosphericData.ts';
import type { FeatureCollection } from 'geojson';
import { Maximize2, Compass, RotateCcw, AlertTriangle, Eye, ShieldCheck, Info } from 'lucide-react';

interface SatelliteMapProps {
  activeBasemap: BasemapId;
  layers: LayerConfig[];
  mode: OperatingMode;
  simulatedInundationData: FeatureCollection | null;
  simulatedSlopeHazardData: FeatureCollection | null;
  simulatedCycloneData?: FeatureCollection | null;
  simulatedAtmosphericRainData?: FeatureCollection | null;
  selectedFeature: SelectedFeature | null;
  onFeatureSelect: (feature: SelectedFeature | null) => void;
  onCoordinatesChange: (coords: { lng: number; lat: number; elev?: number } | null) => void;
  onZoomChange: (zoom: number) => void;
  onMapInstanceReady: (map: MapLibreMap) => void;
}

export const SatelliteMap: React.FC<SatelliteMapProps> = ({
  activeBasemap,
  layers,
  mode,
  simulatedInundationData,
  simulatedSlopeHazardData,
  simulatedCycloneData,
  simulatedAtmosphericRainData,
  selectedFeature,
  onFeatureSelect,
  onCoordinatesChange,
  onZoomChange,
  onMapInstanceReady,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const selectedMarkerRef = useRef<Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  // Initialize MapLibre GL
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const basemapConfig = BASEMAPS[activeBasemap] || BASEMAPS.satellite;

    const initialStyle: maplibregl.StyleSpecification = {
      version: 8,
      sources: {
        'basemap-tiles': {
          type: 'raster',
          tiles: basemapConfig.tiles,
          tileSize: 256,
          attribution: basemapConfig.attribution,
          maxzoom: basemapConfig.maxZoom,
        },
      },
      layers: [
        {
          id: 'basemap-layer',
          type: 'raster',
          source: 'basemap-tiles',
          minzoom: 0,
          maxzoom: 22,
        },
      ],
    };

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: initialStyle,
      center: STUDY_AREA_CONFIG.center,
      zoom: STUDY_AREA_CONFIG.defaultZoom,
      minZoom: STUDY_AREA_CONFIG.minZoom,
      maxZoom: STUDY_AREA_CONFIG.maxZoom,
      pitch: 35, // 3D mountain perspective
      bearing: -15, // Oriented toward Alaknanda-Dhauliganga gorge
      attributionControl: { compact: true },
      preserveDrawingBuffer: true,
    } as unknown as maplibregl.MapOptions);

    // Add navigation and controls
    map.addControl(new NavigationControl({ visualizePitch: true }), 'top-right');
    map.addControl(new ScaleControl({ maxWidth: 120, unit: 'metric' }), 'bottom-left');

    map.on('load', () => {
      setMapLoaded(true);
      mapRef.current = map;
      onMapInstanceReady(map);
      onZoomChange(map.getZoom());
    });

    map.on('error', (e) => {
      // Gracefully catch any external tile network dropouts or CORS errors without throwing uncaught exceptions
      const msg = e?.error?.message || '';
      if (
        msg.includes('Failed to fetch') ||
        msg.includes('AJAXError') ||
        msg.includes('404') ||
        (e?.error as unknown as { status?: number })?.status === 0
      ) {
        return;
      }
      console.warn('[TRINETRA Map Notice]', e);
    });

    map.on('zoom', () => {
      onZoomChange(map.getZoom());
    });

    map.on('mousemove', (e) => {
      onCoordinatesChange({
        lng: e.lngLat.lng,
        lat: e.lngLat.lat,
      });
    });

    map.on('mouseout', () => {
      onCoordinatesChange(null);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update basemap when activeBasemap prop changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const basemapConfig = BASEMAPS[activeBasemap] || BASEMAPS.satellite;
    const style = map.getStyle();

    if (style && style.sources && style.sources['basemap-tiles']) {
      // Update raster source tiles
      const source = map.getSource('basemap-tiles') as maplibregl.RasterTileSource;
      if (source && source.setTiles) {
        source.setTiles(basemapConfig.tiles);
      }
    }
  }, [activeBasemap, mapLoaded]);

  // Load and configure GeoJSON layers once map is loaded
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Helper to safely add or update GeoJSON source
    const setGeoJsonSource = (id: string, data: FeatureCollection) => {
      const existing = map.getSource(id) as maplibregl.GeoJSONSource;
      if (existing) {
        existing.setData(data);
      } else {
        map.addSource(id, {
          type: 'geojson',
          data,
        });
      }
    };

    // 1. Rivers & Waterways
    setGeoJsonSource('source-rivers', RIVERS_GEOJSON);
    if (!map.getLayer('layer-rivers-main')) {
      map.addLayer({
        id: 'layer-rivers-main',
        type: 'line',
        source: 'source-rivers',
        filter: ['==', 'type', 'major_river'],
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#06b6d4',
          'line-width': ['interpolate', ['linear'], ['zoom'], 11, 3.5, 16, 9],
          'line-opacity': 0.95,
        },
      });

      map.addLayer({
        id: 'layer-rivers-tributary',
        type: 'line',
        source: 'source-rivers',
        filter: ['in', 'type', 'major_tributary', 'tributary_stream', 'spring_channel'],
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#38bdf8',
          'line-width': ['interpolate', ['linear'], ['zoom'], 11, 2, 16, 5],
          'line-opacity': 0.85,
        },
      });

      map.addLayer({
        id: 'layer-rivers-confluence-point',
        type: 'circle',
        source: 'source-rivers',
        filter: ['==', 'type', 'river_confluence'],
        paint: {
          'circle-radius': 9,
          'circle-color': '#00e5ff',
          'circle-stroke-width': 2.5,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.9,
        },
      });
    }

    // 2. Roads & Infrastructure
    setGeoJsonSource('source-roads', ROADS_GEOJSON);
    if (!map.getLayer('layer-roads-nh7')) {
      map.addLayer({
        id: 'layer-roads-nh7',
        type: 'line',
        source: 'source-roads',
        filter: ['in', 'type', 'national_highway', 'strategic_bypass'],
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#f59e0b',
          'line-width': ['interpolate', ['linear'], ['zoom'], 11, 2.8, 16, 7],
          'line-opacity': 0.95,
        },
      });

      map.addLayer({
        id: 'layer-roads-local',
        type: 'line',
        source: 'source-roads',
        filter: ['in', 'type', 'mountain_road', 'urban_collector'],
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#e2e8f0',
          'line-width': ['interpolate', ['linear'], ['zoom'], 11, 1.5, 16, 3.5],
          'line-opacity': 0.75,
          'line-dasharray': [3, 1],
        },
      });

      map.addLayer({
        id: 'layer-bridges',
        type: 'circle',
        source: 'source-roads',
        filter: ['==', 'type', 'bridge'],
        paint: {
          'circle-radius': 8,
          'circle-color': '#eab308',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#0f172a',
        },
      });
    }

    // 3. Wards & Settlements
    setGeoJsonSource('source-settlements', SETTLEMENTS_GEOJSON);
    if (!map.getLayer('layer-settlements-wards')) {
      map.addLayer({
        id: 'layer-settlements-wards',
        type: 'fill',
        source: 'source-settlements',
        filter: ['==', '$type', 'Polygon'],
        paint: {
          'fill-color': '#6366f1',
          'fill-opacity': 0.25,
          'fill-outline-color': '#818cf8',
        },
      });

      map.addLayer({
        id: 'layer-settlements-borders',
        type: 'line',
        source: 'source-settlements',
        filter: ['==', '$type', 'Polygon'],
        paint: {
          'line-color': '#818cf8',
          'line-width': 2,
          'line-dasharray': [2, 2],
        },
      });
    }

    // 4. Mapped Building Footprints
    setGeoJsonSource('source-buildings', BUILDINGS_GEOJSON);
    if (!map.getLayer('layer-building-footprints')) {
      map.addLayer({
        id: 'layer-building-footprints',
        type: 'fill',
        source: 'source-buildings',
        paint: {
          'fill-color': '#cbd5e1',
          'fill-opacity': 0.8,
          'fill-outline-color': '#475569',
        },
      });
    }

    // 5. Critical Healthcare & Facilities
    setGeoJsonSource('source-facilities', FACILITIES_GEOJSON);
    if (!map.getLayer('layer-facilities-health')) {
      map.addLayer({
        id: 'layer-facilities-health',
        type: 'circle',
        source: 'source-facilities',
        filter: ['in', 'type', 'hospital', 'military_hospital'],
        paint: {
          'circle-radius': 9,
          'circle-color': '#ef4444',
          'circle-stroke-width': 2.5,
          'circle-stroke-color': '#ffffff',
        },
      });

      map.addLayer({
        id: 'layer-facilities-schools-emergency',
        type: 'circle',
        source: 'source-facilities',
        filter: ['in', 'type', 'school', 'emergency_response', 'fire_station', 'police_station'],
        paint: {
          'circle-radius': 7.5,
          'circle-color': '#10b981',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });
    }

    // 6. Elevation Contours (Copernicus DEM 30m)
    setGeoJsonSource('source-contours', ELEVATION_CONTOURS_GEOJSON);
    if (!map.getLayer('layer-elevation-contours')) {
      map.addLayer({
        id: 'layer-elevation-contours',
        type: 'line',
        source: 'source-contours',
        paint: {
          'line-color': '#84cc16',
          'line-width': 1.2,
          'line-opacity': 0.6,
        },
      });
    }

    // 7. Landslide Inventory (GSI)
    setGeoJsonSource('source-landslide-inventory', LANDSLIDE_INVENTORY_GEOJSON);
    if (!map.getLayer('layer-landslide-inventory')) {
      map.addLayer({
        id: 'layer-landslide-inventory',
        type: 'fill',
        source: 'source-landslide-inventory',
        filter: ['==', '$type', 'Polygon'],
        paint: {
          'fill-color': '#f97316',
          'fill-opacity': 0.22,
          'fill-outline-color': '#ea580c',
        },
      });

      map.addLayer({
        id: 'layer-landslide-scarps',
        type: 'line',
        source: 'source-landslide-inventory',
        filter: ['==', '$type', 'LineString'],
        paint: {
          'line-color': '#dc2626',
          'line-width': 3,
          'line-dasharray': [4, 2],
        },
      });
    }

    // 8. InSAR Surface Deformation Benchmarks (ISRO-IIRS)
    setGeoJsonSource('source-insar', INSAR_DEFORMATION_GEOJSON);
    if (!map.getLayer('layer-insar-displacement')) {
      map.addLayer({
        id: 'layer-insar-displacement',
        type: 'circle',
        source: 'source-insar',
        paint: {
          'circle-radius': 8.5,
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'lineOfSightDisplacementMm'],
            -70, '#e11d48', // High subsidence: deep rose
            -40, '#f59e0b', // Moderate subsidence: amber
            0, '#10b981',   // Stable reference: emerald
          ],
          'circle-stroke-width': 2.5,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.95,
        },
      });
    }

    // 9. Atmospheric & Meteorological Layers (ISRO MOSDAC / INSAT-3DS / IMD)
    setGeoJsonSource('source-atmos-cloud-vis', REAL_CLOUD_OBSERVATION_GEOJSON);
    if (!map.getLayer('layer-atmos-cloud-vis')) {
      map.addLayer({
        id: 'layer-atmos-cloud-vis',
        type: 'fill',
        source: 'source-atmos-cloud-vis',
        layout: { visibility: 'visible' },
        paint: {
          'fill-color': '#f8fafc',
          'fill-opacity': 0.55,
          'fill-outline-color': '#cbd5e1',
        },
      });
    }

    setGeoJsonSource('source-atmos-cloud-ir', REAL_CLOUD_OBSERVATION_GEOJSON);
    if (!map.getLayer('layer-atmos-cloud-ir')) {
      map.addLayer({
        id: 'layer-atmos-cloud-ir',
        type: 'fill',
        source: 'source-atmos-cloud-ir',
        layout: { visibility: 'visible' },
        paint: {
          'fill-color': '#9333ea',
          'fill-opacity': 0.5,
          'fill-outline-color': '#c084fc',
        },
      });
    }

    if (!map.getLayer('layer-atmos-water-vapor')) {
      map.addLayer({
        id: 'layer-atmos-water-vapor',
        type: 'fill',
        source: 'source-atmos-cloud-ir',
        layout: { visibility: 'none' },
        paint: {
          'fill-color': '#0284c7',
          'fill-opacity': 0.45,
          'fill-outline-color': '#38bdf8',
        },
      });
    }

    if (!map.getLayer('layer-atmos-cloud-cover')) {
      map.addLayer({
        id: 'layer-atmos-cloud-cover',
        type: 'fill',
        source: 'source-atmos-cloud-vis',
        layout: { visibility: 'visible' },
        paint: {
          'fill-color': '#94a3b8',
          'fill-opacity': 0.35,
          'fill-outline-color': '#64748b',
        },
      });
    }

    // 10. Wind Streamlines & Cloud Motion Vectors (CMVs)
    setGeoJsonSource('source-atmos-wind-cmv', REAL_WIND_CMV_GEOJSON);
    if (!map.getLayer('layer-atmos-wind-vectors')) {
      map.addLayer({
        id: 'layer-atmos-wind-vectors',
        type: 'line',
        source: 'source-atmos-wind-cmv',
        filter: ['==', '$type', 'LineString'],
        layout: { visibility: 'visible', 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#eab308',
          'line-width': 3.5,
          'line-dasharray': [3, 2],
        },
      });

      map.addLayer({
        id: 'layer-atmos-cloud-motion-vectors',
        type: 'circle',
        source: 'source-atmos-wind-cmv',
        filter: ['==', '$type', 'Point'],
        layout: { visibility: 'visible' },
        paint: {
          'circle-radius': 7.5,
          'circle-color': '#00f5ff',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#0f172a',
          'circle-opacity': 0.95,
        },
      });
    }

    // 11. Rainfall Estimates (QPE / HEM) & NWP Precipitation
    setGeoJsonSource('source-atmos-qpe-rain', REAL_QPE_RAINFALL_GEOJSON);
    if (!map.getLayer('layer-atmos-rainfall-estimate')) {
      map.addLayer({
        id: 'layer-atmos-rainfall-estimate',
        type: 'fill',
        source: 'source-atmos-qpe-rain',
        layout: { visibility: 'visible' },
        paint: {
          'fill-color': '#10b981',
          'fill-opacity': 0.45,
          'fill-outline-color': '#059669',
        },
      });

      map.addLayer({
        id: 'layer-atmos-precipitation-forecast',
        type: 'fill',
        source: 'source-atmos-qpe-rain',
        layout: { visibility: 'none' },
        paint: {
          'fill-color': '#06b6d4',
          'fill-opacity': 0.4,
          'fill-outline-color': '#0891b2',
        },
      });
    }

    // Wire up feature click inspection across all vector layers
    const interactiveLayerIds = [
      'layer-rivers-main',
      'layer-rivers-tributary',
      'layer-rivers-confluence-point',
      'layer-roads-nh7',
      'layer-roads-local',
      'layer-bridges',
      'layer-settlements-wards',
      'layer-building-footprints',
      'layer-facilities-health',
      'layer-facilities-schools-emergency',
      'layer-elevation-contours',
      'layer-landslide-inventory',
      'layer-landslide-scarps',
      'layer-insar-displacement',
      'layer-atmos-cloud-vis',
      'layer-atmos-cloud-ir',
      'layer-atmos-water-vapor',
      'layer-atmos-cloud-cover',
      'layer-atmos-cloud-motion-vectors',
      'layer-atmos-wind-vectors',
      'layer-atmos-rainfall-estimate',
      'layer-atmos-precipitation-forecast',
      'layer-atmos-simulated-cloud-bands',
      'layer-atmos-cyclone-track',
      'layer-atmos-simulated-rainfall-impact',
    ];

    interactiveLayerIds.forEach((layerId) => {
      map.on('click', layerId, (e) => {
        if (!e.features || e.features.length === 0) return;
        const feat = e.features[0];
        const geom = feat.geometry;
        let coords: [number, number] = [e.lngLat.lng, e.lngLat.lat];
        if (geom.type === 'Point') {
          coords = geom.coordinates as [number, number];
        }

        const props = (feat.properties || {}) as Record<string, unknown>;
        const featureObj: SelectedFeature = {
          id: String(feat.id || props.id || 'feat-' + Math.random().toString(36).substring(2, 7)),
          name: String(props.name || props.id || 'Unnamed Geographic Feature'),
          type: String(props.type || props.category || feat.layer.type),
          category: String(props.category || feat.layer.id),
          sourceDataset: String(props.sourceDataset || 'OpenStreetMap / Survey of India'),
          coordinates: coords,
          elevationMeters: props.elevationMeters ? Number(props.elevationMeters) : undefined,
          geometryType: geom.type,
          properties: props,
        };

        onFeatureSelect(featureObj);
      });

      map.on('mouseenter', layerId, () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', layerId, () => {
        map.getCanvas().style.cursor = '';
      });
    });
  }, [mapLoaded, onFeatureSelect]);

  // Sync layer visibility based on LayerConfig props
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    layers.forEach((layerConfig) => {
      const visibility = layerConfig.enabled ? 'visible' : 'none';
      if (map.getLayer(layerConfig.id)) {
        map.setLayoutProperty(layerConfig.id, 'visibility', visibility);
      }
      // Also sync subsidiary layers (like tributary streams or scarps)
      if (layerConfig.id === 'layer-rivers-main' && map.getLayer('layer-rivers-tributary')) {
        map.setLayoutProperty('layer-rivers-tributary', 'visibility', visibility);
        if (map.getLayer('layer-rivers-confluence-point')) {
          map.setLayoutProperty('layer-rivers-confluence-point', 'visibility', visibility);
        }
      }
      if (layerConfig.id === 'layer-roads-nh7' && map.getLayer('layer-roads-local')) {
        map.setLayoutProperty('layer-roads-local', 'visibility', visibility);
      }
      if (layerConfig.id === 'layer-landslide-inventory' && map.getLayer('layer-landslide-scarps')) {
        map.setLayoutProperty('layer-landslide-scarps', 'visibility', visibility);
      }
      if (layerConfig.id === 'layer-settlements-wards' && map.getLayer('layer-settlements-borders')) {
        map.setLayoutProperty('layer-settlements-borders', 'visibility', visibility);
      }
    });
  }, [layers, mapLoaded]);

  // Sync Simulated layers when in SIMULATION mode
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const isSimMode = mode === 'SIMULATION';

    // Simulated Inundation Layer
    if (simulatedInundationData) {
      const source = map.getSource('source-sim-flood') as maplibregl.GeoJSONSource;
      if (source) {
        source.setData(simulatedInundationData);
      } else {
        map.addSource('source-sim-flood', {
          type: 'geojson',
          data: simulatedInundationData,
        });
      }

      if (!map.getLayer('layer-simulated-flood')) {
        map.addLayer({
          id: 'layer-simulated-flood',
          type: 'fill',
          source: 'source-sim-flood',
          layout: { visibility: isSimMode ? 'visible' : 'none' },
          paint: {
            'fill-color': '#0284c7',
            'fill-opacity': 0.55,
            'fill-outline-color': '#38bdf8',
          },
        });
      } else {
        map.setLayoutProperty('layer-simulated-flood', 'visibility', isSimMode ? 'visible' : 'none');
      }
    }

    // Simulated Slope Failure Corridor
    if (simulatedSlopeHazardData) {
      const source = map.getSource('source-sim-slope') as maplibregl.GeoJSONSource;
      if (source) {
        source.setData(simulatedSlopeHazardData);
      } else {
        map.addSource('source-sim-slope', {
          type: 'geojson',
          data: simulatedSlopeHazardData,
        });
      }

      if (!map.getLayer('layer-simulated-slope-hazard')) {
        map.addLayer({
          id: 'layer-simulated-slope-hazard',
          type: 'fill',
          source: 'source-sim-slope',
          layout: { visibility: isSimMode ? 'visible' : 'none' },
          paint: {
            'fill-color': '#dc2626',
            'fill-opacity': 0.45,
            'fill-outline-color': '#f87171',
          },
        });
      } else {
        map.setLayoutProperty('layer-simulated-slope-hazard', 'visibility', isSimMode ? 'visible' : 'none');
      }
    }

    // Simulated Cyclone Cloud Bands & Track
    if (simulatedCycloneData) {
      const source = map.getSource('source-sim-cyclone') as maplibregl.GeoJSONSource;
      if (source) {
        source.setData(simulatedCycloneData);
      } else {
        map.addSource('source-sim-cyclone', {
          type: 'geojson',
          data: simulatedCycloneData,
        });
      }

      if (!map.getLayer('layer-atmos-simulated-cloud-bands')) {
        map.addLayer({
          id: 'layer-atmos-simulated-cloud-bands',
          type: 'line',
          source: 'source-sim-cyclone',
          filter: ['==', '$type', 'LineString'],
          layout: { visibility: isSimMode ? 'visible' : 'none' },
          paint: {
            'line-color': '#f43f5e',
            'line-width': 4.5,
            'line-opacity': 0.85,
          },
        });

        map.addLayer({
          id: 'layer-atmos-cyclone-track',
          type: 'circle',
          source: 'source-sim-cyclone',
          filter: ['==', '$type', 'Point'],
          layout: { visibility: isSimMode ? 'visible' : 'none' },
          paint: {
            'circle-radius': 9,
            'circle-color': '#dc2626',
            'circle-stroke-width': 2.5,
            'circle-stroke-color': '#ffffff',
          },
        });
      } else {
        map.setLayoutProperty('layer-atmos-simulated-cloud-bands', 'visibility', isSimMode ? 'visible' : 'none');
        if (map.getLayer('layer-atmos-cyclone-track')) {
          map.setLayoutProperty('layer-atmos-cyclone-track', 'visibility', isSimMode ? 'visible' : 'none');
        }
      }
    }

    // Simulated Heavy Rainfall Impact Zone
    if (simulatedAtmosphericRainData) {
      const source = map.getSource('source-sim-atmos-rain') as maplibregl.GeoJSONSource;
      if (source) {
        source.setData(simulatedAtmosphericRainData);
      } else {
        map.addSource('source-sim-atmos-rain', {
          type: 'geojson',
          data: simulatedAtmosphericRainData,
        });
      }

      if (!map.getLayer('layer-atmos-simulated-rainfall-impact')) {
        map.addLayer({
          id: 'layer-atmos-simulated-rainfall-impact',
          type: 'fill',
          source: 'source-sim-atmos-rain',
          layout: { visibility: isSimMode ? 'visible' : 'none' },
          paint: {
            'fill-color': '#dc2626',
            'fill-opacity': 0.5,
            'fill-outline-color': '#ef4444',
          },
        });
      } else {
        map.setLayoutProperty('layer-atmos-simulated-rainfall-impact', 'visibility', isSimMode ? 'visible' : 'none');
      }
    }
  }, [mode, simulatedInundationData, simulatedSlopeHazardData, simulatedCycloneData, simulatedAtmosphericRainData, mapLoaded]);

  // Sync Selected Feature Marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.remove();
      selectedMarkerRef.current = null;
    }

    if (selectedFeature) {
      const el = document.createElement('div');
      el.className = 'w-7 h-7 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none';
      el.innerHTML = `
        <div class="relative flex items-center justify-center w-full h-full">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-300 ring-2 ring-white shadow-[0_0_12px_#00e5ff]"></span>
        </div>
      `;
      const marker = new Marker({ element: el })
        .setLngLat(selectedFeature.coordinates)
        .addTo(map);
      selectedMarkerRef.current = marker;
    }
  }, [selectedFeature, mapLoaded]);

  // Reset to Joshimath-Vishnuprayag study area
  const handleResetStudyArea = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    setIsResetting(true);
    map.flyTo({
      center: STUDY_AREA_CONFIG.center,
      zoom: STUDY_AREA_CONFIG.defaultZoom,
      pitch: 35,
      bearing: -15,
      essential: true,
      duration: 1200,
    });
    setTimeout(() => setIsResetting(false), 1200);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950" data-testid="satellite-map-container">
      {/* MapLibre DOM Node */}
      <div ref={mapContainerRef} className="w-full h-full select-none" />

      {/* Mode Status Watermark & Scientific Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 pointer-events-none">
        {mode === 'SIMULATION' ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-950/90 border border-amber-500/70 text-amber-200 text-xs font-mono-tech shadow-xl backdrop-blur-md animate-pulse">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-semibold tracking-wide">
              SIMULATION — NOT A REAL-WORLD OBSERVATION OR OFFICIAL WARNING.
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/85 border border-cyan-500/40 text-cyan-200 text-xs font-mono-tech shadow-xl backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>REAL GEOSPATIAL OBSERVATION // JOSHIMATH EXTENT</span>
          </div>
        )}
      </div>

      {/* Top Center: Real Observation Status Verification notice */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 hidden md:flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900/90 border border-slate-700/80 text-[11px] font-mono-tech text-slate-300 shadow-md backdrop-blur-sm pointer-events-none">
        <Info className="w-3.5 h-3.5 text-cyan-400" />
        <span>ESRI World Imagery + Copernicus Sentinel-1 InSAR Benchmarks Active</span>
      </div>

      {/* Floating Map Actions (Reset Extent, Re-orient North) */}
      <div className="absolute bottom-20 right-3 z-20 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleResetStudyArea}
          disabled={isResetting}
          aria-label="Reset Map to Joshimath Extent"
          className="p-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-cyan-300 hover:text-cyan-200 border border-slate-700 shadow-xl backdrop-blur-md transition-all cursor-pointer flex items-center justify-center group"
          title="Reset Extent to Joshimath & Vishnuprayag"
        >
          <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : 'group-hover:-rotate-45 transition-transform'}`} />
        </button>

        <button
          type="button"
          onClick={() => {
            if (mapRef.current) mapRef.current.resetNorthPitch({ duration: 800 });
          }}
          aria-label="Orient Map North"
          className="p-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 shadow-xl backdrop-blur-md transition-all cursor-pointer flex items-center justify-center"
          title="Reset Bearing to True North"
        >
          <Compass className="w-4 h-4 text-emerald-400" />
        </button>
      </div>
    </div>
  );
};
