# TRINETRA — LAPTOP 1 & LAPTOP 2 INTEGRATION SPECIFICATION

## System Architecture Overview
- **Laptop 1**: Himalayan Satellite Monitoring & Disaster Observation Station (Joshimath – Vishnuprayag).
- **Laptop 2**: Command Center & Relocation / Evacuation Decision Station.
- **Protocol**: HTTP/REST multipart/form-data telemetry stream (`POST /api/snapshot`).

---

## 1. Laptop 2 API Contract

### Endpoint: `POST /api/snapshot`
Receives high-resolution map viewport snapshots and synchronized GIS/telemetry metadata.

#### Request Headers
```http
POST /api/snapshot HTTP/1.1
Host: 192.168.1.102:8080
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryX7MAQ5gjtV8N3gy3
```

#### Form-Data Fields
| Field Name | Type | Description |
| :--- | :--- | :--- |
| `image` | `File (image/png)` | Pure map viewport PNG canvas buffer (excluding UI headers/docks) |
| `metadata` | `String (JSON)` | Serialized JSON containing station ID, coordinates, layers, simulation parameters |
| `targetIp` | `String` | Destination IP address of Laptop 2 |
| `targetPort`| `String` | Destination TCP port of Laptop 2 |

#### JSON Metadata Structure
```json
{
  "stationId": "TRINETRA-OBS-STATION-01",
  "studyArea": "Joshimath – Vishnuprayag, Chamoli District, Uttarakhand, India",
  "timestamp": "2026-11-01T11:45:00.000Z",
  "mode": "REAL_DATA" | "SIMULATION",
  "imagerySource": "Satellite Optical (High-Res Aerial) - ESRI / Sentinel-2",
  "observationTimestamp": "2023-01-08T06:30:00Z (ISRO Sentinel-1 InSAR)" | null,
  "mapCenter": [79.5630, 30.5580],
  "zoomLevel": 14.2,
  "bearing": -15.0,
  "pitch": 35.0,
  "visibleLayers": [
    "Roads & Highways (NH-7 / Auli)",
    "Strategic Bridges & Crossings",
    "Alaknanda & Dhauliganga Rivers",
    "Habitation Wards & Boundaries",
    "Mapped Building Footprints",
    "Hospitals & Health Centers",
    "Sentinel-1 InSAR Surface Deformation"
  ],
  "isSimulated": false,
  "simulationParameters": {
    "rainfallMm24h": 85,
    "soilMoistureSaturationPct": 65,
    "riverDischargeCumecs": 750,
    "slopeFailureThreshold": 0.55,
    "hazardScenario": "MONSOON_SURGE"
  },
  "exposureSummary": {
    "inundatedAreaSqKm": 1.12,
    "buildingsExposedCount": 54,
    "roadLengthExposedKm": 3.4,
    "criticalBridgesAtRisk": ["Marwari Alaknanda Bridge"],
    "highRiskZones": ["Sunil Ward (Sector 1 - Crown Tension Scarp)"],
    "carryingCapacityStressLevel": "CRITICAL"
  }
}
```

#### Expected Laptop 2 Response
```json
{
  "success": true,
  "transmissionId": "TX-1762000000-421",
  "status": "INGESTED",
  "message": "Snapshot synchronized with Laptop 2 Command Center display",
  "timestamp": "2026-11-01T11:45:01.200Z"
}
```

---

## 2. Windows & VS Code Setup Instructions

### Prerequisites
1. Install **Node.js LTS** (version 20 or later) from [nodejs.org](https://nodejs.org/).
2. Install **Visual Studio Code** from [code.visualstudio.com](https://code.visualstudio.com/).
3. (Recommended) Install the **Tailwind CSS IntelliSense** and **ESLint** VS Code extensions.

### Running on Windows
1. Open PowerShell or Command Prompt.
2. Navigate to the project directory:
   ```cmd
   cd trinetra-laptop1
   ```
3. Install dependencies:
   ```cmd
   npm install
   ```
4. Start the application:
   ```cmd
   npm run dev
   ```
5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 3. Verified Features Working Out of the Box
- **No external API key required**: Map uses public high-resolution ESRI World Imagery satellite tiles, OpenTopoMap terrain tiles, and OpenStreetMap vectors with zero configuration.
- **Genuine Chamoli / Joshimath Data**: Includes real Alaknanda & Dhauliganga river lines, Vishnuprayag confluence coordinates, NH-7 Badrinath Marg, Auli mountain road, Marwari bridge, surveyed building footprints, hospitals, SDRF post, and documented 2023 Sentinel-1 InSAR subsidence points.
- **Full-Stack Ingestion Backend**: Local express server handles `POST /api/snapshot` and caches images in `public/snapshots`.
