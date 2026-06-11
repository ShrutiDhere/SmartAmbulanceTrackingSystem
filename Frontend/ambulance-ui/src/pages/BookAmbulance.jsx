import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useAuth } from "../context/AuthContext";
import { getAllAmbulances } from "../api/ambulance";
import { getAllHospitals } from "../api/hospital";
import { registerPatient } from "../api/patient";
import { raiseEmergency } from "../api/emergency";
import { createBooking } from "../api/bookings";

import { getDistanceHaversine, calculateEta } from "../utils/distance";
import { showToast } from "../utils/toast";

import AmbulanceCard from "../components/AmbulanceCard";
import HospitalList from "../components/HospitalList";
import BookingForm from "../components/BookingForm";
import Loader from "../components/Loader";

export default function BookAmbulance() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [userLocation, setUserLocation] = useState(null);
  const [ambulances, setAmbulances] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [emergencyLevel, setEmergencyLevel] = useState("HIGH");

  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);

  const mapRef = useRef(null);

  // ==========================================
  // Production Data Fetching Engine (Fixed)
  // ==========================================
  useEffect(() => {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your browser.", "danger");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(coords);

        try {
          // 1. Fetch and process live ambulances
          const response = await getAllAmbulances();
          const rawAmbulances = response?.data?.data || response?.data || response || [];

          if (Array.isArray(rawAmbulances)) {
            const availableAmbulances = rawAmbulances
              .filter((amb) => amb.status && amb.status.toUpperCase() === "AVAILABLE")
              .map((amb) => {
                const distance = getDistanceHaversine(coords.lat, coords.lng, amb.latitude, amb.longitude);
                return {
                  ...amb,
                  distance: distance || 0.1,
                  eta: calculateEta(distance) || 1
                };
              })
              .sort((a, b) => a.distance - b.distance);

            setAmbulances(availableAmbulances);
            setSelectedAmbulance(availableAmbulances[0] || null);
          }

          // 2. Fetch and process live hospitals
          const rawHospitals = await getAllHospitals();
          console.log("🏥 Clean Array arriving from hospital.js:", rawHospitals);

          if (Array.isArray(rawHospitals) && rawHospitals.length > 0) {
            const processedHospitals = rawHospitals.map((hospital) => {
              const distance = getDistanceHaversine(coords.lat, coords.lng, hospital.latitude, hospital.longitude);
              return {
                ...hospital,
                distance: distance || 0.5,
                eta: calculateEta(distance) || 3
              };
            }).sort((a, b) => a.distance - b.distance);

            setHospitals(processedHospitals);
            setSelectedHospital(processedHospitals[0] || null);
          } else {
            console.warn("⚠️ Hospital array was parsed empty or format mismatched.");
            setHospitals([]);
          }

        } catch (error) {
          console.error("Error loading system assets:", error);
          showToast("Failed to sync live data from system grid.", "danger");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("GPS access blocked or failed:", error);
        showToast("Please allow location tracking access in your browser.", "warning");

        // Fallback placeholder to map center if device location fails
        setUserLocation({ lat: 16.6914, lng: 74.4667 });
        setLoading(false);
      }
    );
  }, []);

  // ==========================================
  // Timing-Shield Map Rendering Engine
  // ==========================================
  useEffect(() => {
    if (!userLocation) return;

    const mapElement = document.getElementById("booking-map");
    if (!mapElement) {
      const retryTimeout = setTimeout(() => {
        setMapLoading(false);
      }, 100);
      return () => clearTimeout(retryTimeout);
    }

    const container = L.DomUtil.get("booking-map");
    if (container != null) {
      container._leaflet_id = null;
    }

    const map = L.map("booking-map", { zoomControl: false }).setView(
      [userLocation.lat, userLocation.lng],
      13
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    const trackingMarkers = [];

    // Plot User Coordinate marker with a custom Home/Patient icon
    const userMarker = L.marker([userLocation.lat, userLocation.lng], {
      title: "Your location",
      icon: L.divIcon({
        className: "user-map-pin",
        html: `<span style="font-size:22px; background:white; border-radius:50%; padding:5px; border:2px solid #2a9d8f; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display:inline-block;">📍</span>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      })
    })
      .addTo(map)
      .bindPopup("<b>Your Current Location</b>")
      .openPopup();
    trackingMarkers.push(userMarker.getLatLng());

    // Plot Available Ambulances with custom vehicle logos
    ambulances.forEach((ambulance) => {
      if (ambulance.latitude && ambulance.longitude) {
        const ambMarker = L.marker([ambulance.latitude, ambulance.longitude], {
          icon: L.divIcon({
            className: "ambulance-map-pin",
            html: `<span style="font-size:22px; background:white; border-radius:50%; padding:5px; border:2px solid #0077b6; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display:inline-block;">🚑</span>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          })
        })
          .addTo(map)
          .bindPopup(`<b>${ambulance.vehicleNumber}</b><br/>ETA: ${ambulance.eta} mins`);
        trackingMarkers.push(ambMarker.getLatLng());
      }
    });

    // Plot Processed Hospitals
    hospitals.forEach((hospital) => {
      if (hospital.latitude && hospital.longitude) {
        const hospMarker = L.marker([hospital.latitude, hospital.longitude], {
          icon: L.divIcon({
            className: "hospital-map-pin",
            html: `<span style="font-size:20px; background:white; border-radius:50%; padding:4px; border:2px solid #e63946; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">🏥</span>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
          })
        })
          .addTo(map)
          .bindPopup(`<b>${hospital.name}</b><br/>${hospital.distance.toFixed(1)} km away`);
        trackingMarkers.push(hospMarker.getLatLng());
      }
    });

    if (trackingMarkers.length > 1) {
      const bounds = L.latLngBounds(trackingMarkers);
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    mapRef.current = map;
    setMapLoading(false);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [userLocation, ambulances, hospitals]);

  // ==========================================
  // Dispatch Handler Loop (Fixed Object Unpacking)
  // ==========================================
  const handleBooking = async (formData = {}) => {
    const finalEmergencyLevel = formData.emergencyLevel || emergencyLevel;
    const finalNotes = formData.notes || "Emergency Request";
    const targetHospital = formData.hospital || selectedHospital;

    if (!selectedAmbulance) {
      showToast("No active ambulance selected.", "danger");
      return;
    }
    if (!targetHospital) {
      showToast("Please designate a target hospital.", "danger");
      return;
    }

    setBookingLoading(true);
    try {
      // 1. Create Patient Entry on Backend
      const patientResponse = await registerPatient({
        name: user?.name || "Patient",
        age: 25,
        conditionType: finalNotes,
        emergencyLevel: finalEmergencyLevel,
        vitals: "Stable",
      });

      // Safely handle both standard object data and api wrapped models
      const patientData = patientResponse?.data || patientResponse;
      console.log("👤 Patient API Layer Unpacked Data:", patientData);

      // 2. Create Emergency Request Entry on Backend
      const emergencyResponse = await raiseEmergency({
        pickupLat: userLocation.lat,
        pickupLng: userLocation.lng,
        userId: user?.id || user?.userId,
      });

      const emergencyData = emergencyResponse?.data || emergencyResponse;
      console.log("🚨 Emergency Request API Layer Unpacked Data:", emergencyData);

      // 3. Extract primary database transactional tracking keys
      const patientId = patientData?.id;
      const emergencyRequestId = emergencyData?.id;

      console.log(`🆔 Extracted IDs -> PatientID: ${patientId}, EmergencyRequestID: ${emergencyRequestId}`);

      if (!patientId || !emergencyRequestId) {
        throw new Error(`Data Mapping Mismatch: Extracted IDs are empty. Patient: ${patientId}, Emergency: ${emergencyRequestId}`);
      }

      // 4. Assemble payload matching Spring Boot BookingRequestDTO exactly
      const bookingPayload = {
        emergencyRequestId: Number(emergencyRequestId),
        patientId: Number(patientId)
      };

      console.log("📤 Sending clean Payload to /api/bookings/dispatch:", bookingPayload);

      const bookingResponse = await createBooking(bookingPayload);
      const bookingData = bookingResponse?.data || bookingResponse;
      console.log("✅ Booking Dispatch Succeeded:", bookingData);

      // Attach client-side contextual metadata for routing state variables
      const trackingData = {
        ...bookingData,
        pickupLocation: userLocation,
        hospital: targetHospital,
        ambulance: selectedAmbulance,
        emergencyLevel: finalEmergencyLevel
      };

      window.localStorage.setItem("smart_ambulance_last_booking", JSON.stringify(trackingData));
      showToast("Ambulance dispatched successfully!", "success");
      navigate("/track", { state: { booking: trackingData } });

    } catch (error) {
      console.error("Booking dispatch crash details: ", error);
      showToast(error.message || "Booking request failed.", "danger");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Searching nearby ambulances and hospitals..." />;
  }

  return (
    <div className="booking-page page-layout">
      <div className="page-head">
        <div>
          <span className="eyebrow">Live ambulance booking</span>
          <h2>Fast booking with nearby ambulances</h2>
          <p>Select emergency level, hospital, and confirm your pickup instantly.</p>
        </div>
        <div className="status-chip">{ambulances.length} ambulances nearby</div>
      </div>

      <div className="booking-grid">
        <section className="booking-map-panel glass-card" style={{ minHeight: "500px", position: "relative" }}>
          <div
            id="booking-map"
            className="map-view"
            style={{
              height: "500px",
              width: "100%",
              borderRadius: "8px",
              display: mapLoading ? "none" : "block"
            }}
          />

          {mapLoading && (
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
              <Loader message="Preparing tracking grid maps..." />
            </div>
          )}

          {!mapLoading && ambulances.length === 0 && (
            <div className="no-ambulances-fallback d-flex flex-column align-items-center justify-content-center p-5 text-center text-muted" style={{ height: "500px" }}>
              <span style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚠️</span>
              <h5>No Ambulances Available</h5>
              <p className="small max-w-md">There are no vehicles currently marked as 'AVAILABLE' in the database table.</p>
            </div>
          )}

          {ambulances.length > 0 && (
            <div className="nearby-list">
              {ambulances.map((ambulance) => (
                <AmbulanceCard
                  key={ambulance.id}
                  ambulance={ambulance}
                  selected={selectedAmbulance?.id === ambulance.id}
                  onSelect={setSelectedAmbulance}
                />
              ))}
            </div>
          )}
        </section>

        <aside className="booking-sidebar glass-card">
          <div className="booking-panel-head">
            <h3>Your next ambulance</h3>
            <p>
              {selectedAmbulance
                ? `Nearest ambulance arrives in ${selectedAmbulance.eta} minutes.`
                : "No ambulance selected."}
            </p>
          </div>

          <div className="hospital-panel">
            <h4>Choose hospital</h4>
            {hospitals.length > 0 ? (
              <HospitalList
                hospitals={hospitals}
                selectedHospital={selectedHospital}
                onSelect={setSelectedHospital}
              />
            ) : (
              <div className="p-3 text-center text-muted small">No hospitals available in directory.</div>
            )}
          </div>

          <BookingForm
            onSubmit={handleBooking}
            selectedHospital={selectedHospital}
            emergencyLevel={emergencyLevel}
            setEmergencyLevel={setEmergencyLevel}
            loading={bookingLoading}
          />
        </aside>
      </div>
    </div>
  );
}