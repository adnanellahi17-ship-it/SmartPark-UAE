import { BarChart3, FileText, MapPinned, ShieldCheck } from "lucide-react";
import type { ZoneForecast } from "../lib/prediction";
import { formatPercent } from "../lib/prediction";

type DesktopInsightsProps = {
  selectedForecast: ZoneForecast;
  averageDemand: number;
};

export function DesktopInsights({ selectedForecast, averageDemand }: DesktopInsightsProps) {
  return (
    <aside className="desktop-insights" aria-label="Project summary">
      <div className="insight-header">
        <span className="view-icon" aria-hidden="true">
          <MapPinned size={23} />
        </span>
        <div>
          <h2>SmartPark UAE</h2>
          <p>Working local prototype for UAE smart city parking.</p>
        </div>
      </div>

      <article>
        <BarChart3 size={22} />
        <div>
          <strong>AI model output</strong>
          <p>
            {selectedForecast.zone.name} is showing {selectedForecast.predictedAvailable} predicted
            spaces with {formatPercent(selectedForecast.confidence)} confidence.
          </p>
        </div>
      </article>

      <article>
        <ShieldCheck size={22} />
        <div>
          <strong>Design checks</strong>
          <p>Mobile-first layout, 44px touch targets, visible focus states, and no emoji icons.</p>
        </div>
      </article>

      <article>
        <FileText size={22} />
        <div>
          <strong>Report included</strong>
          <p>The generated report explains the problem, model, testing, and future improvements.</p>
        </div>
      </article>

      <div className="demand-meter">
        <span>City demand</span>
        <strong>{formatPercent(averageDemand)}</strong>
        <i>
          <b style={{ width: `${Math.round(averageDemand * 100)}%` }} />
        </i>
      </div>
    </aside>
  );
}
