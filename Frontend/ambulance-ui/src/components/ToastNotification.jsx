import { useEffect, useState } from "react";

export default function ToastNotification() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const showMessage = (event) => {
      setToast(event.detail);
    };
    window.addEventListener("smart-ambulance-toast", showMessage);
    return () => window.removeEventListener("smart-ambulance-toast", showMessage);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  return (
    <div className={`toast-notification ${toast.type || "success"}`}>
      <div>{toast.message}</div>
    </div>
  );
}
