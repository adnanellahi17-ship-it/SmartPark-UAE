import L from "leaflet";
import { LocateFixed } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import type { ZoneForecast } from "../lib/prediction";

type MapPanelProps = {
  forecasts: ZoneForecast[];
  selectedId: string;
  onSelect: (zoneId: string) => void;
  onLocate: () => void;
};

type LatLngTuple = [number, number];

const DEFAULT_CENTER: LatLngTuple = [25.076091, 55.134152];

const parkingSegmentsByCode: Record<string, LatLngTuple[][]> = {
  "392AP": [
    [
      [25.07637, 55.13364],
      [25.07618, 55.13416],
      [25.07603, 55.13472],
    ],
    [
      [25.07536, 55.1337],
      [25.07512, 55.13408],
    ],
    [
      [25.07462, 55.1332],
      [25.07496, 55.13342],
    ],
  ],
  "233C": [
    [
      [25.26834, 55.38078],
      [25.26792, 55.38118],
      [25.2675, 55.38158],
    ],
    [
      [25.26714, 55.38028],
      [25.26682, 55.3809],
      [25.26642, 55.38152],
      [25.26604, 55.38212],
    ],
    [
      [25.26566, 55.38032],
      [25.2653, 55.38086],
      [25.26494, 55.38138],
    ],
  ],
  "302A": [
    [
      [25.1982, 55.2734],
      [25.19775, 55.27414],
      [25.1973, 55.27484],
    ],
    [
      [25.19695, 55.27374],
      [25.19652, 55.27442],
    ],
  ],
  "341B": [
    [
      [25.18724, 55.28148],
      [25.18668, 55.2822],
      [25.1862, 55.28288],
    ],
    [
      [25.18588, 55.28176],
      [25.18542, 55.28248],
    ],
  ],
  "324C": [
    [
      [25.08052, 55.14072],
      [25.08014, 55.14124],
      [25.07972, 55.14172],
    ],
  ],
  "335A": [
    [
      [25.07848, 55.13282],
      [25.07804, 55.13318],
      [25.07766, 55.13366],
    ],
  ],
  "382C": [
    [
      [25.07054, 55.14002],
      [25.07002, 55.14062],
      [25.06942, 55.14118],
    ],
  ],
  "251C": [
    [
      [25.21786, 55.40686],
      [25.2172, 55.40764],
      [25.21672, 55.4083],
    ],
  ],
  "621Q": [
    [
      [25.16908, 55.40672],
      [25.16858, 55.40748],
      [25.1681, 55.4082],
    ],
  ],
  "135C": [
    [
      [25.2671, 55.31838],
      [25.26645, 55.31908],
      [25.26592, 55.31978],
    ],
  ],
  "318D": [
    [
      [25.24496, 55.30088],
      [25.24426, 55.30162],
      [25.24362, 55.3022],
    ],
  ],
  "675T": [
    [
      [25.0421, 55.24958],
      [25.04152, 55.25032],
      [25.04098, 55.25102],
    ],
  ],
  "812F": [
    [
      [25.11294, 55.37644],
      [25.11238, 55.37722],
      [25.11182, 55.378],
    ],
  ],
  "591W": [
    [
      [24.96804, 55.15628],
      [24.96742, 55.15702],
      [24.96684, 55.15778],
    ],
  ],
};

const parkingAreasByCode: Record<string, LatLngTuple[]> = {
  "392AP": [
    [25.0767, 55.13326],
    [25.0763, 55.1349],
    [25.0753, 55.13444],
    [25.07478, 55.13358],
    [25.07544, 55.13308],
  ],
  "233C": [
    [25.26895, 55.3796],
    [25.26818, 55.38278],
    [25.26642, 55.38292],
    [25.26528, 55.38118],
    [25.26655, 55.37924],
  ],
  "302A": [
    [25.19855, 55.27282],
    [25.19805, 55.27522],
    [25.19635, 55.2754],
    [25.19592, 55.27344],
    [25.19718, 55.27274],
  ],
  "341B": [
    [25.18772, 55.28108],
    [25.18708, 55.28328],
    [25.18528, 55.28308],
    [25.18494, 55.28138],
    [25.18635, 55.28078],
  ],
  "324C": [
    [25.08096, 55.14018],
    [25.08042, 55.14218],
    [25.07918, 55.14212],
    [25.07902, 55.14066],
  ],
  "335A": [
    [25.07886, 55.13246],
    [25.07838, 55.13402],
    [25.07728, 55.1339],
    [25.0773, 55.13274],
  ],
  "382C": [
    [25.0709, 55.1395],
    [25.0702, 55.14162],
    [25.06898, 55.14148],
    [25.06898, 55.1399],
  ],
};

function toLatLng(forecast: ZoneForecast): LatLngTuple {
  return [forecast.zone.coordinates.latitude, forecast.zone.coordinates.longitude];
}

function createParkingIcon(forecast: ZoneForecast, isSelected: boolean) {
  const label = isSelected ? `<span class="leaflet-pin-label">${forecast.zone.code}</span>` : "";

  return L.divIcon({
    className: `leaflet-parking-pin pin-${forecast.status} ${isSelected ? "is-selected" : ""}`,
    html: `<span class="leaflet-pin-dot">P</span>${label}`,
    iconSize: isSelected ? [92, 42] : [44, 44],
    iconAnchor: isSelected ? [24, 42] : [22, 44],
  });
}

function addSelectedZoneHighlight(forecast: ZoneForecast, layerGroup: L.LayerGroup) {
  const code = forecast.zone.code.toUpperCase();
  const center = toLatLng(forecast);
  const area = parkingAreasByCode[code];
  const segments = code === "392AP" ? parkingSegmentsByCode[code] : undefined;

  if (area) {
    L.polygon(area, {
      className: "leaflet-zone-highlight leaflet-zone-highlight-area",
      color: "#d84c4c",
      fillColor: "#d84c4c",
      fillOpacity: code === "392AP" ? 0.15 : 0.08,
      opacity: code === "392AP" ? 0.75 : 0.55,
      weight: 2,
    }).addTo(layerGroup);
  } else {
    L.circle(center, {
      className: "leaflet-zone-highlight leaflet-zone-highlight-area",
      color: "#006b57",
      fillColor: "#dff3e7",
      fillOpacity: 0.24,
      opacity: 0.6,
      radius: 165,
      weight: 2,
    }).addTo(layerGroup);
  }

  if (segments) {
    segments.forEach((segment) => {
      L.polyline(segment, {
        className: "leaflet-zone-highlight leaflet-zone-highlight-curb",
        color: "#e45555",
        lineCap: "round",
        lineJoin: "round",
        opacity: 0.92,
        weight: code === "233C" ? 5 : 8,
      }).addTo(layerGroup);
    });
  }

}

export function MapPanel({ forecasts, selectedId, onSelect, onLocate }: MapPanelProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);
  const highlightLayerRef = useRef<L.LayerGroup | null>(null);

  const selectedForecast = useMemo(
    () => forecasts.find((forecast) => forecast.zone.id === selectedId) ?? forecasts[0],
    [forecasts, selectedId],
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current, {
      attributionControl: false,
      center: DEFAULT_CENTER,
      maxZoom: 19,
      minZoom: 12,
      scrollWheelZoom: true,
      zoom: 16,
      zoomControl: false,
    });

    L.control.attribution({ position: "bottomleft", prefix: false }).addTo(map);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 20,
    }).addTo(map);

    L.control.zoom({ position: "topright" }).addTo(map);

    markerLayerRef.current = L.layerGroup().addTo(map);
    highlightLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    setTimeout(() => map.invalidateSize(), 0);

    return () => {
      map.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
      highlightLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const markerLayer = markerLayerRef.current;
    const highlightLayer = highlightLayerRef.current;
    if (!map || !markerLayer || !highlightLayer) return;

    markerLayer.clearLayers();
    highlightLayer.clearLayers();

    if (selectedForecast) {
      addSelectedZoneHighlight(selectedForecast, highlightLayer);
    }

    forecasts.forEach((forecast) => {
      const isSelected = forecast.zone.id === selectedId;
      L.marker(toLatLng(forecast), {
        icon: createParkingIcon(forecast, isSelected),
        keyboard: true,
        title: `${forecast.zone.code} ${forecast.zone.name}`,
      })
        .addTo(markerLayer)
        .on("click", () => onSelect(forecast.zone.id));
    });

    if (selectedForecast) {
      const targetZoom = selectedForecast.zone.code === "392AP" ? 17 : Math.max(map.getZoom(), 15);
      map.flyTo(toLatLng(selectedForecast), targetZoom, { duration: 0.45 });
    }
  }, [forecasts, onSelect, selectedForecast, selectedId]);

  function handleRecenter() {
    if (!mapRef.current || !selectedForecast) {
      onLocate();
      return;
    }

    mapRef.current.flyTo(toLatLng(selectedForecast), selectedForecast.zone.code === "392AP" ? 17 : 16, {
      duration: 0.35,
    });
  }

  return (
    <section className="map-panel" aria-label="Parking availability map">
      <div ref={containerRef} className="real-map-container" />

      <button className="locate-button" type="button" aria-label="Recenter selected parking zone" onClick={handleRecenter}>
        <LocateFixed size={22} />
      </button>
    </section>
  );
}
