import { useEffect, useMemo, useRef, useState } from "react";
import { AppHeader } from "./components/AppHeader";
import { BookingSheet } from "./components/BookingSheet";
import type { Booking } from "./components/BookingsView";
import { BookingsView } from "./components/BookingsView";
import { BottomNavigation } from "./components/BottomNavigation";
import type { AppTab } from "./components/BottomNavigation";
import { MapPanel } from "./components/MapPanel";
import { OfferBanner } from "./components/OfferBanner";
import { ParkingList } from "./components/ParkingList";
import { PredictionCard } from "./components/PredictionCard";
import { PredictView } from "./components/PredictView";
import { ProfileView } from "./components/ProfileView";
import { SearchControls } from "./components/SearchControls";
import type { QuickFilter } from "./components/SearchControls";
import { SelectedZonePanel } from "./components/SelectedZonePanel";
import { defaultContext, parkingZones } from "./data/parking";
import type { ForecastContext } from "./data/parking";
import { average, forecastAllZones, rankParkingZones } from "./lib/prediction";

function createBookingId() {
  return `booking-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

function zoneMatchesQuery(forecast: ReturnType<typeof forecastAllZones>[number], query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  return [
    forecast.zone.name,
    forecast.zone.district,
    forecast.zone.street,
    forecast.zone.code,
    forecast.zone.paymentCode,
    forecast.zone.zoneType,
    ...forecast.zone.areaKeywords,
  ]
    .join(" ")
    .toLowerCase()
    .includes(normalizedQuery);
}

export default function App() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<AppTab>("map");
  const [query, setQuery] = useState("");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("available");
  const [context, setContext] = useState<ForecastContext>(defaultContext);
  const [selectedZoneId, setSelectedZoneId] = useState("marina-beach-392ap");
  const [bookingZoneId, setBookingZoneId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [toast, setToast] = useState("");

  const forecasts = useMemo(() => rankParkingZones(parkingZones, context), [context]);
  const mapForecasts = useMemo(() => forecastAllZones(parkingZones, context), [context]);
  const selectedForecast = useMemo(
    () => mapForecasts.find((forecast) => forecast.zone.id === selectedZoneId) ?? mapForecasts[0],
    [mapForecasts, selectedZoneId],
  );
  const bookingForecast = useMemo(
    () => mapForecasts.find((forecast) => forecast.zone.id === bookingZoneId),
    [bookingZoneId, mapForecasts],
  );

  const filteredForecasts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const searchMatches = forecasts.filter((forecast) => zoneMatchesQuery(forecast, normalizedQuery));

    if (quickFilter === "nearMe") {
      return [...searchMatches].sort((a, b) => a.zone.walkingMinutes - b.zone.walkingMinutes);
    }

    if (quickFilter === "lowCost") {
      return [...searchMatches].sort((a, b) => a.zone.priceAED - b.zone.priceAED);
    }

    return [...searchMatches].sort((a, b) => b.predictedAvailable - a.predictedAvailable);
  }, [forecasts, query, quickFilter]);

  const averageDemand = average(mapForecasts.map((forecast) => forecast.demandIndex));
  const averageConfidence = average(mapForecasts.map((forecast) => forecast.confidence));

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    if (typeof content.scrollTo === "function") {
      content.scrollTo({ top: 0 });
      return;
    }

    content.scrollTop = 0;
  }, [activeTab]);

  useEffect(() => {
    if (!toast) return;

    const timeoutId = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  useEffect(() => {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) return;

    const firstMatch = mapForecasts.find((forecast) => zoneMatchesQuery(forecast, normalizedQuery));
    if (firstMatch && firstMatch.zone.id !== selectedZoneId) {
      setSelectedZoneId(firstMatch.zone.id);
    }
  }, [mapForecasts, query, selectedZoneId]);

  function updateContext<Key extends keyof ForecastContext>(key: Key, value: ForecastContext[Key]) {
    setContext((current) => ({ ...current, [key]: value }));
  }

  function handleSelectZone(zoneId: string) {
    setSelectedZoneId(zoneId);
    setActiveTab("map");
  }

  function handleConfirmBooking(details: {
    vehiclePlate: string;
    durationHours: number;
    paymentMethod: string;
  }) {
    if (!bookingForecast) return;

    setBookings((current) => [
      {
        id: createBookingId(),
        zoneName: bookingForecast.zone.name,
        zoneCode: bookingForecast.zone.code,
        vehiclePlate: details.vehiclePlate,
        durationHours: details.durationHours,
        paymentMethod: details.paymentMethod,
        priceAED: bookingForecast.zone.priceAED,
        expiresAt: "10:12 AM",
      },
      ...current,
    ]);
    setToast(`Reservation saved for ${bookingForecast.zone.name} with ${details.paymentMethod}.`);
  }

  function handleFilterChange(filter: QuickFilter) {
    setQuickFilter(filter);
    const label = filter === "nearMe" ? "nearest" : filter === "lowCost" ? "lowest cost" : "most available";
    setToast(`Showing ${label} parking zones.`);
  }

  function handleLocateNearest() {
    const nearest = [...mapForecasts].sort((a, b) => a.zone.walkingMinutes - b.zone.walkingMinutes)[0];
    if (!nearest) return;

    setSelectedZoneId(nearest.zone.id);
    setQuickFilter("nearMe");
    setToast(`${nearest.zone.name} is the closest demo zone.`);
  }

  function handleRoute(zoneId = selectedZoneId) {
    const forecast = mapForecasts.find((item) => item.zone.id === zoneId);
    if (!forecast) return;

    setSelectedZoneId(zoneId);
    setToast(`Demo route ready: ${forecast.zone.walkingMinutes} min walk to ${forecast.zone.name}.`);
  }

  function handleSearchShortcut() {
    setActiveTab("map");
    setToast("Search is ready.");
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
    });
  }

  return (
    <div className="app-page">
      <a className="skip-link" href="#main-content">
        Skip to app content
      </a>
      <div className="app-layout">
        <main className="phone-shell" id="main-content">
          <AppHeader
            onMenuClick={() => setToast("Menu demo: account, vehicles, and settings would open here.")}
            onSearchClick={handleSearchShortcut}
          />

          <div className="phone-content" ref={contentRef}>
            {activeTab === "map" && (
              <section className="tab-view map-view" aria-label="Map dashboard">
                <SearchControls
                  query={query}
                  onQueryChange={setQuery}
                  location={context.location}
                  activeFilter={quickFilter}
                  onFilterChange={handleFilterChange}
                  onLocationClick={() => setToast("Location selector demo: Dubai Marina is active.")}
                />
                <MapPanel
                  forecasts={mapForecasts}
                  selectedId={selectedZoneId}
                  onSelect={setSelectedZoneId}
                  onLocate={handleLocateNearest}
                />
                <SelectedZonePanel forecast={selectedForecast} onReserve={setBookingZoneId} onRoute={handleRoute} />
                <PredictionCard averageDemand={averageDemand} confidence={averageConfidence} />
                <ParkingList
                  forecasts={filteredForecasts}
                  selectedId={selectedZoneId}
                  onSelect={setSelectedZoneId}
                  onReserve={setBookingZoneId}
                  onRoute={handleRoute}
                />
                <OfferBanner />
              </section>
            )}

            {activeTab === "predict" && (
              <PredictView
                context={context}
                forecasts={forecasts}
                onContextChange={updateContext}
                onSelect={handleSelectZone}
              />
            )}

            {activeTab === "bookings" && (
              <BookingsView bookings={bookings} onOpenZone={handleSelectZone} onNotify={setToast} />
            )}
            {activeTab === "profile" && <ProfileView />}
          </div>

          <BottomNavigation activeTab={activeTab} onChange={setActiveTab} />
        </main>

      </div>

      <BookingSheet
        forecast={bookingForecast}
        isOpen={bookingZoneId !== null}
        onClose={() => setBookingZoneId(null)}
        onConfirm={handleConfirmBooking}
      />

      <div className="toast-region" aria-live="polite" aria-atomic="true">
        {toast && <span>{toast}</span>}
      </div>
    </div>
  );
}
