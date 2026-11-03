/**
 * TRINETRA — HIMALAYAN SATELLITE MONITORING STATION
 * Layer configurations, styles, and basemap definitions.
 */

import type { LayerConfig, BasemapId } from '../types/index.ts';
import { ATMOSPHERIC_LAYERS } from './atmosphericData.ts';

export interface BasemapOption {
  id: BasemapId;
  name: string;
  category: 'satellite' | 'terrain' | 'dark' | 'osm';
  tiles: string[];
  maxZoom: number;
  attribution: string;
  description: string;
}

export const BASEMAPS: Record<BasemapId, BasemapOption> = {
  satellite: {
    id: 'satellite',
    name: 'Satellite Optical (High-Res Aerial)',
    category: 'satellite',
    // ESRI World Imagery (globally permitted public tile endpoint with attribution)
    tiles: [
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    ],
    maxZoom: 19,
    attribution: 'Esri, Maxar, Earthstar Geographics, CNES/Airbus DS, USGS, AeroGRID, IGN, and GIS User Community',
    description: 'High-resolution true-color satellite basemap covering Joshimath, Alaknanda gorge, and Nanda Devi foothills.',
  },
  terrain: {
    id: 'terrain',
    name: 'Topographic Terrain & Contours (ESRI Topo)',
    category: 'terrain',
    tiles: [
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    ],
    maxZoom: 19,
    attribution: 'Esri, HERE, Garmin, Intermap, increment P Corp., GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
    description: 'High-precision elevation contours, hillshade relief, and topographic hypsometry suited for steep Himalayan mountain terrain.',
  },
  dark: {
    id: 'dark',
    name: 'Cartographic Dark Canvas (ESRI Dark)',
    category: 'dark',
    tiles: [
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    ],
    maxZoom: 19,
    attribution: 'Esri, HERE, Garmin, © OpenStreetMap contributors, and the GIS User Community',
    description: 'High-contrast dark gray cartographic basemap designed for multi-layer visual clarity and telemetry overlays.',
  },
  osm: {
    id: 'osm',
    name: 'Civil Reference & Street Map (ESRI Street)',
    category: 'osm',
    tiles: [
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    ],
    maxZoom: 19,
    attribution: 'Esri, HERE, Garmin, USGS, Intermap, INCREMENT P, NRCan, Esri Japan, METI, Esri China (Hong Kong), Esri Korea, Esri (Thailand), NGCC, © OpenStreetMap contributors, and the GIS User Community',
    description: 'Standard civil cartography with verified street names, landmarks, and administrative boundaries.',
  },
};

export const DEFAULT_LAYERS: LayerConfig[] = [
  {
    id: 'layer-roads-nh7',
    name: 'Roads & Highways (NH-7 / Auli)',
    category: 'transport',
    enabled: true,
    opacity: 0.95,
    color: '#f59e0b', // Amber
    sourceType: 'geojson',
    sourceDataset: 'OpenStreetMap / MoRTH Uttarakhand',
    attribution: '© OpenStreetMap contributors, MoRTH',
    description: 'NH-7 Badrinath Marg, Auli mountain ascent road, Helang-Marwari bypass, and local pathways.',
  },
  {
    id: 'layer-bridges',
    name: 'Strategic Bridges & Crossings',
    category: 'transport',
    enabled: true,
    opacity: 1.0,
    color: '#eab308', // Yellow
    sourceType: 'geojson',
    sourceDataset: 'Border Roads Organisation / PWD Chamoli',
    attribution: 'BRO, PWD Chamoli',
    description: 'Marwari Alaknanda Bridge, Vishnuprayag Suspension Bridge, and mountain crossings.',
  },
  {
    id: 'layer-rivers-main',
    name: 'Alaknanda & Dhauliganga Rivers',
    category: 'hydrology',
    enabled: true,
    opacity: 0.9,
    color: '#06b6d4', // Cyan
    sourceType: 'geojson',
    sourceDataset: 'OpenStreetMap / Central Water Commission',
    attribution: 'CWC India, © OpenStreetMap',
    description: 'Major Himalayan glacial rivers meeting at the sacred Vishnuprayag confluence.',
  },
  {
    id: 'layer-streams-drainage',
    name: 'Tributaries & Drainage Nullahs',
    category: 'hydrology',
    enabled: true,
    opacity: 0.85,
    color: '#38bdf8', // Sky blue
    sourceType: 'geojson',
    sourceDataset: 'Chamoli DDMA / Wadia Institute',
    attribution: 'DDMA Chamoli, WIHG',
    description: 'Kansur nullah, Marwari spring channels, and mountain torrents carrying runoff down the slope.',
  },
  {
    id: 'layer-settlements-wards',
    name: 'Habitation Wards & Boundaries',
    category: 'habitation',
    enabled: true,
    opacity: 0.45,
    color: '#6366f1', // Indigo
    sourceType: 'geojson',
    sourceDataset: 'Joshimath Nagar Palika / NDMA',
    attribution: 'Nagar Palika Joshimath, NDMA 2023 Survey',
    description: 'Official sector boundaries: Sunil, Manohar Bagh, Gandhinagar, Marwari, Singhdhar, Ravigram.',
  },
  {
    id: 'layer-building-footprints',
    name: 'Mapped Building Footprints',
    category: 'habitation',
    enabled: true,
    opacity: 0.8,
    color: '#94a3b8', // Slate silver
    sourceType: 'geojson',
    sourceDataset: 'OpenStreetMap / CBRI Structural Survey',
    attribution: '© OpenStreetMap, CSIR-CBRI',
    description: 'Individually mapped building footprints, hotels, residential blocks, and public infrastructure.',
  },
  {
    id: 'layer-facilities-health',
    name: 'Hospitals & Health Centers',
    category: 'facilities',
    enabled: true,
    opacity: 1.0,
    color: '#ef4444', // Red
    sourceType: 'geojson',
    sourceDataset: 'Directorate of Medical Health & Family Welfare, Uttarakhand',
    attribution: 'Health Dept Uttarakhand',
    description: 'CHC Joshimath, Garhwal Scouts Military Hospital, and Sunil Primary Health Center.',
  },
  {
    id: 'layer-facilities-schools-emergency',
    name: 'Schools & Emergency Response',
    category: 'facilities',
    enabled: true,
    opacity: 1.0,
    color: '#10b981', // Emerald
    sourceType: 'geojson',
    sourceDataset: 'Uttarakhand SDRF / Fire Services / Education Dept',
    attribution: 'SDRF, Fire & Emergency Uttarakhand',
    description: 'Kendriya Vidyalaya, GIC Joshimath, SDRF Outpost, Fire Station, and Police Station.',
  },
  {
    id: 'layer-elevation-contours',
    name: 'Elevation Contours (100m Interval)',
    category: 'terrain',
    enabled: true,
    opacity: 0.65,
    color: '#84cc16', // Lime
    sourceType: 'geojson',
    sourceDataset: 'Copernicus DEM GLO-30 / ALOS PALSAR',
    attribution: 'Copernicus DEM 30m © European Space Agency',
    description: 'Hypsometric contours from 1,300m at Vishnuprayag riverbed to 2,400m along the upper ridge.',
  },
  {
    id: 'layer-landslide-inventory',
    name: 'Landslide Inventory & Crown Scarps',
    category: 'geohazards',
    enabled: true,
    opacity: 0.65,
    color: '#f97316', // Orange
    sourceType: 'geojson',
    sourceDataset: 'Geological Survey of India (GSI) / Mishra Committee Report',
    attribution: 'GSI Special Publication / NDMA',
    observationDate: '2023 Historical Inventory',
    description: 'Joshimath paleo-landslide moraine deposit boundary and documented crown tension scarps.',
  },
  {
    id: 'layer-insar-displacement',
    name: 'Sentinel-1 InSAR Surface Deformation',
    category: 'geohazards',
    enabled: true,
    opacity: 0.95,
    color: '#ec4899', // Pink / Magenta
    sourceType: 'geojson',
    sourceDataset: 'ISRO-IIRS / Copernicus Sentinel-1 C-Band SAR',
    attribution: 'ISRO Indian Institute of Remote Sensing (IIRS) / ESA Copernicus',
    observationDate: '27 Dec 2022 – 08 Jan 2023',
    description: 'Calibrated InSAR Line-of-Sight surface deformation benchmarks showing rapid subsidence (-54mm).',
  },
  {
    id: 'layer-simulated-flood',
    name: 'Simulated Flood Inundation Buffer',
    category: 'simulation',
    enabled: false,
    opacity: 0.6,
    color: '#0284c7', // Deep sky blue
    sourceType: 'geojson',
    sourceDataset: 'TRINETRA Hydrodynamic Gorge Simulation Model',
    attribution: 'TRINETRA Inundation Engine (Demonstration Model)',
    isSimulated: true,
    description: 'Computational flood corridor along Alaknanda and Dhauliganga gorge based on discharge parameters.',
  },
  {
    id: 'layer-simulated-slope-hazard',
    name: 'Simulated Slope Reactivation Corridor',
    category: 'simulation',
    enabled: false,
    opacity: 0.55,
    color: '#dc2626', // Crimson red
    sourceType: 'geojson',
    sourceDataset: 'TRINETRA Geotechnical Simulation Subsystem',
    attribution: 'TRINETRA Slope Engine (Demonstration Model)',
    isSimulated: true,
    description: 'Computational slope failure runout zone driven by rainfall and soil moisture saturation.',
  },
  ...ATMOSPHERIC_LAYERS,
];
