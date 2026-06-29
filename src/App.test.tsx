import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { BookingsView } from "./components/BookingsView";

afterEach(() => {
  vi.useRealTimers();
});

describe("SmartPark UAE app", () => {
  it("renders the core map dashboard", () => {
    render(<App />);

    expect(screen.getByLabelText("SmartPark UAE")).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: /search parking areas/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/parking availability map/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Demand Prediction/i)).toBeInTheDocument();
    expect(screen.getByText(/Nearby Parking/i)).toBeInTheDocument();
  });

  it("filters parking areas by search text", () => {
    render(<App />);

    fireEvent.change(screen.getByRole("searchbox", { name: /search parking areas/i }), {
      target: { value: "233C" },
    });

    expect(screen.getAllByText(/Al Qusais Second On-street/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Downtown Boulevard On-street/i)).not.toBeInTheDocument();
  });

  it("creates a prototype reservation", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /^Reserve$/i }));
    fireEvent.change(screen.getByLabelText(/vehicle plate number/i), {
      target: { value: "DXB 115" },
    });
    fireEvent.click(screen.getByRole("button", { name: /confirm reservation/i }));

    expect(screen.getByText(/Reservation Confirmed/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /done/i }));

    fireEvent.click(screen.getByRole("button", { name: /Bookings/i }));
    const bookings = screen.getByLabelText(/Bookings view/i);
    expect(within(bookings).getByText(/Marsa Dubai On-street Parking/i)).toBeInTheDocument();
    expect(within(bookings).getByText(/DXB 115/i)).toBeInTheDocument();
  });

  it("updates prediction context from the Predict tab", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /^Predict$/i }));
    fireEvent.click(screen.getByRole("button", { name: /9 PM/i }));
    fireEvent.click(screen.getByRole("button", { name: /^high$/i }));

    expect(screen.getByText(/Best recommendation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ranked parking recommendations/i)).toBeInTheDocument();
  });

  it("counts down the active reservation timer", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-24T08:00:00Z"));

    render(<BookingsView bookings={[]} onOpenZone={() => undefined} onNotify={() => undefined} />);

    expect(screen.getByLabelText(/Time remaining 44:57/i)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByLabelText(/Time remaining 44:54/i)).toBeInTheDocument();
  });
});
