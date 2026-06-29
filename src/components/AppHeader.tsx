import { Menu, Search } from "lucide-react";

type AppHeaderProps = {
  onMenuClick: () => void;
  onSearchClick: () => void;
};

export function AppHeader({ onMenuClick, onSearchClick }: AppHeaderProps) {
  return (
    <header className="app-header">
      <button className="icon-button" type="button" aria-label="Open menu" onClick={onMenuClick}>
        <Menu size={23} />
      </button>
      <h1 className="app-title" aria-label="SmartPark UAE">
        SmartPark UAE
      </h1>
      <button className="icon-button" type="button" aria-label="Search" onClick={onSearchClick}>
        <Search size={22} />
      </button>
    </header>
  );
}
