import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function RecentBooking() {

  const [booking, setBooking] =
    useState(null);

  useEffect(() => {

    const stored =
      localStorage.getItem(
        "smart_ambulance_last_booking"
      );

    if (stored) {
      setBooking(JSON.parse(stored));
    }

  }, []);

  if (!booking) return null;

  return (
    <div className="glass-card booking-card">

      <h2>Latest Booking</h2>

      <p>
        Ambulance ID :
        {booking?.ambulance?.id || "N/A"}
      </p>

      <p>
        Status :
        {booking?.status}
      </p>

      <p>
        Hospital :
        {booking?.hospital?.name ||
          booking?.hospitalName}
      </p>

      <Link
        to="/live-tracking"
        className="btn btn-danger"
      >
        Track Ambulance
      </Link>

    </div>
  );
}