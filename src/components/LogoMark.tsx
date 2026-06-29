import { MapPinned } from "lucide-react";

type LogoMarkProps = {
  compact?: boolean;
};

export function LogoMark({ compact = false }: LogoMarkProps) {
  return (
    <div className="brand-lockup" aria-label="SmartPark UAE">
      <span className="brand-mark" aria-hidden="true">
        <MapPinned size={compact ? 24 : 30} strokeWidth={2.4} />
      </span>
      {!compact && (
        <span className="brand-name">
          SmartPark <strong>UAE</strong>
        </span>
      )}
    </div>
  );
}
