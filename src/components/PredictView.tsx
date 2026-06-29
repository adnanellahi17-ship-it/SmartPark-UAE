import { CalendarDays, Clock3, CloudSun, Map, ShieldCheck, SlidersHorizontal, Trophy, Zap } from "lucide-react";
import type { ForecastContext } from "../data/parking";
import type { ZoneForecast } from "../lib/prediction";
import { formatPercent } from "../lib/prediction";
import { StatusBadge } from "./StatusBadge";

type PredictViewProps = {
  context: ForecastContext;
  forecasts: ZoneForecast[];
  onContextChange: <Key extends keyof ForecastContext>(key: Key, value: ForecastContext[Key]) => void;
  onSelect: (zoneId: string) => void;
};

const hours = [
  { label: "9 AM", value: 9 },
  { label: "12 PM", value: 12 },
  { label: "6 PM", value: 18 },
  { label: "9 PM", value: 21 },
];

export function PredictView({ context, forecasts, onContextChange, onSelect }: PredictViewProps) {
  const best = forecasts[0];
  const chartValues = best.zone.historicOccupancy;

  return (
    <section className="tab-view predict-view" aria-label="Prediction simulator">
      <div className="view-heading">
        <span className="view-icon" aria-hidden="true">
          <SlidersHorizontal size={23} />
        </span>
        <div>
          <h1>AI Prediction</h1>
          <p>Next 30-minute demand, confidence, event pressure, and ranked parking choices.</p>
        </div>
      </div>

      <div className="prediction-stat-grid">
        <article>
          <ShieldCheck size={17} />
          <span>Prediction confidence</span>
          <strong>{formatPercent(best.confidence)}</strong>
        </article>
        <article>
          <CloudSun size={17} />
          <span>Current weather</span>
          <strong>{context.weather === "hot" ? "32°C" : context.weather}</strong>
        </article>
        <article className={`pressure-${context.eventPressure}`}>
          <Zap size={17} />
          <span>Event pressure</span>
          <strong>{context.eventPressure}</strong>
        </article>
      </div>

      <article className="event-pressure-card">
        <span>Event pressure: {context.eventPressure}</span>
        <h2>Dubai Marina evening traffic</h2>
        <p>Expect demand to rise near waterfront dining and JBR access roads during the next hour.</p>
      </article>

      <article className="forecast-chart-card" aria-label="Demand forecast chart">
        <div className="chart-title-row">
          <h2>Demand Forecast</h2>
          <span>Predicted</span>
        </div>
        <div className="bar-chart" aria-hidden="true">
          {chartValues.map((value, index) => (
            <i
              className={index === 4 ? "is-peak" : ""}
              key={`${value}-${index}`}
              style={{ height: `${Math.max(28, value * 112)}px` }}
            />
          ))}
        </div>
        <div className="chart-axis" aria-hidden="true">
          <span>18:00</span>
          <span>18:15</span>
          <span>18:30</span>
          <span>18:45</span>
          <span>19:00</span>
        </div>
      </article>

      <article className="best-match-card">
        <span>Best recommendation</span>
        <h2>{best.zone.name}</h2>
        <p>
          {best.predictedAvailable} predicted spots with {formatPercent(best.confidence)} confidence.
        </p>
        <button className="primary-button" type="button" onClick={() => onSelect(best.zone.id)}>
          <Map size={17} /> View on map
        </button>
      </article>

      <div className="forecast-table" aria-label="Ranked parking recommendations">
        {forecasts.map((forecast, index) => (
          <button
            className="forecast-row"
            key={forecast.zone.id}
            type="button"
            onClick={() => onSelect(forecast.zone.id)}
          >
            <span className="rank-number">{index + 1}</span>
            <span>
              <strong>{forecast.zone.name}</strong>
              <small>
                {forecast.zone.walkingMinutes} min walk · AED {forecast.zone.priceAED}/hr
              </small>
            </span>
            <span className="forecast-spots">{forecast.predictedAvailable}</span>
            <StatusBadge status={forecast.status} />
          </button>
        ))}
      </div>

      <div className="control-panel">
        <div className="control-panel-header">
          <strong>Scenario controls</strong>
          <span>Recalculate live demand</span>
        </div>
        <fieldset>
          <legend>
            <Clock3 size={17} /> Time
          </legend>
          <div className="segmented-control">
            {hours.map((hour) => (
              <button
                className={context.hour === hour.value ? "is-active" : ""}
                key={hour.value}
                type="button"
                onClick={() => onContextChange("hour", hour.value)}
              >
                {hour.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <Trophy size={17} /> Event pressure
          </legend>
          <div className="segmented-control">
            {(["low", "medium", "high"] as const).map((value) => (
              <button
                className={context.eventPressure === value ? "is-active" : ""}
                key={value}
                type="button"
                onClick={() => onContextChange("eventPressure", value)}
              >
                {value}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="two-column-controls">
          <label>
            <span>
              <CloudSun size={17} /> Weather
            </span>
            <select
              value={context.weather}
              onChange={(event) =>
                onContextChange("weather", event.target.value as ForecastContext["weather"])
              }
            >
              <option value="clear">Clear</option>
              <option value="hot">Hot</option>
              <option value="rain">Rain</option>
              <option value="dust">Dust</option>
            </select>
          </label>
          <label>
            <span>
              <CalendarDays size={17} /> Day type
            </span>
            <select
              value={context.dayType}
              onChange={(event) =>
                onContextChange("dayType", event.target.value as ForecastContext["dayType"])
              }
            >
              <option value="weekday">Weekday</option>
              <option value="weekend">Weekend</option>
            </select>
          </label>
        </div>
      </div>
    </section>
  );
}
