import { ArrowRight, Building2, Clock3, Footprints, Navigation } from "lucide-react";
import type { ZoneForecast } from "../lib/prediction";
import { formatPercent } from "../lib/prediction";
import { StatusBadge } from "./StatusBadge";

type SelectedZonePanelProps = {
  forecast: ZoneForecast;
  onReserve: (zoneId: string) => void;
  onRoute: (zoneId: string) => void;
};

export function SelectedZonePanel({ forecast, onReserve, onRoute }: SelectedZonePanelProps) {
  return (
    <section className="selected-zone-panel" aria-label="Selected parking zone">
      <div className="selected-zone-topline">
        <StatusBadge status={forecast.status} />
        <strong>Zone {forecast.zone.code}</strong>
        <span>AED {forecast.zone.priceAED}/hour</span>
      </div>

      <div className="selected-zone-main">
        <div>
          <h2>{forecast.zone.name}</h2>
          <p>{forecast.zone.street}</p>
        </div>
        <strong className="selected-zone-count">{forecast.predictedAvailable}</strong>
      </div>

      <dl className="selected-zone-metrics">
        <div>
          <dt>
            <Footprints size={15} /> Walk
          </dt>
          <dd>{forecast.zone.walkingMinutes} min</dd>
        </div>
        <div>
          <dt>
            <Clock3 size={15} /> Max
          </dt>
          <dd>4 hours</dd>
        </div>
        <div>
          <dt>
            <Building2 size={15} /> Type
          </dt>
          <dd>{forecast.zone.zoneType}</dd>
        </div>
      </dl>

      <div className="selected-zone-actions">
        <button className="secondary-button" type="button" onClick={() => onRoute(forecast.zone.id)}>
          <Navigation size={17} /> Route
        </button>
        <button
          className="primary-button"
          type="button"
          aria-label="Reserve"
          onClick={() => onReserve(forecast.zone.id)}
        >
          Reserve Now <ArrowRight size={17} />
        </button>
      </div>

      <p className="selected-zone-confidence">{formatPercent(forecast.confidence)} prediction confidence</p>
    </section>
  );
}
