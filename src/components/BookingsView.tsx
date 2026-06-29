import { CalendarCheck, Car, Clock3, MapPin, ReceiptText, Star } from "lucide-react";
import { useEffect, useState } from "react";

export type Booking = {
  id: string;
  zoneName: string;
  zoneCode: string;
  vehiclePlate: string;
  durationHours: number;
  paymentMethod: string;
  priceAED: number;
  expiresAt: string;
};

type BookingsViewProps = {
  bookings: Booking[];
  onOpenZone: (zoneId: string) => void;
  onNotify: (message: string) => void;
};

const favoriteZones = [
  { id: "business-bay-341b", code: "341B", district: "Business Bay" },
  { id: "al-qusais-233c", code: "233C", district: "Al Qusais Second" },
  { id: "dubai-marina-324c", code: "324C", district: "Dubai Marina" },
  { id: "mirdif-251c", code: "251C", district: "Mirdif" },
];

const historyRows = [
  ["Zone 112B", "AED 12.00", "Jun 21, 2026 · 2 hours", "#99281"],
  ["Zone 554F", "AED 4.50", "Jun 18, 2026 · 45 mins", "#99142"],
  ["Zone 201D", "AED 30.00", "Jun 15, 2026 · 5 hours", "#98871"],
];

const demoSessionLengthMs = (44 * 60 + 57) * 1000;
const sessionExtensionMs = 15 * 60 * 1000;

function getRemainingMs(expiresAtMs: number) {
  return Math.max(0, expiresAtMs - Date.now());
}

function formatCountdown(milliseconds: number) {
  const totalSeconds = Math.ceil(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function BookingsView({ bookings, onOpenZone, onNotify }: BookingsViewProps) {
  const [sessionExpiresAtMs, setSessionExpiresAtMs] = useState(() => Date.now() + demoSessionLengthMs);
  const [remainingMs, setRemainingMs] = useState(() => getRemainingMs(sessionExpiresAtMs));
  const [showAllFavorites, setShowAllFavorites] = useState(false);
  const [openInvoice, setOpenInvoice] = useState<string | null>(null);
  const visibleFavorites = showAllFavorites ? favoriteZones : favoriteZones.slice(0, 2);
  const countdownLabel = formatCountdown(remainingMs);

  useEffect(() => {
    setRemainingMs(getRemainingMs(sessionExpiresAtMs));

    const intervalId = window.setInterval(() => {
      setRemainingMs(getRemainingMs(sessionExpiresAtMs));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [sessionExpiresAtMs]);

  function extendSession() {
    setSessionExpiresAtMs((current) => Math.max(current, Date.now()) + sessionExtensionMs);
    onNotify("Demo session extended by 15 minutes.");
  }

  return (
    <section className="tab-view" aria-label="Bookings view">
      <div className="view-heading">
        <span className="view-icon" aria-hidden="true">
          <CalendarCheck size={23} />
        </span>
        <div>
          <h1>Bookings</h1>
          <p>Active parking sessions, saved zones, and previous reservations.</p>
        </div>
      </div>

      <article className="active-reservation-card">
        <span>Active reservation</span>
        <div>
          <strong>Zone 324C</strong>
          <b aria-label={`Time remaining ${countdownLabel}`}>{countdownLabel}</b>
        </div>
        <p>
          <MapPin size={15} /> Dubai Marina, Block B
        </p>
        <button className="secondary-button" type="button" onClick={extendSession}>
          Extend session
        </button>
      </article>

      <section className="favorite-zones" aria-label="Favorite zones">
        <div className="section-title-row compact-title-row">
          <h2>Favorite Zones</h2>
          <button className="text-button" type="button" onClick={() => setShowAllFavorites((current) => !current)}>
            {showAllFavorites ? "Show less" : "See all"}
          </button>
        </div>
        <div>
          {visibleFavorites.map((zone) => (
            <button className="favorite-zone-card" key={zone.id} type="button" onClick={() => onOpenZone(zone.id)}>
              <Star size={16} />
              <strong>Zone {zone.code}</strong>
              <span>{zone.district}</span>
            </button>
          ))}
        </div>
      </section>

      {bookings.length > 0 && (
        <div className="booking-list">
          <div className="section-title-row compact-title-row">
            <h2>Prototype Reservations</h2>
          </div>
          {bookings.map((booking) => (
            <article className="booking-card" key={booking.id}>
              <span className="booking-icon" aria-hidden="true">
                <CalendarCheck size={24} />
              </span>
              <div>
                <h2>{booking.zoneName}</h2>
                <p>
                  <Car size={15} /> Plate {booking.vehiclePlate}
                </p>
                <p>
                  <Clock3 size={15} /> Holds until {booking.expiresAt}
                </p>
                <p>
                  <MapPin size={15} /> Zone {booking.zoneCode} · AED {booking.priceAED}/hour
                </p>
                <p>
                  <ReceiptText size={15} /> {booking.durationHours}h · {booking.paymentMethod}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

      <section className="parking-history" aria-label="Parking history">
        <div className="section-title-row compact-title-row">
          <h2>Parking History</h2>
        </div>
        {historyRows.map(([zone, price, date, invoice]) => {
          const isOpen = openInvoice === invoice;

          return (
            <button
              className={`history-row ${isOpen ? "is-open" : ""}`}
              key={invoice}
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenInvoice(isOpen ? null : invoice)}
            >
              <span className="history-thumb" aria-hidden="true">
                <ReceiptText size={18} />
              </span>
              <span className="history-copy">
                <strong>{zone}</strong>
                <p>{date}</p>
                <small>{isOpen ? "Paid by Apple Pay · VAT included" : `Invoice ${invoice}`}</small>
              </span>
              <b>{price}</b>
            </button>
          );
        })}
      </section>
    </section>
  );
}
