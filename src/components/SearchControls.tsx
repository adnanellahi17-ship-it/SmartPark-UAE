import { ChevronDown, Filter, MapPin, Search } from "lucide-react";

export type QuickFilter = "available" | "nearMe" | "lowCost";

type SearchControlsProps = {
  query: string;
  onQueryChange: (value: string) => void;
  location: string;
  activeFilter: QuickFilter;
  onFilterChange: (filter: QuickFilter) => void;
  onLocationClick: () => void;
};

const quickFilters: Array<{ id: QuickFilter; label: string }> = [
  { id: "available", label: "Available" },
  { id: "nearMe", label: "Near Me" },
  { id: "lowCost", label: "Low Cost" },
];

export function SearchControls({
  query,
  onQueryChange,
  location,
  activeFilter,
  onFilterChange,
  onLocationClick,
}: SearchControlsProps) {
  return (
    <section className="search-stack" aria-label="Parking search controls">
      <div className="search-row">
        <button
          className="location-control"
          type="button"
          aria-label={`Selected location ${location}`}
          onClick={onLocationClick}
        >
          <MapPin size={19} />
          <span>{location}</span>
          <ChevronDown size={17} />
        </button>
        <label className="search-control">
          <Search size={19} aria-hidden="true" />
          <span className="sr-only">Search parking areas</span>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Area or code"
            type="search"
          />
        </label>
      </div>
      <div className="filter-chips" aria-label="Quick parking filters">
        <button className="utility-chip" type="button" onClick={() => onFilterChange("available")}>
          <Filter size={15} /> Filter
        </button>
        {quickFilters.map((filter) => (
          <button
            className={activeFilter === filter.id ? "is-active" : ""}
            key={filter.id}
            type="button"
            aria-pressed={activeFilter === filter.id}
            onClick={() => onFilterChange(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </section>
  );
}
