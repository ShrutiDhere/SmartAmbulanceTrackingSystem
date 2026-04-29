// import api from "../services/api";

export default function Booking() {

  const bookAmbulance = () => {
    api.post("/book", {
      pickupLat: 19.9975,
      pickupLng: 73.7898
    })
    .then(res => {
      alert("🚑 Ambulance Booked! ID: " + res.data.id);
    })
    .catch(err => {
      alert("❌ Booking Failed");
    });
  };

  return (
    <div className="container text-center mt-5">
      <h2>🚑 Book Ambulance</h2>

      <button onClick={bookAmbulance} className="btn btn-danger mt-3">
        Book Now
      </button>
    </div>
  );
}