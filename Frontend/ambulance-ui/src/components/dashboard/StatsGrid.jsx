import StatCard from "./StatCard";

export default function StatsGrid() {
  return (
    <div className="stats-grid">

      <StatCard
        icon="🚑"
        value="250+"
        title="Active Ambulances"
      />

      <StatCard
        icon="🏥"
        value="50+"
        title="Connected Hospitals"
      />

      <StatCard
        icon="⚡"
        value="8 Min"
        title="Average ETA"
      />

      <StatCard
        icon="👨‍⚕️"
        value="24/7"
        title="Emergency Support"
      />

    </div>
  );
}