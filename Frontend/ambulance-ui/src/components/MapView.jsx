import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";

const createIcon = (emoji, color) => {
  return L.divIcon({
    className: "custom-leaflet-icon",
    html: `<div class="marker-chip" style="background: ${color}">${emoji}</div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -36],
  });
};

function FlyToAmbulance({ center }) {
  const map = useMap();

  useEffect(() => {
    if (!center) return;
    map.flyTo([center.lat, center.lng], map.getZoom(), {
      animate: true,
      duration: 1.1,
    });
  }, [center, map]);

  return null;
}

export default function MapView({ ambulancePosition, userPosition, hospitalPosition, routePositions }) {
  const ambulanceIcon = createIcon("🚑", "#ff4e5a");
  const userIcon = createIcon("👤", "#5b8dff");
  const hospitalIcon = createIcon("🏥", "#50e3c2");

  return (
    <MapContainer
      center={[ambulancePosition.lat, ambulancePosition.lng]}
      zoom={14}
      scrollWheelZoom={false}
      className="live-map"
      attributionControl={false}
    >
      <FlyToAmbulance center={ambulancePosition} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <Polyline positions={routePositions.map((point) => [point.lat, point.lng])} pathOptions={{ color: "#ff6f7a", weight: 5, dashArray: "12 8" }} />
      <Marker position={[ambulancePosition.lat, ambulancePosition.lng]} icon={ambulanceIcon} />
      <Marker position={[userPosition.lat, userPosition.lng]} icon={userIcon} />
      <Marker position={[hospitalPosition.lat, hospitalPosition.lng]} icon={hospitalIcon} />
    </MapContainer>
  );
}
