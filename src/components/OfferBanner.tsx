import { Tag } from "lucide-react";

export function OfferBanner() {
  return (
    <aside className="offer-banner" aria-label="Weekend parking offer">
      <span className="offer-icon" aria-hidden="true">
        <Tag size={21} />
      </span>
      <span>
        <strong>Weekend Offer</strong>
        <small>15% off when you reserve before 11:00 AM</small>
      </span>
      <strong className="offer-pill">15% OFF</strong>
    </aside>
  );
}
