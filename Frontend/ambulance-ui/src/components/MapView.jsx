import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import Loader from "./Loader"; // Integrated fallback component safely

const createIcon = (emoji, color) => {
  return L.divIcon({
    className: "custom-leaflet-icon",
    html: `<div class="marker-chip" style="background: ${color}; display: flex; align-items: center; justify-content: center; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3); font-size: 20px; width: 100%; height: 100%;">${emoji}</div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -36],
  });
};

function FlyToAmbulance({ center }) {
  const map = useMap();

  useEffect(() => {
    if (!center || typeof center.lat !== "number" || typeof center.lng !== "number") return;
    
    map.flyTo([center.lat, center.lng], map.getZoom(), {
      animate: true,
      duration: 1.1,
    });
  }, [center, map]);

  return null;
}

export default function MapView({ ambulancePosition, userPosition, hospitalPosition, routePositions = [] }) {
  // 1. Core Data Layer Guard: Ensure valid positions exist before initializing Leaflet
  const hasValidPositions = 
    ambulancePosition?.lat && ambulancePosition?.lng &&
    userPosition?.lat && userPosition?.lng &&
    hospitalPosition?.lat && hospitalPosition?.lng;

  if (!hasValidPositions) {
    return <Loader message="Calibrating satellite coordinates..." />;
  }

  const ambulanceIcon = createIcon("🚑", "#ff4e5a");
  const userIcon = createIcon("👤", "#5b8dff");
  const hospitalIcon = createIcon("🏥", "#50e3c2");

  // 2. Safe parsing of path track strings
  const formattedRoute = Array.isArray(routePositions)
    ? routePositions.filter(p => p?.lat && p?.lng).map((point) => [point.lat, point.lng])
    : [];

  return (
    <MapContainer
      center={[ambulancePosition.lat, ambulancePosition.lng]}
      zoom={14}
      scrollWheelZoom={false}
      className="live-map"
      style={{ height: "100%", width: "100%" }} // Guaranteed viewport constraint fallback
      attributionControl={false}
    >
      <FlyToAmbulance center={ambulancePosition} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {formattedRoute.length > 0 && (
        <Polyline 
          positions={formattedRoute} 
          pathOptions={{ color: "#ff6f7a", weight: 5, dashArray: "12 8" }} 
        />
      )}

      <Marker position={[ambulancePosition.lat, ambulancePosition.lng]} icon={ambulanceIcon} />
      <Marker position={[userPosition.lat, userPosition.lng]} icon={userIcon} />
      <Marker position={[hospitalPosition.lat, hospitalPosition.lng]} icon={hospitalIcon} />
    </MapContainer>
  );
}