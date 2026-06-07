import { useEffect, useMemo, useRef, useState } from "react";
import MapView from "../components/MapView";
import StatusCard from "../components/StatusCard";
import DriverInfoCard from "../components/DriverInfoCard";
import { createLocationSimulator } from "../utils/locationSimulator";
import { calculateEta, getDistanceHaversine } from "../utils/distanceCalculator";
import { showToast } from "../utils/toast";

const ambulanceInitial = { lat: 19.0436, lng: 72.8683 };
const userLocation = { lat: 19.0522, lng: 72.8765 };
const hospitalLocation = { lat: 19.0628, lng: 72.8854 };

export default function LiveTracking() {
  const [ambulancePosition, setAmbulancePosition] = useState(ambulanceInitial);
  const [eta, setEta] = useState(0);
  const [connected, setConnected] = useState(false);
  const [stage, setStage] = useState(0);
  const [statusText, setStatusText] = useState("Ambulance is arriving");
  const simulatorRef = useRef(null);
  const socketRef = useRef(null);

  const routePoints = useMemo(
    () => [ambulancePosition, userLocation, hospitalLocation],
    [ambulancePosition]
  );

  useEffect(() => {
    simulatorRef.current = createLocationSimulator({
      ambulance: ambulanceInitial,
      userLocation,
      hospitalLocation,
    });
    setEta(simulatorRef.current.getEta());
    setStage(simulatorRef.current.getStage());
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        return;
      }

      const next = simulatorRef.current?.step();
      if (!next) return;
      setAmbulancePosition(next);
      setEta(simulatorRef.current.getEta());
      setStage(simulatorRef.current.getStage());
    }, 2300);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    setStatusText(
      stage === 0
        ? "Ambulance is arriving at pickup"
        : stage === 1
        ? "Patient onboard, heading to hospital"
        : "Ambulance has arrived"
    );
  }, [stage]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/ambulance-tracking");
    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
      showToast("Connected to live tracking server.", "success");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.lat && data.lng) {
          setAmbulancePosition({ lat: data.lat, lng: data.lng });
          setConnected(true);
          setEta(calculateEta(getDistanceHaversine(data.lat, data.lng, userLocation.lat, userLocation.lng)));
        }
      } catch (error) {
        console.warn("Invalid live tracking payload", error);
      }
    };

    socket.onerror = () => {
      setConnected(false);
    };

    socket.onclose = () => {
      setConnected(false);
    };

    const timeout = window.setTimeout(() => {
      if (socket.readyState !== WebSocket.OPEN) {
        showToast("Tracking server unavailable. Using offline simulation.", "info");
      }
    }, 1400);

    return () => {
      window.clearTimeout(timeout);
      socket.close();
    };
  }, []);

  const liveDistance = getDistanceHaversine(ambulancePosition.lat, ambulancePosition.lng, userLocation.lat, userLocation.lng);
  const estimatedEta = calculateEta(liveDistance);

  return (
    <div className="tracking-page">
      <div className="tracking-map-shell">
        <MapView
          ambulancePosition={ambulancePosition}
          userPosition={userLocation}
          hospitalPosition={hospitalLocation}
          routePositions={routePoints}
        />
      </div>

      <div className="tracking-overlay">
        <StatusCard
          title={statusText}
          subtitle="Live route updates show ambulance, pickup point, and destination in real time."
          eta={estimatedEta}
          connection={connected}
        />

        <DriverInfoCard
          driverName="Akash Patel"
          vehicleNumber="MH-12 AB 5732"
          phoneNumber="+91 98765 43210"
          statusTag={stage === 2 ? "Arrived" : "En route"}
        />
      </div>

      <div className="tracking-footer glass-card">
        <div className="footer-pill">Route</div>
        <div className="footer-detail">
          <span>Pickup</span>
          <strong>Central station</strong>
        </div>
        <div className="footer-detail">
          <span>Destination</span>
          <strong>Green Valley Hospital</strong>
        </div>
      </div>
    </div>
  );
}
