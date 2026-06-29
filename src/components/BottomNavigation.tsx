import { BarChart3, CalendarCheck, MapPinned, UserRound } from "lucide-react";

export type AppTab = "map" | "predict" | "bookings" | "profile";

type NavItem = {
  id: AppTab;
  label: string;
  ariaLabel: string;
  icon: typeof MapPinned;
};

const navItems: NavItem[] = [
  { id: "map", label: "Home", ariaLabel: "Map", icon: MapPinned },
  { id: "predict", label: "Predictions", ariaLabel: "Predict", icon: BarChart3 },
  { id: "bookings", label: "Bookings", ariaLabel: "Bookings", icon: CalendarCheck },
  { id: "profile", label: "Profile", ariaLabel: "Profile", icon: UserRound },
];

type BottomNavigationProps = {
  activeTab: AppTab;
  onChange: (tab: AppTab) => void;
};

export function BottomNavigation({ activeTab, onChange }: BottomNavigationProps) {
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.id === activeTab;

        return (
          <button
            className={`bottom-nav-item ${isActive ? "is-active" : ""}`}
            type="button"
            key={item.id}
            aria-label={item.ariaLabel}
            aria-current={isActive ? "page" : undefined}
            onClick={() => onChange(item.id)}
          >
            <Icon size={24} strokeWidth={isActive ? 2.6 : 2.1} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
