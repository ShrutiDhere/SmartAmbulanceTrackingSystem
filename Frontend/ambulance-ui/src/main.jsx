import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import "./styles/global.css";
import "./styles/auth.css";
import "./styles/dashboard.css";
import "./styles/tracking.css";
import "./index.css";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);