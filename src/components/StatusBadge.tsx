import type { AvailabilityStatus } from "../data/parking";

const statusLabels: Record<AvailabilityStatus, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
  full: "Full",
};

type StatusBadgeProps = {
  status: AvailabilityStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`status-badge status-${status}`}>{statusLabels[status]}</span>;
}
