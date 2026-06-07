export const toRadians = (value) => (value * Math.PI) / 180;

export const getDistanceHaversine = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const calculateEta = (distanceKm, speedKmH = 42) => {
  if (!distanceKm || distanceKm <= 0) return 2;
  const minutes = Math.ceil((distanceKm / speedKmH) * 60);
  return Math.max(2, minutes);
};
