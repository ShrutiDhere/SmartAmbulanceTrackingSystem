import { useEffect, useRef, useState } from "react";
import L from "leaflet";

export default function MapPage() {

  const mapRef = useRef(null);
  const markersRef = useRef({});
  const dataRef = useRef([]);
  const routeRef = useRef(null);
  const arrivedRef = useRef({});

  const [userLoc, setUserLoc] = useState(null);
  const [assigned, setAssigned] = useState(null);
  const [status, setStatus] = useState("Click Book Ambulance");
  const [eta, setEta] = useState(null);
  const [originAddr, setOriginAddr] = useState("");

  // icons
  const ambIcon = L.divIcon({ html: "🚑", className: "", iconSize: [25,25] });
  const selectedIcon = L.divIcon({ html: "🚑", className: "", iconSize: [40,40] });
  const userIcon = L.divIcon({ html: "📍", className: "", iconSize: [30,30] });

  // distance
  const dist=(a,b,c,d)=>{
    const R=6371;
    const dLat=(c-a)*Math.PI/180;
    const dLon=(d-b)*Math.PI/180;
    const x=Math.sin(dLat/2)**2+
      Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*
      Math.sin(dLon/2)**2;
    return R*(2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x)));
  };

  // reverse geocode
  const getAddress = async (lat,lng)=>{
    try{
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      return data.display_name;
    }catch{
      return "Unknown location";
    }
  };

  useEffect(()=>{

    if(mapRef.current) return;

    const map=L.map("map").setView([19.9975,73.7898],13);
    mapRef.current=map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    setTimeout(()=>map.invalidateSize(),500);

    navigator.geolocation.getCurrentPosition((pos)=>{

      const {latitude,longitude}=pos.coords;

      setUserLoc({lat:latitude,lng:longitude});
      map.setView([latitude,longitude],14);

      L.marker([latitude,longitude],{icon:userIcon})
        .addTo(map)
        .bindPopup("You");

      let arr=[];
      for(let i=1;i<=25;i++){
        const a={
          id:i,
          lat:latitude+(Math.random()-0.5)*0.02,
          lng:longitude+(Math.random()-0.5)*0.02
        };

        arr.push(a);

        // 👉 SHOW ID ON MAP
        const m=L.marker([a.lat,a.lng],{
          icon: L.divIcon({
            html:`<div style="font-size:14px;">🚑 ${a.id}</div>`,
            className:"",
            iconSize:[40,20]
          })
        }).addTo(map);

        markersRef.current[a.id]=m;
      }

      dataRef.current=arr;

      // movement
      setInterval(()=>{
        dataRef.current.forEach(a=>{

          if (
            (assigned && a.id===assigned.id) ||
            arrivedRef.current[a.id]
          ) return;

          a.lat+=(Math.random()-0.5)*0.001;
          a.lng+=(Math.random()-0.5)*0.001;

          markersRef.current[a.id].setLatLng([a.lat,a.lng]);
        });
      },2000);

    });

  },[assigned]);

  // 🚑 BOOK
  const book = async () => {

    if(!userLoc) return alert("Location not ready");

    setStatus("🔍 Searching nearest ambulance...");

    let near=null,min=999;

    dataRef.current.forEach(a=>{
      const d=dist(userLoc.lat,userLoc.lng,a.lat,a.lng);
      if(d<min){min=d;near=a;}
    });

    setAssigned(near);

    // highlight selected
    const marker=markersRef.current[near.id];
    marker.setIcon(L.divIcon({
      html:`<div style="font-size:18px;color:red;">🚑 ${near.id}</div>`,
      className:"",
      iconSize:[50,25]
    }));

    // get address
    const addr = await getAddress(near.lat, near.lng);
    setOriginAddr(addr);

    setStatus("✅ Driver Accepted");

    moveToUser(near);
  };

  // route
  const draw=(a,b)=>{
    if(routeRef.current) routeRef.current.remove();

    routeRef.current=L.polyline([a,b],{
      color:"blue",
      weight:4
    }).addTo(mapRef.current);
  };

  // 🚑 MOVE
  const moveToUser=(amb)=>{

    const marker=markersRef.current[amb.id];

    const i=setInterval(()=>{

      amb.lat+=(userLoc.lat-amb.lat)*0.15;
      amb.lng+=(userLoc.lng-amb.lng)*0.15;

      marker.setLatLng([amb.lat,amb.lng]);

      const d=dist(amb.lat,amb.lng,userLoc.lat,userLoc.lng);
      setEta((d*2).toFixed(1));

      draw([amb.lat,amb.lng],[userLoc.lat,userLoc.lng]);

      // ARRIVAL FIX
      if(d < 0.01){

        clearInterval(i);

        arrivedRef.current[amb.id]=true;

        amb.lat=userLoc.lat;
        amb.lng=userLoc.lng;

        marker.setLatLng([userLoc.lat,userLoc.lng]);

        setStatus("🚑 Driver Arrived");

      }

    },1000);
  };

  return (
    <>
      <div id="map" style={{height:"100vh"}}></div>

      {/* BUTTON */}
      <button
        onClick={book}
        style={{
          position:"absolute",
          bottom:"20px",
          right:"20px",
          zIndex:1000,
          padding:"14px",
          background:"black",
          color:"white",
          borderRadius:"30px",
          border:"none"
        }}
      >
        🚑 Book Ambulance
      </button>

      {/* PANEL */}
      {assigned && (
        <div style={{
          position:"absolute",
          bottom:0,
          width:"100%",
          background:"white",
          padding:"15px",
          zIndex:1000,
          boxShadow:"0 -3px 10px rgba(0,0,0,0.2)"
        }}>
          <b>{status}</b>

          <div>🚑 Ambulance #{assigned.id}</div>

          <div style={{fontSize:"13px",color:"gray"}}>
            📍 {originAddr}
          </div>

          {eta && <div>⏱ ETA: {eta} min</div>}
        </div>
      )}
    </>
  );
}