import DashboardHeader from "../components/dashboard/DashboardHeader";
import QuickActions from "../components/dashboard/QuickActions";
import StatsGrid from "../components/dashboard/StatsGrid";
import RecentBooking from "../components/dashboard/RecentBooking";
import EmergencyTips from "../components/dashboard/EmergencyTips";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {

  const { user } = useAuth();

  return (
    <div className="dashboard-page">

      <DashboardHeader />

      <QuickActions />

      <StatsGrid />

      {user?.role === "PATIENT" && (
        <RecentBooking />
      )}

      <EmergencyTips />

    </div>
  );
}