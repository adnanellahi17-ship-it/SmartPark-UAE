import { CalendarCheck, Car, CheckCircle2, Clock3, CreditCard, MapPin, X } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useId, useState } from "react";
import type { ZoneForecast } from "../lib/prediction";

type BookingSheetProps = {
  forecast: ZoneForecast | undefined;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (details: { vehiclePlate: string; durationHours: number; paymentMethod: string }) => void;
};

const paymentMethods = ["Apple Pay", "Visa **** 4242", "Dubai Pay"];

export function BookingSheet({ forecast, isOpen, onClose, onConfirm }: BookingSheetProps) {
  const plateId = useId();
  const [vehiclePlate, setVehiclePlate] = useState("D 48215");
  const [duration, setDuration] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setSubmitted(false);
    setDuration(1);
    setPaymentMethod(paymentMethods[0]);
  }, [forecast?.zone.id, isOpen]);

  if (!isOpen || !forecast) return null;

  const parkingFee = forecast.zone.priceAED * duration;
  const serviceFee = 2.5;
  const total = parkingFee + serviceFee;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (vehiclePlate.trim().length < 3) return;
    onConfirm({
      vehiclePlate: vehiclePlate.trim().toUpperCase(),
      durationHours: duration,
      paymentMethod,
    });
    setSubmitted(true);
  }

  return (
    <div className="sheet-backdrop" role="presentation">
      <section className="booking-sheet" role="dialog" aria-modal="true" aria-labelledby="booking-title">
        <div className="sheet-handle" aria-hidden="true" />
        <button className="icon-button sheet-close" type="button" aria-label="Close reservation" onClick={onClose}>
          <X size={20} />
        </button>

        {submitted ? (
          <div className="booking-success" role="status">
            <CheckCircle2 size={42} />
            <h2>Reservation Confirmed</h2>
            <p>
              Your spot request for {forecast.zone.name} is saved for the next 30 minutes.
            </p>
            <button className="primary-button wide-button" type="button" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <span className="sheet-icon" aria-hidden="true">
              <CalendarCheck size={24} />
            </span>
            <h2 id="booking-title">Confirm Reservation</h2>
            <div className="reservation-location-card">
              <span>
                <MapPin size={17} /> Selected location
              </span>
              <strong>{forecast.zone.name}</strong>
              <small>
                Zone {forecast.zone.code} · {forecast.zone.district} · {forecast.zone.zoneType}
              </small>
            </div>
            <form className="booking-form" onSubmit={handleSubmit}>
              <div className="reservation-field-grid">
                <label htmlFor={plateId}>
                  <span>
                    <Car size={16} /> Vehicle plate
                  </span>
                  <input
                    id={plateId}
                    aria-label="Vehicle plate number"
                    value={vehiclePlate}
                    onChange={(event) => setVehiclePlate(event.target.value)}
                    minLength={3}
                    autoComplete="off"
                  />
                </label>
              </div>

              <fieldset className="payment-picker">
                <legend>
                  <CreditCard size={16} /> Payment method
                </legend>
                {paymentMethods.map((method) => (
                  <button
                    className={paymentMethod === method ? "is-active" : ""}
                    key={method}
                    type="button"
                    aria-pressed={paymentMethod === method}
                    onClick={() => setPaymentMethod(method)}
                  >
                    <span>{method}</span>
                    {paymentMethod === method && <CheckCircle2 size={17} aria-hidden="true" />}
                  </button>
                ))}
              </fieldset>

              <fieldset className="duration-picker">
                <legend>
                  <Clock3 size={16} /> Duration
                  <span>AED {forecast.zone.priceAED.toFixed(2)} / hr</span>
                </legend>
                {[1, 2, 4].map((hours) => (
                  <button
                    className={duration === hours ? "is-active" : ""}
                    key={hours}
                    type="button"
                    onClick={() => setDuration(hours)}
                  >
                    {hours}h
                  </button>
                ))}
              </fieldset>

              <dl className="price-breakdown">
                <div>
                  <dt>Parking Fee</dt>
                  <dd>AED {parkingFee.toFixed(2)}</dd>
                </div>
                <div>
                  <dt>Convenience Fee</dt>
                  <dd>AED {serviceFee.toFixed(2)}</dd>
                </div>
                <div>
                  <dt>Total Price</dt>
                  <dd>AED {total.toFixed(2)}</dd>
                </div>
              </dl>

              <p className="helper-text">Prototype booking only. No payment or real parking space is reserved.</p>
              <button className="primary-button wide-button" type="submit" aria-label="Confirm Reservation">
                Confirm &amp; Pay
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
