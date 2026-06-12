import { useEffect, useState } from "react";
import {
  Building2,
  Activity,
  BedDouble,
  Ambulance,
  Phone,
  Mail,
  MapPin,
  Siren,
  Clock3,
} from "lucide-react";

import { getAllHospitals } from "../api/hospital";
import { getAllAmbulances } from "../api/ambulance";
import "./hospital-dashboard.css";

export default function HospitalDashboard() {
  const [hospital, setHospital] = useState(null);
  const [ambulances, setAmbulances] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const hospitals = await getAllHospitals();

      if (hospitals?.length > 0) {
        setHospital(hospitals[0]);
      }

      const ambulanceResponse = await getAllAmbulances();
      setAmbulances(ambulanceResponse.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  if (!hospital) {
    return (
      <div className="hospital-loading">
        Loading Hospital Dashboard...
      </div>
    );
  }

  return (
    <div className="hospital-page">
      <div className="dashboard-header">
        <div>
          <span className="dashboard-tag">
            Smart Ambulance Network
          </span>

          <h1>Hospital Command Center</h1>

          <p>
            Real-time monitoring of beds, emergency
            readiness and ambulance fleet.
          </p>
        </div>

        <div className="hospital-badge">
          <Building2 size={22} />
          {hospital.name}
        </div>
      </div>

      <div className="stats-grid">

        <div className="stat-card red">
          <Siren />
          <div>
            <h2>
              {hospital.emergencyAvailable
                ? "ACTIVE"
                : "OFFLINE"}
            </h2>
            <p>Emergency Status</p>
          </div>
        </div>

        <div className="stat-card blue">
          <Activity />
          <div>
            <h2>{hospital.icuBeds}</h2>
            <p>ICU Beds</p>
          </div>
        </div>

        <div className="stat-card green">
          <BedDouble />
          <div>
            <h2>{hospital.generalBeds}</h2>
            <p>General Beds</p>
          </div>
        </div>

        <div className="stat-card purple">
          <Ambulance />
          <div>
            <h2>{ambulances.length}</h2>
            <p>Ambulance Fleet</p>
          </div>
        </div>

      </div>

      <div className="dashboard-content">

        <div className="fleet-panel">

          <div className="panel-header">
            <h2>Live Ambulance Fleet</h2>
          </div>

          {ambulances.map((item) => (
            <div
              className="ambulance-card"
              key={item.id}
            >
              <div>
                <h3>{item.vehicleNumber}</h3>

                <p>
                  {item.currentLocation ||
                    "Location Updating"}
                </p>
              </div>

              <div className="ambulance-right">

                <span
                  className={`status ${
                    item.status === "AVAILABLE"
                      ? "available"
                      : "busy"
                  }`}
                >
                  {item.status}
                </span>

                <div className="speed">
                  <Clock3 size={16} />
                  {item.speed} km/h
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hospital-info">

          <h2>Hospital Profile</h2>

          <div className="info-item">
            <Mail size={18} />
            {hospital.email}
          </div>

          <div className="info-item">
            <Phone size={18} />
            {hospital.contactNumber}
          </div>

          <div className="info-item">
            <MapPin size={18} />
            {hospital.address}
          </div>

          <div className="location-box">
            <h3>Geo Coordinates</h3>

            <p>
              {hospital.latitude},
              {hospital.longitude}
            </p>
          </div>

        </div>
      </div>

      <div className="operations-table">

        <div className="table-header">
          Ambulance Operations
        </div>

        <table>
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Status</th>
              <th>Driver</th>
              <th>Speed</th>
            </tr>
          </thead>

          <tbody>
            {ambulances.map((a) => (
              <tr key={a.id}>
                <td>{a.vehicleNumber}</td>
                <td>{a.status}</td>
                <td>
                  {a.driverName || "Not Assigned"}
                </td>
                <td>{a.speed} km/h</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}