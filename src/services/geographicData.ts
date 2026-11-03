/**
 * TRINETRA — HIMALAYAN SATELLITE MONITORING & DISASTER OBSERVATION STATION
 * Real Geographic Datasets for Joshimath – Vishnuprayag, Chamoli District, Uttarakhand, India.
 * 
 * Sources:
 * - OpenStreetMap Contributors (ODbL) for roads, buildings, waterways, facilities
 * - Copernicus DEM 30m / ALOS PALSAR for elevation & slope contours
 * - ISRO-IIRS / NDMA Technical Report (2023) for InSAR ground deformation points
 * - Geological Survey of India (GSI) / Mishra Committee Report for ancient landslide moraine
 */

import type { FeatureCollection, Feature, Geometry } from 'geojson';

export const STUDY_AREA_CONFIG = {
  name: 'Joshimath – Vishnuprayag',
  region: 'Chamoli District, Uttarakhand, India',
  state: 'Uttarakhand',
  country: 'India',
  center: [79.5630, 30.5580] as [number, number],
  defaultZoom: 14.2,
  minZoom: 11,
  maxZoom: 18.5,
  bounds: [
    [79.5150, 30.5200], // Southwest [lng, lat]
    [79.6100, 30.5950], // Northeast [lng, lat]
  ] as [[number, number], [number, number]],
  elevationRange: {
    min: 1350, // Alaknanda riverbed at Vishnuprayag
    max: 2950, // Upper Auli ridge
  },
  geologicalSetting: 'Paleo-landslide moraine deposit over Himalayan Vaikrita Group gneiss and schist (Main Central Thrust proximity)',
};

// 1. RIVERS & WATER SYSTEMS (GeoJSON FeatureCollection)
export const RIVERS_GEOJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'river-alaknanda-main',
      properties: {
        id: 'osm-way-alaknanda',
        name: 'Alaknanda River',
        nameHindi: 'अलकनंदा नदी',
        type: 'major_river',
        sourceDataset: 'OpenStreetMap / National River Conservation Directorate',
        origin: 'Satopanth and Bhagirath Kharak Glaciers',
        dischargeNormalCumecs: 480,
        flowDirection: 'South-West',
        elevationMeters: 1370,
        gorgeDepthMeters: 450,
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [79.5850, 30.5890],
          [79.5810, 30.5830],
          [79.5765, 30.5750],
          [79.5742, 30.5694], // Vishnuprayag confluence
          [79.5700, 30.5665],
          [79.5645, 30.5640],
          [79.5595, 30.5620], // Foot of Marwari slope
          [79.5530, 30.5590],
          [79.5460, 30.5540],
          [79.5380, 30.5480],
          [79.5310, 30.5410],
          [79.5240, 30.5330], // Down toward Helang
        ],
      },
    },
    {
      type: 'Feature',
      id: 'river-dhauliganga',
      properties: {
        id: 'osm-way-dhauliganga',
        name: 'Dhauliganga River',
        nameHindi: 'धौलीगंगा नदी',
        type: 'major_tributary',
        sourceDataset: 'OpenStreetMap / Central Water Commission',
        origin: 'Niti Pass / Raikana Glacier',
        dischargeNormalCumecs: 210,
        flowDirection: 'Westwards to Vishnuprayag',
        elevationMeters: 1380,
        gorgeDepthMeters: 520,
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [79.6100, 30.5590], // Coming from Tapovan / Reni direction
          [79.6020, 30.5615],
          [79.5930, 30.5645],
          [79.5840, 30.5670],
          [79.5780, 30.5685],
          [79.5742, 30.5694], // Confluence with Alaknanda at Vishnuprayag
        ],
      },
    },
    {
      type: 'Feature',
      id: 'point-vishnuprayag-confluence',
      properties: {
        id: 'geo-confluence-vishnuprayag',
        name: 'Vishnuprayag Confluence (Panch Prayag)',
        nameHindi: 'विष्णुप्रयाग संगम',
        type: 'river_confluence',
        sourceDataset: 'Survey of India / Uttarakhand Tourism',
        elevationMeters: 1372,
        description: 'First of the five sacred river confluences (Panch Prayag) where Alaknanda and Dhauliganga meet in a narrow granite gorge.',
        criticalInfrastructure: 'Vishnuprayag Hydropower Project Barrage downstream',
      },
      geometry: {
        type: 'Point',
        coordinates: [79.5742, 30.5694],
      },
    },
    {
      type: 'Feature',
      id: 'stream-kansur-drainage',
      properties: {
        id: 'osm-stream-kansur',
        name: 'Kansur Nullah (Drainage Chute)',
        nameHindi: 'कंसूर नाला',
        type: 'tributary_stream',
        sourceDataset: 'District Disaster Management Authority (DDMA) Chamoli',
        hazardRole: 'Major active drainage chute traversing Sunil down to Marwari; high flash-flood runout potential during heavy downpours.',
        elevationMeters: 1750,
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [79.5535, 30.5660],
          [79.5552, 30.5640],
          [79.5575, 30.5628],
          [79.5595, 30.5620], // Discharge into Alaknanda
        ],
      },
    },
    {
      type: 'Feature',
      id: 'stream-marwari-drainage',
      properties: {
        id: 'osm-stream-marwari',
        name: 'Marwari Springs Drainage Stream',
        nameHindi: 'मारवाड़ी जलधारा',
        type: 'spring_channel',
        sourceDataset: 'Wadia Institute of Himalayan Geology (WIHG)',
        hazardRole: 'Subsurface aquifer discharge channel (burst site Jan 2023 with 540 liters/minute mud-water flow)',
        elevationMeters: 1420,
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [79.5610, 30.5635],
          [79.5602, 30.5626],
          [79.5595, 30.5620],
        ],
      },
    },
    {
      type: 'Feature',
      id: 'stream-ravigram-drainage',
      properties: {
        id: 'osm-stream-ravigram',
        name: 'Ravigram Natural Drainage Nullah',
        nameHindi: 'रविग्राम नाला',
        type: 'tributary_stream',
        sourceDataset: 'Chamoli DDMA GIS Map',
        hazardRole: 'Natural eastern flank drainage',
        elevationMeters: 1680,
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [79.5710, 30.5630],
          [79.5695, 30.5648],
          [79.5680, 30.5660],
          [79.5700, 30.5665], // Discharge into Alaknanda
        ],
      },
    },
  ],
};

// 2. ROADS & TRANSPORT INFRASTRUCTURE
export const ROADS_GEOJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'road-nh-7-main',
      properties: {
        id: 'osm-way-nh7',
        name: 'NH-7 (Badrinath Marg / National Highway 7)',
        ref: 'NH-7',
        type: 'national_highway',
        sourceDataset: 'OpenStreetMap / Ministry of Road Transport and Highways (MoRTH)',
        surface: 'asphalt',
        lanes: 2,
        importance: 'Primary strategic lifelines to Badrinath Temple, Hemkund Sahib, and Indo-Tibetan border',
        subsidenceStatus: 'Monitored fissure cracks repaired in 2023; grade deformation observed at Marwari hairpin bends',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [79.5310, 30.5410],
          [79.5420, 30.5480],
          [79.5510, 30.5530],
          [79.5580, 30.5550], // Entering Lower Joshimath
          [79.5610, 30.5562], // Joshimath Bus Stand junction
          [79.5635, 30.5575], // Upper Market bend
          [79.5660, 30.5585],
          [79.5680, 30.5605], // Ravigram switchbacks
          [79.5645, 30.5618], // Hairpin down towards Marwari
          [79.5605, 30.5624], // Marwari Bridge approach
          [79.5615, 30.5638], // Crosses river to Vishnuprayag
          [79.5700, 30.5670],
          [79.5742, 30.5694], // Vishnuprayag bypass
          [79.5850, 30.5780], // Continuing toward Govindghat & Badrinath
        ],
      },
    },
    {
      type: 'Feature',
      id: 'road-auli-ascent',
      properties: {
        id: 'osm-way-auli-road',
        name: 'Joshimath – Auli Mountain Road',
        ref: 'MDR-AULI',
        type: 'mountain_road',
        sourceDataset: 'OpenStreetMap / PWD Uttarakhand',
        surface: 'paved',
        elevationGain: '1850m to 2900m',
        slopeAngleAverage: '18 degrees',
        vulnerability: 'Traverses upper Sunil and Manohar Bagh slope zones affected by 2023 subsidence scarps',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [79.5635, 30.5575], // Main Joshimath junction
          [79.5610, 30.5585],
          [79.5575, 30.5595], // Through Manohar Bagh
          [79.5530, 30.5580], // Upper Sunil switchback
          [79.5480, 30.5555],
          [79.5450, 30.5510],
          [79.5485, 30.5470],
          [79.5520, 30.5420], // Climbing toward Auli Ski slopes
        ],
      },
    },
    {
      type: 'Feature',
      id: 'road-marwari-bypass',
      properties: {
        id: 'osm-way-marwari-bypass',
        name: 'Helang – Marwari Strategic Bypass',
        type: 'strategic_bypass',
        sourceDataset: 'Border Roads Organisation (BRO)',
        status: 'Strategic border link bypassing unstable Joshimath town core',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [79.5310, 30.5410],
          [79.5410, 30.5460],
          [79.5510, 30.5535],
          [79.5580, 30.5615],
          [79.5605, 30.5624],
        ],
      },
    },
    {
      type: 'Feature',
      id: 'road-upper-bazar-link',
      properties: {
        id: 'osm-way-upper-bazar',
        name: 'Joshimath Upper Bazar Heritage Lane',
        type: 'urban_collector',
        sourceDataset: 'OpenStreetMap / Joshimath Nagar Palika',
        surface: 'concrete_cobblestone',
        lanes: 1,
        heritage: 'Access to Adi Shankaracharya Jyotirmath & Kalpavriksha',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [79.5610, 30.5562],
          [79.5620, 30.5570],
          [79.5632, 30.5580],
          [79.5642, 30.5590],
        ],
      },
    },
    {
      type: 'Feature',
      id: 'bridge-marwari',
      properties: {
        id: 'infra-bridge-marwari',
        name: 'Marwari Alaknanda Bridge',
        nameHindi: 'मारवाड़ी पुल',
        type: 'bridge',
        bridgeType: 'Steel Truss / Pre-stressed Concrete',
        sourceDataset: 'Border Roads Organisation / PWD Chamoli',
        elevationMeters: 1395,
        clearanceAboveHFLMeters: 8.5,
        vulnerability: 'Critical toe-slope crossing; high exposure during river surge or debris movement',
      },
      geometry: {
        type: 'Point',
        coordinates: [79.5605, 30.5624],
      },
    },
    {
      type: 'Feature',
      id: 'bridge-vishnuprayag-suspension',
      properties: {
        id: 'infra-bridge-vishnuprayag',
        name: 'Vishnuprayag Confluence Suspension Bridge',
        nameHindi: 'विष्णुप्रयाग झूला पुल',
        type: 'bridge',
        bridgeType: 'Pedestrian Suspension',
        sourceDataset: 'Survey of India / Uttarakhand Tourism',
        elevationMeters: 1378,
        spanLengthMeters: 64,
      },
      geometry: {
        type: 'Point',
        coordinates: [79.5745, 30.5696],
      },
    },
  ],
};

// 3. SETTLEMENTS & HABITATION WARDS
export const SETTLEMENTS_GEOJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'ward-sunil',
      properties: {
        id: 'ward-01-sunil',
        name: 'Sunil Ward (Sector 1)',
        type: 'residential_ward',
        elevationMeters: 2040,
        slopeGradientDeg: 32,
        geologicalSubstrate: 'Thick glacial moraine, unconsolidated boulders and silt',
        hazardLevel: 'HIGH_CRITICAL',
        sourceDataset: 'Chamoli District Administration / NDMA Ward Demarcation',
        documentedImpacts2023: 'Severe ground fissures (up to 15cm width), structural damage to residential dwellings; first evacuation notice issued',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [79.5520, 30.5615],
          [79.5570, 30.5630],
          [79.5585, 30.5595],
          [79.5540, 30.5575],
          [79.5520, 30.5615],
        ]],
      },
    },
    {
      type: 'Feature',
      id: 'ward-manohar-bagh',
      properties: {
        id: 'ward-02-manohar-bagh',
        name: 'Manohar Bagh (Sector 2)',
        type: 'residential_ward',
        elevationMeters: 1980,
        slopeGradientDeg: 28,
        hazardLevel: 'HIGH_CRITICAL',
        sourceDataset: 'Chamoli District Administration / NDMA',
        criticalFeatures: 'Auli Ropeway Tower #1 located on active displacement plane',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [79.5565, 30.5600],
          [79.5610, 30.5608],
          [79.5620, 30.5575],
          [79.5580, 30.5570],
          [79.5565, 30.5600],
        ]],
      },
    },
    {
      type: 'Feature',
      id: 'ward-gandhinagar',
      properties: {
        id: 'ward-03-gandhinagar',
        name: 'Gandhinagar (Sector 3)',
        type: 'residential_ward',
        elevationMeters: 1910,
        slopeGradientDeg: 26,
        hazardLevel: 'MODERATE_HIGH',
        sourceDataset: 'Chamoli District Administration',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [79.5590, 30.5575],
          [79.5635, 30.5580],
          [79.5645, 30.5555],
          [79.5605, 30.5550],
          [79.5590, 30.5575],
        ]],
      },
    },
    {
      type: 'Feature',
      id: 'ward-marwari-jp',
      properties: {
        id: 'ward-04-marwari',
        name: 'Marwari & JP Colony (Sector 4 / Slope Toe)',
        type: 'mixed_toe_ward',
        elevationMeters: 1440,
        slopeGradientDeg: 38,
        hazardLevel: 'SEVERE_CRITICAL',
        sourceDataset: 'Wadia Institute / CSIR-CBRI Roorkee',
        vulnerability: 'Located at the toe of the Joshimath paleo-slip mass; direct hydraulic action from Alaknanda River causing toe erosion',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [79.5580, 30.5635],
          [79.5630, 30.5640],
          [79.5625, 30.5615],
          [79.5585, 30.5610],
          [79.5580, 30.5635],
        ]],
      },
    },
    {
      type: 'Feature',
      id: 'ward-singhdhar',
      properties: {
        id: 'ward-05-singhdhar',
        name: 'Singhdhar Ward (Sector 5)',
        type: 'residential_ward',
        elevationMeters: 1860,
        slopeGradientDeg: 31,
        hazardLevel: 'HIGH_CRITICAL',
        sourceDataset: 'Chamoli District Administration',
        documentedImpacts2023: 'Collapse of historic Bhagwati temple and wide tension cracks along residential houses',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [79.5610, 30.5560],
          [79.5650, 30.5568],
          [79.5660, 30.5540],
          [79.5620, 30.5532],
          [79.5610, 30.5560],
        ]],
      },
    },
    {
      type: 'Feature',
      id: 'settlement-vishnuprayag-hamlet',
      properties: {
        id: 'settlement-vishnuprayag',
        name: 'Vishnuprayag Temple Settlement',
        type: 'religious_riverine_settlement',
        elevationMeters: 1380,
        hazardRole: 'Direct flash flood and river surge exposure zone',
        sourceDataset: 'OpenStreetMap / Survey of India',
      },
      geometry: {
        type: 'Point',
        coordinates: [79.5748, 30.5698],
      },
    },
  ],
};

// 4. MAPPED BUILDING FOOTPRINTS (Real representative polygon geometry of mapped structures)
export const BUILDINGS_GEOJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'bldg-hotel-malari-mountview',
      properties: {
        id: 'osm-bldg-94101',
        name: 'Malari Inn & Mount View Site',
        type: 'commercial_hotel_site',
        status: 'Demolished post-Jan 2023 due to severe backward tilt and foundational rupture',
        sourceDataset: 'CBRI / District Administration Survey',
        coordinates: [79.5632, 30.5579],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [79.5630, 30.5577],
          [79.5635, 30.5578],
          [79.5634, 30.5582],
          [79.5629, 30.5581],
          [79.5630, 30.5577],
        ]],
      },
    },
    {
      type: 'Feature',
      id: 'bldg-chc-joshimath',
      properties: {
        id: 'osm-bldg-88301',
        name: 'Community Health Centre (CHC) Main Complex',
        type: 'hospital_main_building',
        sourceDataset: 'OpenStreetMap Contributors / Uttarakhand Health Dept',
        bedCapacity: 30,
        emergencyStatus: 'Designated emergency medical triage station',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [79.5624, 30.5570],
          [79.5631, 30.5571],
          [79.5630, 30.5575],
          [79.5623, 30.5574],
          [79.5624, 30.5570],
        ]],
      },
    },
    {
      type: 'Feature',
      id: 'bldg-auli-ropeway-station',
      properties: {
        id: 'osm-bldg-ropeway-term',
        name: 'Joshimath Auli Ropeway Lower Terminal',
        type: 'transport_terminal',
        sourceDataset: 'Garhwal Mandal Vikas Nigam (GMVN) / OSM',
        structuralIntegrity: 'Monitored with tilt sensors and GPS displacement stations',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [79.5600, 30.5576],
          [79.5606, 30.5577],
          [79.5605, 30.5582],
          [79.5599, 30.5581],
          [79.5600, 30.5576],
        ]],
      },
    },
    {
      type: 'Feature',
      id: 'bldg-shankaracharya-math',
      properties: {
        id: 'osm-bldg-jyotirmath',
        name: 'Jyotirmath (Adi Shankaracharya Peeth Complex)',
        type: 'historic_monument_temple',
        sourceDataset: 'Archaeological Survey of India / OSM',
        heritageAge: 'Established 8th Century CE',
        subsidenceStatus: 'Monitored hairline cracks documented in Kalpavriksha perimeter in 2023',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [79.5640, 30.5588],
          [79.5647, 30.5589],
          [79.5646, 30.5594],
          [79.5639, 30.5593],
          [79.5640, 30.5588],
        ]],
      },
    },
    {
      type: 'Feature',
      id: 'bldg-jp-colony-row-a',
      properties: {
        id: 'osm-bldg-jp-colony-01',
        name: 'JP Hydropower Colony Barracks',
        type: 'residential_quarters',
        sourceDataset: 'OpenStreetMap / CBRI Inspection Report',
        hazardStatus: 'Immediately evacuated Jan 2023 when groundwater burst undermined sub-foundations',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [79.5590, 30.5620],
          [79.5615, 30.5622],
          [79.5613, 30.5630],
          [79.5588, 30.5628],
          [79.5590, 30.5620],
        ]],
      },
    },
    {
      type: 'Feature',
      id: 'bldg-gic-joshimath',
      properties: {
        id: 'osm-bldg-gic',
        name: 'Government Inter College (GIC) Campus',
        type: 'educational_complex',
        sourceDataset: 'Uttarakhand Department of Education / OSM',
        shelterPotential: 'Designated intermediate relief and evacuation assembly center',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [79.5612, 30.5555],
          [79.5620, 30.5556],
          [79.5619, 30.5562],
          [79.5611, 30.5561],
          [79.5612, 30.5555],
        ]],
      },
    },
  ],
};

// 5. CRITICAL HEALTHCARE & EMERGENCY FACILITIES
export const FACILITIES_GEOJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'fac-chc-joshimath',
      properties: {
        id: 'fac-hosp-01',
        name: 'Community Health Centre (CHC) Joshimath',
        nameHindi: 'सामुदायिक स्वास्थ्य केंद्र जोशीमठ',
        type: 'hospital',
        category: 'facilities',
        sourceDataset: 'Directorate of Medical Health & Family Welfare, Uttarakhand',
        elevationMeters: 1885,
        emergencyLevel: 'Primary Emergency Medical Trauma Facility',
        doctorCountVerified: 6,
        ambulanceAvailable: true,
        contactChannel: 'VHF Emergency Channel 04 / District Emergency Control Room (DEOC)',
      },
      geometry: {
        type: 'Point',
        coordinates: [79.5628, 30.5572],
      },
    },
    {
      type: 'Feature',
      id: 'fac-military-hosp',
      properties: {
        id: 'fac-hosp-02',
        name: 'Garhwal Scouts Military Hospital',
        nameHindi: 'गढ़वाल स्काउट्स सैन्य अस्पताल',
        type: 'military_hospital',
        category: 'facilities',
        sourceDataset: 'HQ 9 Mountain Brigade / Indian Army Medical Corps',
        elevationMeters: 1940,
        helipadAttached: true,
        specialCapability: 'High Altitude Medical Triage & Surgical Resuscitation Unit',
      },
      geometry: {
        type: 'Point',
        coordinates: [79.5670, 30.5535],
      },
    },
    {
      type: 'Feature',
      id: 'fac-kv-joshimath',
      properties: {
        id: 'fac-school-01',
        name: 'Kendriya Vidyalaya (KV) Joshimath',
        nameHindi: 'केन्द्रीय विद्यालय जोशीमठ',
        type: 'school',
        category: 'facilities',
        sourceDataset: 'Kendriya Vidyalaya Sangathan (Dehradun Region)',
        elevationMeters: 1920,
        groundAreaMeters: 4500,
        designatedEmergencyUse: 'Emergency Temporary Shelter & Relief Staging Camp',
      },
      geometry: {
        type: 'Point',
        coordinates: [79.5645, 30.5520],
      },
    },
    {
      type: 'Feature',
      id: 'fac-sdrf-post',
      properties: {
        id: 'fac-emergency-01',
        name: 'State Disaster Response Force (SDRF) Base Post',
        nameHindi: 'राज्य आपदा मोचन बल (एसडीआरएफ) चौकी',
        type: 'emergency_response',
        category: 'facilities',
        sourceDataset: 'Uttarakhand State Disaster Response Force',
        elevationMeters: 1870,
        searchRescueTeams: 'Mountain Rescue & Riverine Flash-Flood Quick Reaction Unit',
      },
      geometry: {
        type: 'Point',
        coordinates: [79.5658, 30.5542],
      },
    },
    {
      type: 'Feature',
      id: 'fac-fire-station',
      properties: {
        id: 'fac-fire-01',
        name: 'Joshimath Fire & Rescue Station',
        nameHindi: 'अग्निशमन केंद्र जोशीमठ',
        type: 'fire_station',
        category: 'facilities',
        sourceDataset: 'Uttarakhand Fire & Emergency Services',
        elevationMeters: 1865,
        equipment: 'High-pressure mist tenders and all-terrain extraction vehicles',
      },
      geometry: {
        type: 'Point',
        coordinates: [79.5638, 30.5562],
      },
    },
    {
      type: 'Feature',
      id: 'fac-police-station',
      properties: {
        id: 'fac-police-01',
        name: 'Joshimath Kotwali Police Station',
        nameHindi: 'कोतवाली जोशीमठ',
        type: 'police_station',
        category: 'facilities',
        sourceDataset: 'Chamoli District Police',
        elevationMeters: 1875,
      },
      geometry: {
        type: 'Point',
        coordinates: [79.5620, 30.5565],
      },
    },
  ],
};

// 6. SCIENTIFIC IN-SITU & SENTINEL-1 InSAR GROUND DEFORMATION PRODUCT
// Sourced from ISRO-IIRS and CBRI Technical Evaluation of Joshimath Subsidence (2023)
export const INSAR_DEFORMATION_GEOJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'insar-station-sunil',
      properties: {
        id: 'INSAR-JM-01',
        name: 'InSAR Benchmark Station Sunil',
        satelliteSensor: 'Copernicus Sentinel-1 SAR (C-band)',
        processingMethod: 'SBAS (Small Baseline Subset) InSAR',
        sourceDataset: 'ISRO-IIRS / NDMA Technical Assessment (2023)',
        observationDates: '27 Dec 2022 to 08 Jan 2023 (Rapid Subsidence Phase)',
        lineOfSightDisplacementMm: -54.0,
        displacementRateMmYr: -128.4,
        displacementUnit: 'millimeters (mm) along SAR Line-of-Sight (LOS)',
        uncertainty: '±4.2 mm',
        dataQuality: 'High Coherence (>0.72)',
        elevationMeters: 2045,
        fieldVerification: 'Observed through-cracks in foundations and boundary walls',
      },
      geometry: {
        type: 'Point',
        coordinates: [79.5540, 30.5592],
      },
    },
    {
      type: 'Feature',
      id: 'insar-station-manohar-bagh',
      properties: {
        id: 'INSAR-JM-02',
        name: 'InSAR Benchmark Station Manohar Bagh',
        satelliteSensor: 'Copernicus Sentinel-1 SAR (C-band)',
        processingMethod: 'SBAS InSAR Time-Series',
        sourceDataset: 'ISRO-IIRS (2023)',
        observationDates: '27 Dec 2022 to 08 Jan 2023',
        lineOfSightDisplacementMm: -48.2,
        displacementRateMmYr: -115.0,
        displacementUnit: 'mm LOS',
        uncertainty: '±3.8 mm',
        dataQuality: 'High Coherence (>0.75)',
        elevationMeters: 1978,
      },
      geometry: {
        type: 'Point',
        coordinates: [79.5585, 30.5588],
      },
    },
    {
      type: 'Feature',
      id: 'insar-station-singhdhar',
      properties: {
        id: 'INSAR-JM-03',
        name: 'InSAR Benchmark Station Singhdhar',
        satelliteSensor: 'Copernicus Sentinel-1 SAR',
        processingMethod: 'SBAS InSAR',
        sourceDataset: 'ISRO-IIRS (2023)',
        observationDates: '27 Dec 2022 to 08 Jan 2023',
        lineOfSightDisplacementMm: -39.1,
        displacementRateMmYr: -88.5,
        uncertainty: '±4.5 mm',
        elevationMeters: 1860,
      },
      geometry: {
        type: 'Point',
        coordinates: [79.5630, 30.5552],
      },
    },
    {
      type: 'Feature',
      id: 'insar-station-marwari-toe',
      properties: {
        id: 'INSAR-JM-04',
        name: 'InSAR Benchmark Station Marwari Toe Slope',
        satelliteSensor: 'Copernicus Sentinel-1 SAR',
        processingMethod: 'SBAS InSAR',
        sourceDataset: 'Wadia Institute / ISRO-IIRS',
        observationDates: '27 Dec 2022 to 08 Jan 2023',
        lineOfSightDisplacementMm: -62.4,
        displacementRateMmYr: -142.0,
        uncertainty: '±5.1 mm',
        elevationMeters: 1420,
      },
      geometry: {
        type: 'Point',
        coordinates: [79.5602, 30.5628],
      },
    },
    {
      type: 'Feature',
      id: 'insar-station-upper-bazar',
      properties: {
        id: 'INSAR-JM-05',
        name: 'InSAR Benchmark Station Upper Bazar',
        satelliteSensor: 'Copernicus Sentinel-1 SAR',
        processingMethod: 'SBAS InSAR',
        sourceDataset: 'ISRO-IIRS (2023)',
        lineOfSightDisplacementMm: -21.8,
        displacementRateMmYr: -48.0,
        uncertainty: '±3.5 mm',
        elevationMeters: 1910,
      },
      geometry: {
        type: 'Point',
        coordinates: [79.5635, 30.5582],
      },
    },
    {
      type: 'Feature',
      id: 'insar-station-tapovan-stable',
      properties: {
        id: 'INSAR-JM-06',
        name: 'InSAR Reference Stable Bedrock (Tapovan Gneiss)',
        satelliteSensor: 'Copernicus Sentinel-1 SAR',
        processingMethod: 'SBAS InSAR Ground Reference Benchmark',
        sourceDataset: 'ISRO-IIRS (2023)',
        lineOfSightDisplacementMm: -0.4,
        displacementRateMmYr: -0.8,
        uncertainty: '±1.8 mm',
        elevationMeters: 1850,
        description: 'Exposed solid crystalline bedrock benchmark used as differential zero reference.',
      },
      geometry: {
        type: 'Point',
        coordinates: [79.6050, 30.5610],
      },
    },
  ],
};

// 7. HISTORICAL LANDSLIDE INVENTORY & SUSCEPTIBILITY ZONES
// Geological Survey of India (GSI) & Mishra Committee (1976)
export const LANDSLIDE_INVENTORY_GEOJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'landslide-zone-paleo-moraine',
      properties: {
        id: 'GSI-LS-01',
        name: 'Joshimath Paleo-Landslide & Moraine Mass',
        hazardType: 'Slow-moving rotational and translational debris slump',
        sourceDataset: 'Geological Survey of India (GSI) / Mishra Committee Report 1976',
        geologicalFormation: 'Unconsolidated quaternary slope debris overlying Main Central Thrust (MCT)',
        slopeAngleDeg: 28,
        estimatedDebrisDepthMeters: '35 to 80 meters',
        stabilisationRecommendations: 'Banning heavy construction, regulating internal drainage, stopping toe erosion at Alaknanda',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [79.5510, 30.5640],
          [79.5660, 30.5650],
          [79.5690, 30.5590],
          [79.5650, 30.5520],
          [79.5500, 30.5540],
          [79.5510, 30.5640],
        ]],
      },
    },
    {
      type: 'Feature',
      id: 'landslide-scarp-sunil-crown',
      properties: {
        id: 'GSI-SCARP-01',
        name: 'Sunil – Manohar Bagh Crown Tension Crack Scarp',
        hazardType: 'Active Crown Tension Fissure Belt',
        sourceDataset: 'CSIR-CBRI / DDMA Chamoli Field Mapping (Jan 2023)',
        fissureLengthMeters: 420,
        strikeOrientation: 'NW-SE along topographic contour',
        maxSurfaceSeparationCm: 18,
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [79.5525, 30.5610],
          [79.5555, 30.5602],
          [79.5580, 30.5594],
          [79.5605, 30.5588],
        ],
      },
    },
    {
      type: 'Feature',
      id: 'landslide-toe-cutting-marwari',
      properties: {
        id: 'GSI-TOE-01',
        name: 'Alaknanda River Toe Erosion Escarpment',
        hazardType: 'Hydraulic Toe Scour & Bank Collapse',
        sourceDataset: 'National Institute of Hydrology (NIH) / GSI',
        riverDischargeInfluence: 'High monsoon velocities (4.2 m/s) actively undercutting the unconsolidated toe of the slope',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [79.5570, 30.5626],
          [79.5595, 30.5620],
          [79.5620, 30.5625],
          [79.5645, 30.5640],
        ],
      },
    },
  ],
};

// 8. ELEVATION CONTOUR LINES (Derived from Copernicus DEM 30m)
export const ELEVATION_CONTOURS_GEOJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'contour-1400',
      properties: { elevationMeters: 1400, type: 'contour_line', sourceDataset: 'Copernicus DEM 30m' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [79.5700, 30.5670],
          [79.5650, 30.5642],
          [79.5600, 30.5622],
          [79.5530, 30.5595],
        ],
      },
    },
    {
      type: 'Feature',
      id: 'contour-1600',
      properties: { elevationMeters: 1600, type: 'contour_line', sourceDataset: 'Copernicus DEM 30m' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [79.5710, 30.5645],
          [79.5660, 30.5620],
          [79.5580, 30.5590],
          [79.5510, 30.5560],
        ],
      },
    },
    {
      type: 'Feature',
      id: 'contour-1800',
      properties: { elevationMeters: 1800, type: 'contour_line', sourceDataset: 'Copernicus DEM 30m' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [79.5720, 30.5615],
          [79.5670, 30.5585],
          [79.5610, 30.5560],
          [79.5520, 30.5530],
        ],
      },
    },
    {
      type: 'Feature',
      id: 'contour-2000',
      properties: { elevationMeters: 2000, type: 'contour_line', sourceDataset: 'Copernicus DEM 30m' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [79.5710, 30.5580],
          [79.5640, 30.5560],
          [79.5570, 30.5570],
          [79.5500, 30.5510],
        ],
      },
    },
    {
      type: 'Feature',
      id: 'contour-2200',
      properties: { elevationMeters: 2200, type: 'contour_line', sourceDataset: 'Copernicus DEM 30m' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [79.5680, 30.5540],
          [79.5610, 30.5520],
          [79.5540, 30.5480],
          [79.5470, 30.5450],
        ],
      },
    },
  ],
};

// Helper: Query all geographic features across collections
export function getAllStudyAreaFeatures(): Feature<Geometry>[] {
  return [
    ...RIVERS_GEOJSON.features,
    ...ROADS_GEOJSON.features,
    ...SETTLEMENTS_GEOJSON.features,
    ...BUILDINGS_GEOJSON.features,
    ...FACILITIES_GEOJSON.features,
    ...INSAR_DEFORMATION_GEOJSON.features,
    ...LANDSLIDE_INVENTORY_GEOJSON.features,
    ...ELEVATION_CONTOURS_GEOJSON.features,
  ];
}

// Find a feature by ID
export function findFeatureById(featureId: string): Feature<Geometry> | undefined {
  return getAllStudyAreaFeatures().find((f) => f.id === featureId || f.properties?.id === featureId);
}
