import { describe, expect, it } from "vitest";
import { defaultContext, parkingZones } from "../data/parking";
import {
  forecastParkingZone,
  getAvailabilityStatus,
  rankParkingZones,
} from "./prediction";

describe("parking prediction model", () => {
  it("classifies availability using the project thresholds", () => {
    expect(getAvailabilityStatus(0)).toBe("full");
    expect(getAvailabilityStatus(5)).toBe("low");
    expect(getAvailabilityStatus(25)).toBe("medium");
    expect(getAvailabilityStatus(72)).toBe("high");
  });

  it("predicts fewer spaces when event pressure is high", () => {
    const zone = parkingZones.find((item) => item.id === "marina-walk-central");
    expect(zone).toBeDefined();

    const lowPressure = forecastParkingZone(zone!, {
      ...defaultContext,
      eventPressure: "low",
    });
    const highPressure = forecastParkingZone(zone!, {
      ...defaultContext,
      eventPressure: "high",
    });

    expect(highPressure.predictedAvailable).toBeLessThanOrEqual(lowPressure.predictedAvailable);
    expect(highPressure.demandIndex).toBeGreaterThan(lowPressure.demandIndex);
  });

  it("returns recommendations sorted by score", () => {
    const ranked = rankParkingZones(parkingZones, defaultContext);

    expect(ranked).toHaveLength(parkingZones.length);
    for (let index = 1; index < ranked.length; index += 1) {
      expect(ranked[index - 1].recommendationScore).toBeGreaterThanOrEqual(
        ranked[index].recommendationScore,
      );
    }
  });
});
