import { getDistanceHaversine, calculateEta } from "./distanceCalculator";

const moveTowards = (from, to, fraction) => {
  return {
    lat: from.lat + (to.lat - from.lat) * fraction,
    lng: from.lng + (to.lng - from.lng) * fraction,
  };
};

export const createLocationSimulator = ({
  ambulance,
  userLocation,
  hospitalLocation,
  speedKmH = 45,
}) => {
  let currentLocation = { ...ambulance };
  let stage = 0;
  const routeTargets = [userLocation, hospitalLocation];

  const getTarget = () => routeTargets[Math.min(stage, routeTargets.length - 1)];

  const step = () => {
    const target = getTarget();
    const distanceToTarget = getDistanceHaversine(
      currentLocation.lat,
      currentLocation.lng,
      target.lat,
      target.lng
    );
    if (distanceToTarget < 0.06) {
      if (stage < routeTargets.length - 1) {
        stage += 1;
      }
      return { ...currentLocation };
    }

    const stepDistanceKm = (speedKmH * 2) / 3600;
    const fraction = Math.min(1, stepDistanceKm / distanceToTarget);
    currentLocation = moveTowards(currentLocation, target, fraction);
    return { ...currentLocation };
  };

  return {
    getCurrentLocation: () => ({ ...currentLocation }),
    getTarget,
    step,
    getRouteCoordinates: () => [currentLocation, userLocation, hospitalLocation],
    getEta: () => calculateEta(
      getDistanceHaversine(
        currentLocation.lat,
        currentLocation.lng,
        getTarget().lat,
        getTarget().lng
      ),
      speedKmH
    ),
    getStage: () => stage,
  };
};
