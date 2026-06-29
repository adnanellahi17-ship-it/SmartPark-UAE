import { TrendingUp } from "lucide-react";
import { formatPercent, getOverallDemandLabel } from "../lib/prediction";

type PredictionCardProps = {
  averageDemand: number;
  confidence: number;
};

export function PredictionCard({ averageDemand, confidence }: PredictionCardProps) {
  const label = getOverallDemandLabel(averageDemand);

  return (
    <section className="prediction-card" aria-label="AI demand prediction">
      <div className="prediction-icon" aria-hidden="true">
        <TrendingUp size={25} />
      </div>
      <div className="prediction-main">
        <span>AI Demand Prediction</span>
        <strong>Next 30 min</strong>
      </div>
      <div className="prediction-detail">
        <strong>{label}</strong>
        <span>{formatPercent(confidence)} confidence</span>
      </div>
      <svg className="sparkline" viewBox="0 0 112 44" role="img" aria-label="Demand trend line">
        <path
          d="M4 34 C14 34, 16 24, 26 25 S40 24, 48 17 S60 35, 69 22 S80 20, 88 27 S101 14, 108 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M4 34 C14 34, 16 24, 26 25 S40 24, 48 17 S60 35, 69 22 S80 20, 88 27 S101 14, 108 14 L108 42 L4 42 Z"
          fill="currentColor"
          opacity="0.12"
        />
      </svg>
    </section>
  );
}
