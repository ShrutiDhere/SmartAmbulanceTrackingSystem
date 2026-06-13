import { useEffect, useState } from "react";

// Haversine Navigation Engine: Maps live ambulance coordinates to hospital grid vectors
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 999;
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
};

export default function HospitalDashboard() {
  // --- Core Application States ---
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [ambulances, setAmbulances] = useState([]);
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Form & Action UI States ---
  const [inputIcu, setInputIcu] = useState("");
  const [inputGeneral, setInputGeneral] = useState("");
  const [isUpdatingBeds, setIsUpdatingBeds] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  // Spring Boot Base URL
  const BACKEND_URL = "http://localhost:8080/api";

  // --- Network Sync Polling Loop (Triggers every 4 seconds) ---
  useEffect(() => {
    loadDatabaseState();
    const networkSyncLoop = setInterval(loadDatabaseState, 4000); 
    return () => clearInterval(networkSyncLoop);
  }, []);

  const loadDatabaseState = async () => {
    try {
      const [hospRes, ambRes, emergRes] = await Promise.all([
        fetch(`${BACKEND_URL}/hospitals/all`).then(r => r.json()),
        fetch(`${BACKEND_URL}/ambulances/all`).then(r => r.json()),
        fetch(`${BACKEND_URL}/emergency-requests/all`).then(r => r.json())
      ]);

      // Unpack response or fall back directly to an array
      const fetchedHospitals = hospRes?.data || hospRes || [];
      const fetchedAmbulances = ambRes?.data || ambRes || [];
      const fetchedRequests = emergRes?.data || emergRes || [];

      setHospitals(fetchedHospitals);
      setAmbulances(fetchedAmbulances);
      setEmergencyRequests(fetchedRequests);

      // Keep user selections focused during background intervals
      if (fetchedHospitals.length > 0) {
        setSelectedHospital(prev => {
          if (!prev) return fetchedHospitals[0];
          return fetchedHospitals.find(h => String(h.id) === String(prev.id)) || fetchedHospitals[0];
        });
      }
      if (fetchedAmbulances.length > 0) {
        setSelectedAmbulance(prev => {
          if (!prev) return fetchedAmbulances[0];
          return fetchedAmbulances.find(a => String(a.id) === String(prev.id)) || fetchedAmbulances[0];
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Critical Connection Error: Remote backend link down:", error);
    }
  };

  // --- PUT: Update Bed Counts ---
  const handleBedConfigurationUpdate = async (e) => {
    e.preventDefault();
    if (!selectedHospital) return;
    setIsUpdatingBeds(true);
    
    const currentIcu = selectedHospital.icuBeds ?? selectedHospital.icu_beds ?? 0;
    const currentGeneral = selectedHospital.generalBeds ?? selectedHospital.general_beds ?? 0;

    const icuTarget = inputIcu !== "" ? parseInt(inputIcu) : currentIcu;
    const generalTarget = inputGeneral !== "" ? parseInt(inputGeneral) : currentGeneral;

    try {
      const response = await fetch(
        `${BACKEND_URL}/hospitals/${selectedHospital.id}/beds?icuBeds=${icuTarget}&generalBeds=${generalTarget}`, 
        { method: "PUT" }
      ).then(r => r.json());

      const updatedData = response?.data || response;
      if (updatedData && updatedData.id) {
        setSelectedHospital(updatedData);
        setHospitals(prev => prev.map(h => String(h.id) === String(updatedData.id) ? updatedData : h));
        setInputIcu("");
        setInputGeneral("");
      }
    } catch (err) {
      console.error("Failed to commit bed layout modifications:", err);
    } finally {
      setIsUpdatingBeds(false);
    }
  };

  // --- PUT: Toggle Emergency Availability ---
  const toggleEmergencyAvailability = async () => {
    if (!selectedHospital) return;
    setIsTogglingStatus(true);
    
    const currentAvailability = selectedHospital.emergencyAvailable ?? selectedHospital.emergency_available ?? false;
    const targetAvailability = !currentAvailability;

    try {
      const response = await fetch(
        `${BACKEND_URL}/hospitals/${selectedHospital.id}/availability?available=${targetAvailability}`,
        { method: "PUT" }
      ).then(r => r.json());

      const updatedData = response?.data || response;
      if (updatedData && updatedData.id) {
        setSelectedHospital(updatedData);
        setHospitals(prev => prev.map(h => String(h.id) === String(updatedData.id) ? updatedData : h));
      }
    } catch (err) {
      console.error("Failed to toggle facility availability status:", err);
    } finally {
      setIsTogglingStatus(false);
    }
  };

  // --- PUT: Resolve/Complete Emergency Status ---
  const handleTriageResolution = async (requestId, nextStatus) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/emergency-requests/${requestId}/status?status=${nextStatus}`, 
        { method: "PUT" }
      ).then(r => r.json());

      if (response?.success || response) {
        loadDatabaseState(); 
      }
    } catch (err) {
      console.error("Failed to change emergency request status:", err);
    }
  };

  // --- Distance Calculations ---
  const sortedHospitals = [...hospitals].map(h => ({
    ...h,
    distance: calculateDistance(selectedAmbulance?.latitude, selectedAmbulance?.longitude, h.latitude, h.longitude)
  })).sort((a, b) => a.distance - b.distance);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinnerPulse}></div>
        <p style={styles.loadingTypography}>STREAMING PUNE LIVE CRITICAL INFRASTRUCTURE DATA...</p>
      </div>
    );
  }

  // Value resolution fallback bindings
  const displayIcu = selectedHospital?.icuBeds ?? selectedHospital?.icu_beds ?? 0;
  const displayGeneral = selectedHospital?.generalBeds ?? selectedHospital?.general_beds ?? 0;
  const isEmergencyOnline = selectedHospital?.emergencyAvailable ?? selectedHospital?.emergency_available ?? false;
  const displayContact = selectedHospital?.contactNumber ?? selectedHospital?.contact_number ?? "N/A";

  return (
    <div style={styles.viewportWrapper}>
      
      {/* CONTROL HEADER */}
      <header style={styles.dashboardHeader}>
        <div>
          <h1 style={styles.headerPrimaryTitle}>TACTICAL AMBULANCE COMMAND SYSTEM</h1>
          <p style={styles.headerSecondaryTitle}>Live Emergency Infrastructure Hub • Pune Control Node</p>
        </div>
        
        <div style={styles.vectorSelectionBox}>
          <label style={styles.smallOverlineLabel}>RADAR FLEET SELECTION TARGET</label>
          <select 
            value={selectedAmbulance?.id || ""} 
            onChange={(e) => setSelectedAmbulance(ambulances.find(a => String(a.id) === String(e.target.value)))}
            style={styles.systemSelectMenu}
          >
            {ambulances.length === 0 && <option value="">No Active Fleet Elements Found</option>}
            {ambulances.map(a => (
              <option key={a.id} value={a.id} style={{backgroundColor: '#111827'}}>
                {a.vehicleNumber || `Ambulance #${a.id}`} — [{a.status || "IDLE"}]
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* EXECUTIVE SUMMARY KPI ROW */}
      <section style={styles.kpiDashboardRow}>
        <div style={{...styles.kpiModuleCard, borderTop: "3px solid #3b82f6"}}>
          <span style={styles.kpiCardOverline}>ALLOCATED ICU RESERVES</span>
          <div style={styles.kpiDataContainer}>
            <h2 style={{...styles.kpiPrimaryValue, color: "#3b82f6"}}>{displayIcu}</h2>
            <span style={styles.kpiMeasurementUnit}>Beds Available</span>
          </div>
          <p style={styles.kpiCardFooter}>Facility Node: {selectedHospital?.name || "None"}</p>
        </div>

        <div style={{...styles.kpiModuleCard, borderTop: "3px solid #10b981"}}>
          <span style={styles.kpiCardOverline}>GENERAL ADMISSION ALLOCATION</span>
          <div style={styles.kpiDataContainer}>
            <h2 style={{...styles.kpiPrimaryValue, color: "#10b981"}}>{displayGeneral}</h2>
            <span style={styles.kpiMeasurementUnit}>Beds Open</span>
          </div>
          <p style={styles.kpiCardFooter}>Ready for immediate diversion</p>
        </div>

        <div style={{...styles.kpiModuleCard, borderTop: "3px solid #f59e0b"}}>
          <span style={styles.kpiCardOverline}>TRACKED REGIONAL FLEET VECTOR COUNT</span>
          <div style={styles.kpiDataContainer}>
            <h2 style={{...styles.kpiPrimaryValue, color: "#f59e0b"}}>{ambulances.length}</h2>
            <span style={styles.kpiMeasurementUnit}>Units Online</span>
          </div>
          <p style={styles.kpiCardFooter}>Synchronized via tracking grid</p>
        </div>

        <div style={{...styles.kpiModuleCard, borderTop: `3px solid ${isEmergencyOnline ? "#10b981" : "#ef4444"}`}}>
          <span style={styles.kpiCardOverline}>DIVERT INTERFACE STATE GATEWAY</span>
          <div style={styles.kpiDataContainer}>
            <h2 style={{...styles.kpiPrimaryValue, color: isEmergencyOnline ? "#10b981" : "#ef4444"}}>
              {isEmergencyOnline ? "ONLINE" : "DIVERTING"}
            </h2>
          </div>
          <button 
            onClick={toggleEmergencyAvailability} 
            disabled={isTogglingStatus} 
            style={{...styles.inlineToggleBtn, backgroundColor: isEmergencyOnline ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)", color: isEmergencyOnline ? "#ef4444" : "#10b981"}}
          >
            {isTogglingStatus ? "SAVING..." : "TOGGLE STATE"}
          </button>
        </div>
      </section>

      {/* DATA DISPLAY HUDS */}
      <main style={styles.workspaceGridSystem}>
        
        {/* LEFT COLUMN */}
        <div style={styles.controlSidebarLayout}>
          <div style={styles.glassDashboardPanel}>
            <div style={styles.panelTitleContainerBar}>🏥 SELECTED FACILITY ARCHIVE PROFILE</div>
            <div style={styles.panelInnerContentArea}>
              <div style={styles.profileDataStackItem}>
                <label style={styles.profileItemDataLabel}>FACILITY CALLSIGN REGISTER NAME</label>
                <span style={styles.profileItemBrightText}>{selectedHospital?.name || "Select Hospital Node"}</span>
              </div>
              <div style={styles.profileDataStackItem}>
                <label style={styles.profileItemDataLabel}>TELEPHONY TRUNK COMMS INTERFACE</label>
                <span style={{...styles.profileItemBrightText, color: "#ef4444"}}>{displayContact}</span>
              </div>
              <div style={styles.profileDataStackItem}>
                <label style={styles.profileItemDataLabel}>GEOGRAPHIC DATA ROUTING ADDRESS</label>
                <span style={styles.profileItemMutedText}>{selectedHospital?.address || "No location parameters provided."}</span>
              </div>
            </div>
          </div>

          <div style={styles.glassDashboardPanel}>
            <div style={styles.panelTitleContainerBar}>⚙️ EMERGENCY ALLOCATION RESOURCE CONTROL</div>
            <form onSubmit={handleBedConfigurationUpdate} style={styles.panelFormInnerSpacing}>
              <div style={styles.inputLayoutContainerStack}>
                <label style={styles.inputBoxLabel}>OVERWRITE TARGET ICU COUNTS</label>
                <input 
                  type="number" 
                  placeholder={displayIcu} 
                  value={inputIcu} 
                  onChange={(e) => setInputIcu(e.target.value)} 
                  style={styles.systemFormInputBlock} 
                />
              </div>
              <div style={styles.inputLayoutContainerStack}>
                <label style={styles.inputBoxLabel}>OVERWRITE TARGET GENERAL COUNTS</label>
                <input 
                  type="number" 
                  placeholder={displayGeneral} 
                  value={inputGeneral} 
                  onChange={(e) => setInputGeneral(e.target.value)} 
                  style={styles.systemFormInputBlock} 
                />
              </div>
              <button type="submit" disabled={isUpdatingBeds} style={styles.systemPrimaryButtonBlock}>
                {isUpdatingBeds ? "SYNCING SERVICE DATA..." : "FORCE LIVE COUNTS SYNCHRONIZATION"}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={styles.dataEngineMainLayoutColumn}>
          <div style={styles.glassDashboardPanel}>
            <div style={styles.panelTableDynamicHeaderRow}>
              <span style={{fontWeight: "700", color: "#f1f5f9"}}>PUNE GEOGRAPHIC PROXIMITY INDEX MATRICES</span>
              {selectedAmbulance && (
                <span style={styles.liveSystemPillBadge}>
                  RADAR REFERENCE TARGET: {selectedAmbulance.vehicleNumber || `ID: ${selectedAmbulance.id}`}
                </span>
              )}
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={styles.layoutDataGridTable}>
                <thead>
                  <tr style={styles.tableHeaderRowStyling}>
                    <th style={styles.gridHeaderCellLayout}>Medical Center Callsign</th>
                    <th style={styles.gridHeaderCellLayout}>Fleet Relative Distance</th>
                    <th style={styles.gridHeaderCellLayout}>ICU Reserve Pool</th>
                    <th style={styles.gridHeaderCellLayout}>General Admission</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedHospitals.map((h) => {
                    const isSelectedNode = selectedHospital?.id === h.id;
                    const hIcu = h.icuBeds ?? h.icu_beds ?? 0;
                    const hGen = h.generalBeds ?? h.general_beds ?? 0;
                    return (
                      <tr 
                        key={h.id} 
                        onClick={() => setSelectedHospital(h)}
                        style={{
                          ...styles.gridBodyRowStyling,
                          backgroundColor: isSelectedNode ? "rgba(59, 130, 246, 0.07)" : "transparent",
                          boxShadow: isSelectedNode ? "inset 4px 0px 0px #3b82f6" : "none"
                        }}
                      >
                        <td style={styles.gridCellTextPrimary}>🏢 {h.name}</td>
                        <td style={styles.gridCellTextSecondary}><span style={styles.proximityDistanceTag}>{h.distance} KM</span></td>
                        <td style={{...styles.gridCellTextSecondary, color: "#3b82f6", fontWeight: "600"}}>{hIcu} Open</td>
                        <td style={{...styles.gridCellTextSecondary, color: "#10b981", fontWeight: "600"}}>{hGen} Open</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div style={styles.glassDashboardPanel}>
            <div style={styles.panelTitleContainerBar}>🚨 INBOUND INCIDENT FIELD PIPELINE DISPATCH LOGS</div>
            <div style={styles.eventLogTerminalFeedContainer}>
              {emergencyRequests.filter(req => {
                const targetId = req.hospital?.id || req.hospitalId;
                return String(targetId) === String(selectedHospital?.id);
              }).length > 0 ? (
                emergencyRequests.filter(req => {
                  const targetId = req.hospital?.id || req.hospitalId;
                  return String(targetId) === String(selectedHospital?.id);
                }).map((req) => (
                  <div key={req.id} style={styles.terminalLogItemCardRow}>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '2px'}}>
                      <span style={styles.terminalLogItemTicketId}>[TICKET TRANSACTION #{req.id}]</span>
                      <span style={styles.terminalLogItemSubtext}>
                        Asset Vehicle: <strong>{req.ambulance?.vehicleNumber || req.vehicleNumber || `Unit ID #${req.ambulanceId || "N/A"}`}</strong>
                      </span>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '14px', marginLeft: 'auto'}}>
                      <span style={{
                        ...styles.statusInlineBadge,
                        backgroundColor: req.status === "COMPLETED" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                        color: req.status === "COMPLETED" ? "#10b981" : "#ef4444"
                      }}>{req.status}</span>
                      
                      {req.status !== "COMPLETED" && (
                        <button 
                          onClick={() => handleTriageResolution(req.id, "COMPLETED")} 
                          style={styles.resolveActionInlineButton}
                        >
                          ARCHIVE DISPATCH ENTRY
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.emptyTerminalLogsPlaceholder}>Zero inbound emergency traffic components currently mapped to this node.</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- FLEXIBLE DENSITY DESK STYLESHEET ---
const styles = {
  viewportWrapper: { backgroundColor: "#070a13", color: "#e2e8f0", minHeight: "100vh", padding: "1.5rem 2rem", fontFamily: "system-ui, -apple-system, sans-serif", boxSizing: "border-box" },
  loadingContainer: { backgroundColor: "#070a13", minHeight: "100vh", display: "flex", flexDirection: "column", gap: "1rem", justifyContent: "center", alignItems: "center" },
  loadingTypography: { fontFamily: "monospace", color: "#475569", letterSpacing: "1px", fontSize: "0.8rem" },
  spinnerPulse: { width: "32px", height: "32px", border: "3px solid rgba(59,130,246,0.1)", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  dashboardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", paddingBottom: "1.25rem", marginBottom: "1.5rem" },
  headerPrimaryTitle: { fontSize: "1.3rem", fontWeight: "800", margin: "0 0 4px 0", letterSpacing: "-0.02em", color: "#ffffff" },
  headerSecondaryTitle: { color: "#475569", fontSize: "0.8rem", margin: "0" },
  vectorSelectionBox: { display: "flex", flexDirection: "column", gap: "4px", width: "240px" },
  smallOverlineLabel: { fontSize: "0.6rem", fontWeight: "700", color: "#475569", letterSpacing: "0.04em" },
  systemSelectMenu: { backgroundColor: "#111827", color: "#f8fafc", border: "1px solid #1e293b", padding: "0.55rem 0.85rem", borderRadius: "6px", fontWeight: "600", fontSize: "0.8rem", outline: "none", cursor: "pointer" },
  kpiDashboardRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "1.5rem" },
  kpiModuleCard: { backgroundColor: "#111827", border: "1px solid #1e293b", borderRadius: "8px", padding: "1.2rem", position: "relative" },
  kpiCardOverline: { fontSize: "0.65rem", fontWeight: "700", color: "#64748b", letterSpacing: "0.03em" },
  kpiDataContainer: { display: "flex", alignItems: "baseline", gap: "6px", margin: "6px 0" },
  kpiPrimaryValue: { fontSize: "1.9rem", fontWeight: "800", margin: "0", letterSpacing: "-0.02em" },
  kpiMeasurementUnit: { fontSize: "0.75rem", color: "#475569", fontWeight: "500" },
  kpiCardFooter: { fontSize: "0.7rem", color: "#475569", margin: "0" },
  inlineToggleBtn: { border: "none", position: "absolute", top: "1.2rem", right: "1.2rem", padding: "4px 8px", fontSize: "0.65rem", fontWeight: "700", borderRadius: "4px", cursor: "pointer" },
  workspaceGridSystem: { display: "flex", gap: "1.5rem", flexWrap: "wrap" },
  controlSidebarLayout: { flex: "1", display: "flex", flexDirection: "column", gap: "1.5rem", minWidth: "310px" },
  dataEngineMainLayoutColumn: { flex: "2.6", display: "flex", flexDirection: "column", gap: "1.5rem", minWidth: "500px" },
  glassDashboardPanel: { backgroundColor: "#111827", border: "1px solid #1e293b", borderRadius: "8px", overflow: "hidden" },
  panelTitleContainerBar: { padding: "0.85rem 1.25rem", borderBottom: "1px solid #1e293b", fontWeight: "700", fontSize: "0.7rem", color: "#94a3b8", backgroundColor: "#141c2f", letterSpacing: "0.03em" },
  panelTableDynamicHeaderRow: { padding: "0.85rem 1.25rem", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#141c2f", fontSize: "0.7rem", color: "#94a3b8" },
  panelInnerContentArea: { padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" },
  panelFormInnerSpacing: { padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" },
  profileDataStackItem: { display: "flex", flexDirection: "column", gap: "2px" },
  profileItemDataLabel: { fontSize: "0.6rem", fontWeight: "700", color: "#475569", letterSpacing: "0.03em" },
  profileItemBrightText: { fontSize: "0.85rem", color: "#ffffff", fontWeight: "600" },
  profileItemMutedText: { fontSize: "0.8rem", color: "#94a3b8", lineHeight: "1.4" },
  inputLayoutContainerStack: { display: "flex", flexDirection: "column", gap: "4px" },
  inputBoxLabel: { fontSize: "0.65rem", fontWeight: "700", color: "#94a3b8", letterSpacing: "0.02em" },
  systemFormInputBlock: { width: "100%", backgroundColor: "#070a13", border: "1px solid #1e293b", borderRadius: "6px", padding: "0.6rem 0.8rem", color: "#ffffff", fontSize: "0.8rem", boxSizing: "border-box", outline: "none" },
  systemPrimaryButtonBlock: { backgroundColor: "#2563eb", color: "#ffffff", border: "none", fontWeight: "700", fontSize: "0.8rem", padding: "0.75rem", borderRadius: "6px", cursor: "pointer", transition: "background 0.2s" },
  liveSystemPillBadge: { fontSize: "0.65rem", backgroundColor: "rgba(59,130,246,0.12)", color: "#3b82f6", padding: "0.2rem 0.5rem", borderRadius: "4px", fontWeight: "700" },
  layoutDataGridTable: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  tableHeaderRowStyling: { backgroundColor: "#141c2f", borderBottom: "1px solid #1e293b" },
  gridHeaderCellLayout: { padding: "0.85rem 1.25rem", fontSize: "0.65rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em" },
  gridBodyRowStyling: { borderBottom: "1px solid #1e293b", cursor: "pointer", transition: "background-color 0.2s" },
  gridCellTextPrimary: { padding: "0.95rem 1.25rem", fontSize: "0.8rem", fontWeight: "600", color: "#ffffff" },
  gridCellTextSecondary: { padding: "0.95rem 1.25rem", fontSize: "0.8rem", color: "#94a3b8" },
  proximityDistanceTag: { backgroundColor: "rgba(245,158,11,0.06)", color: "#f59e0b", padding: "0.2rem 0.4rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "700" },
  eventLogTerminalFeedContainer: { padding: "0.75rem", backgroundColor: "#090c15", display: "flex", flexDirection: "column", gap: "6px" },
  terminalLogItemCardRow: { backgroundColor: "#111827", border: "1px solid #1e293b", padding: "0.65rem 1rem", borderRadius: "6px", display: "flex", alignItems: "center" },
  terminalLogItemTicketId: { color: "#3b82f6", fontWeight: "700", fontFamily: "monospace", fontSize: "0.75rem" },
  terminalLogItemSubtext: { color: "#64748b", fontSize: "0.75rem" },
  statusInlineBadge: { padding: "3px 8px", borderRadius: "4px", fontSize: "0.65rem", fontWeight: "800", letterSpacing: "0.02em" },
  resolveActionInlineButton: { backgroundColor: "#10b981", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", fontSize: "0.7 its ", fontWeight: "700", cursor: "pointer", transition: "background 0.2s" },
  emptyTerminalLogsPlaceholder: { fontSize: "0.75rem", color: "#475569", fontStyle: "italic", textAlign: "center", padding: "1.5rem" }
};