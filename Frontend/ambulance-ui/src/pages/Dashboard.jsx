import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="container text-center mt-5">
      <h1>🚑 Smart Ambulance System</h1>

      <div className="mt-4">
        <Link to="/map" className="btn btn-primary m-2">
          View Live Map
        </Link>

        <Link to="/booking" className="btn btn-danger m-2">
          Book Ambulance
        </Link>
      </div>
    </div>
  );
}