import { Car, ChevronRight, Footprints, Navigation, ShieldCheck, Zap } from "lucide-react";
import { useState } from "react";
import type { ZoneForecast } from "../lib/prediction";
import { formatPercent } from "../lib/prediction";
import { StatusBadge } from "./StatusBadge";

type ParkingListProps = {
  forecasts: ZoneForecast[];
  selectedId: string;
  onSelect: (zoneId: string) => void;
  onReserve: (zoneId: string) => void;
  onRoute: (zoneId: string) => void;
};

function AmenityIcon({ amenity }: { amenity: string }) {
  if (amenity.toLowerCase().includes("ev")) return <Zap size={14} aria-hidden="true" />;
  return <ShieldCheck size={14} aria-hidden="true" />;
}

export function ParkingList({ forecasts, selectedId, onSelect, onReserve, onRoute }: ParkingListProps) {
  const [showAll, setShowAll] = useState(false);
  const visibleForecasts = showAll ? forecasts : forecasts.slice(0, 4);

  return (
    <section className="parking-section" aria-label="Nearby parking">
      <div className="section-title-row">
        <h2>Nearby Parking</h2>
        <button className="text-button" type="button" onClick={() => setShowAll((current) => !current)}>
          {showAll ? "Show less" : "See all"} <ChevronRight size={17} />
        </button>
      </div>

      <div className="parking-list">
        {visibleForecasts.map((forecast) => {
          const isSelected = forecast.zone.id === selectedId;

          return (
            <article className={`parking-card ${isSelected ? "is-selected" : ""}`} key={forecast.zone.id}>
              <button
                className="parking-card-main"
                type="button"
                onClick={() => onSelect(forecast.zone.id)}
                aria-label={`Select ${forecast.zone.name}`}
              >
                <span className={`zone-code zone-${forecast.status}`}>{forecast.zone.code}</span>
                <span className="parking-copy">
                  <strong>{forecast.zone.name}</strong>
                  <span>
                    {forecast.zone.street} · {forecast.zone.district}
                  </span>
                  <span className="parking-meta">
                    <Footprints size={15} /> {forecast.zone.walkingMinutes} min
                    <i aria-hidden="true" />
                    <Car size={15} /> {forecast.zone.distanceKm.toFixed(1)} km
                  </span>
                </span>
                <span className="parking-availability">
                  <strong>{forecast.predictedAvailable}</strong>
                  <span>spots</span>
                </span>
                <span className="parking-price">
                  <strong>AED {forecast.zone.priceAED}</strong>
                  <span>per hour</span>
                </span>
                <ChevronRight className="row-chevron" size={20} aria-hidden="true" />
              </button>

              <div className="parking-card-foot">
                <StatusBadge status={forecast.status} />
                <span className="confidence-label">{formatPercent(forecast.confidence)} confidence</span>
                <span className="amenity-list">
                  {forecast.zone.amenities.slice(0, 2).map((amenity) => (
                    <span key={amenity}>
                      <AmenityIcon amenity={amenity} /> {amenity}
                    </span>
                  ))}
                </span>
                {isSelected && (
                  <div className="parking-actions">
                    <button className="secondary-button" type="button" onClick={() => onRoute(forecast.zone.id)}>
                      <Navigation size={17} /> Route
                    </button>
                    <button
                      className="primary-button"
                      type="button"
                      aria-label={`Book ${forecast.zone.name}`}
                      onClick={() => onReserve(forecast.zone.id)}
                    >
                      Book
                    </button>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
