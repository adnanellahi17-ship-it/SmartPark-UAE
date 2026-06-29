import type { AvailabilityStatus, ForecastContext, ParkingZone } from "../data/parking";

export type ZoneForecast = {
  zone: ParkingZone;
  demandIndex: number;
  predictedOccupancy: number;
  predictedAvailable: number;
  confidence: number;
  status: AvailabilityStatus;
  recommendationScore: number;
};

const eventPressureWeight: Record<ForecastContext["eventPressure"], number> = {
  low: 0.03,
  medium: 0.11,
  high: 0.2,
};

const weatherWeight: Record<ForecastContext["weather"], number> = {
  clear: 0.02,
  hot: 0.1,
  rain: 0.08,
  dust: 0.12,
};

const dayTypeWeight: Record<ForecastContext["dayType"], number> = {
  weekday: 0.04,
  weekend: 0.12,
};

export function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function getAvailabilityStatus(available: number): AvailabilityStatus {
  if (available <= 0) return "full";
  if (available < 10) return "low";
  if (available < 50) return "medium";
  return "high";
}

export function forecastParkingZone(zone: ParkingZone, context: ForecastContext): ZoneForecast {
  const currentOccupancy = clamp((zone.capacity - zone.available) / zone.capacity);
  const historicAverage = clamp(average(zone.historicOccupancy));
  const peakPressure = zone.peakHours.includes(context.hour) ? 0.18 : 0.04;
  const eventPressure = eventPressureWeight[context.eventPressure];
  const weatherPressure = weatherWeight[context.weather];
  const dayPressure = dayTypeWeight[context.dayType];

  const demandIndex = clamp(
    currentOccupancy * 0.32 +
      historicAverage * 0.22 +
      zone.baseDemand * 0.16 +
      peakPressure * 0.12 +
      eventPressure * 0.1 +
      weatherPressure * 0.04 +
      dayPressure * 0.04,
  );

  const predictedOccupancy = clamp(currentOccupancy * 0.42 + demandIndex * 0.58);
  const predictedAvailable = Math.max(0, Math.round(zone.capacity * (1 - predictedOccupancy)));
  const confidence = clamp(
    0.68 +
      Math.min(zone.historicOccupancy.length, 7) * 0.025 -
      (context.eventPressure === "high" ? 0.04 : 0) -
      (context.weather === "dust" ? 0.03 : 0),
    0.58,
    0.91,
  );

  const priceValue = 1 - clamp((zone.priceAED - 6) / 16);
  const proximityValue = 1 - clamp(zone.walkingMinutes / 14);
  const availabilityValue = clamp(predictedAvailable / 70);
  const amenityValue = clamp(zone.amenities.length / 4);
  const recommendationScore = clamp(
    availabilityValue * 0.38 +
      proximityValue * 0.22 +
      priceValue * 0.16 +
      confidence * 0.14 +
      amenityValue * 0.1 -
      demandIndex * 0.1,
  );

  return {
    zone,
    demandIndex,
    predictedOccupancy,
    predictedAvailable,
    confidence,
    status: getAvailabilityStatus(predictedAvailable),
    recommendationScore,
  };
}

export function forecastAllZones(zones: ParkingZone[], context: ForecastContext) {
  return zones.map((zone) => forecastParkingZone(zone, context));
}

export function rankParkingZones(zones: ParkingZone[], context: ForecastContext) {
  return forecastAllZones(zones, context).sort(
    (a, b) => b.recommendationScore - a.recommendationScore,
  );
}

export function getOverallDemandLabel(demandIndex: number) {
  if (demandIndex >= 0.72) return "Very high demand";
  if (demandIndex >= 0.58) return "High demand";
  if (demandIndex >= 0.42) return "Moderate demand";
  return "Low demand";
}

export function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}
