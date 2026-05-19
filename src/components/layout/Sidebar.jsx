/**
 * Sidebar.jsx — Portable single-file React component
 *
 * Features:
 *  - Collapse / Expand  (click button or press "[")
 *  - Dark / Light theme toggle
 *  - Company switcher dropdown
 *  - Profile menu dropdown
 *  - Search with nav-link filtering
 *  - Active link state
 *  - Notification dot & badge
 *  - Route markers
 *  - Keyboard navigation (Arrow keys, Escape)
 *  - Tooltips when collapsed
 *
 * Usage:
 *   import Sidebar from "./Sidebar";
 *   <Sidebar />
 *
 * Replace placeholder image URLs with your own assets as needed.
 */

import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────
const COMPANIES = [
  {
    id: "snk",
    name: "SNK",
    count: "Sanitaryware Factory",
    logo: "https://placehold.co/48x48/1E6FCC/ffffff?text=SNK",
    dark: false,
  },
  {
    id: "ssi",
    name: "SSI",
    count: "Sanitaryware Factory",
    logo: "https://placehold.co/48x48/166534/ffffff?text=SSI",
    dark: false,
  },
];

const USERS = [
  {
    id: "admin",
    name: "Admin",
    email: "admin@snk.co.th",
    role: "Admin",
    color: "#1E6FCC",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "manager",
    name: "Manager",
    email: "manager@snk.co.th",
    role: "Manager",
    color: "#7C3AED",
    avatar: "https://i.pravatar.cc/150?img=68",
  },
  {
    id: "operator",
    name: "Operator",
    email: "operator@snk.co.th",
    role: "Operator",
    color: "#166534",
    avatar: "https://i.pravatar.cc/150?img=47",
  },
];

const NAV_TOP = [
  { id: "/", label: "Dashboard", notification: null, badge: null },
  { id: "/manual-key-in", label: "Manual Key In", notification: null, badge: null },
  { id: "/alerts", label: "Alerts", notification: "3", badge: null },
  { id: "/reports", label: "Reports", notification: null, badge: null },
];

const ROUTES = [
  { id: "/oee", label: "OEE Details", color: "green" },
  { id: "/takt-cycle", label: "Takt vs Cycle Time", color: "violet" },
  { id: "/wip", label: "WIP Details", color: "purple" },
  { id: "/mttr", label: "MTTR Details", color: "red" },
];

const GLOBAL_SEARCH_INDEX = [
  // Top Nav
  { path: "/", label: "Dashboard", subLabel: "Overview", keywords: ["home", "main", "overview", "yield", "slip yield", "clay yield", "firing yield"] },
  { path: "/manual-key-in", label: "Manual Key In", subLabel: "Data Entry", keywords: ["input", "form", "data", "manual", "key in"] },
  { path: "/alerts", label: "Alerts", subLabel: "Notifications", keywords: ["warning", "error", "abnormal", "emergency", "maintenance"] },
  { path: "/reports", label: "Reports", subLabel: "Analytics", keywords: ["export", "data", "analytics", "excel"] },
  
  // KPI Details
  { path: "/oee", label: "OEE Details", subLabel: "KPI Report", keywords: ["overall equipment effectiveness", "availability", "performance", "quality"] },
  { path: "/takt-cycle", label: "Takt vs Cycle Time", subLabel: "KPI Report", keywords: ["takt time", "cycle time", "bottleneck", "efficiency"] },
  { path: "/wip", label: "WIP Details", subLabel: "KPI Report", keywords: ["work in process", "accumulation", "inventory"] },
  { path: "/mttr", label: "MTTR Details", subLabel: "KPI Report", keywords: ["mean time to repair", "incidents", "repair log"] },

  // Stages
  { path: "/stage/slip-prep", label: "Slip Preparation", subLabel: "Stage Dashboard", keywords: ["viscosity", "v0", "v30", "concentration", "temperature", "casting rate", "body slip"] },
  { path: "/stage/glaze-prep", label: "Glaze Preparation", subLabel: "Stage Dashboard", keywords: ["viscosity", "v0", "particle size", "residue", "concentration", "glaze"] },
  { path: "/stage/casting", label: "Casting", subLabel: "Stage Dashboard", keywords: ["mold cycle", "active molds", "casters", "wip"] },
  { path: "/stage/drying", label: "Drying", subLabel: "Stage Dashboard", keywords: ["moisture", "content", "drying curve"] },
  { path: "/stage/spraying", label: "Spraying", subLabel: "Stage Dashboard", keywords: ["thickness", "glaze thickness", "sprayer", "robot"] },
  { path: "/stage/firing", label: "Firing", subLabel: "Stage Dashboard", keywords: ["temperature", "firing cycle", "piece weight", "kiln"] },
];

// ─────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────
const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M6.00979 2.72L10.3565 7.06667C10.8698 7.58 10.8698 8.42 10.3565 8.93333L6.00979 13.28"
      strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M9 9L13 13M5.66667 10.3333C3.08934 10.3333 1 8.244 1 5.66667C1 3.08934 3.08934 1 5.66667 1C8.244 1 10.3333 3.08934 10.3333 5.66667C10.3333 8.244 8.244 10.3333 5.66667 10.3333Z"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 13m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <path d="M13.45 11.55l2.05 -2.05" />
    <path d="M6.4 20a9 9 0 1 1 11.2 0z" />
  </svg>
);

const TrendsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M4 18v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
    <path d="M7 14l3 -3l2 2l3 -3l2 2" />
  </svg>
);

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
    <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
  </svg>
);

const InboxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 4l-8 4l8 4l8 -4l-8 -4" />
    <path d="M4 12l8 4l8 -4" />
    <path d="M4 16l8 4l8 -4" />
  </svg>
);

const AddRouteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M7 3m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
    <path d="M4.012 7.26a2.005 2.005 0 0 0 -1.012 1.737v10c0 1.1 .9 2 2 2h10c.75 0 1.158 -.385 1.5 -1" />
    <path d="M11 10h6" />
    <path d="M14 7v6" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
    <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
  </svg>
);

const SupportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <path d="M15 15l3.35 3.35" /><path d="M9 15l-3.35 3.35" />
    <path d="M5.65 5.65l3.35 3.35" /><path d="M18.35 5.65l-3.35 3.35" />
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
  </svg>
);

const ChevronUpDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M8 9l4 -4l4 4" /><path d="M16 15l-4 4l-4 -4" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M5 12l5 5l10 -10" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 5l0 14" /><path d="M5 12l14 0" />
  </svg>
);

const DotsVerticalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
    <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
  </svg>
);

const CreditCardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M3 5m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" />
    <path d="M3 10l18 0" /><path d="M7 15l.01 0" /><path d="M11 15l2 0" />
  </svg>
);

const LogOutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
    <path d="M9 12h12l-3 -3" /><path d="M18 15l3 -3" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
    <path d="M13.5 6.5l4 4" />
    <path d="M16 19h6" />
  </svg>
);

const NAV_ICONS = {
  "/": <DashboardIcon />,
  "/manual-key-in": <EditIcon />,
  "/alerts": <BellIcon />,
  "/reports": <TrendsIcon />,
};

// ─────────────────────────────────────────────
// CSS (all selectors scoped to .sidebar-root)
// ─────────────────────────────────────────────
const CSS = `
.sidebar-root {
  --white: #ffffff;
  --sidebar-bg: #fff;
  --bg: #dbdbdb;
  --text: #808183;
  --text-headline: #1f1f1f;
  --text-link: #f9fafc;
  --expand-button: #f6f6f6;
  --search-bg: #f6f6f6;
  --link-hover: #f6f6f6;
  --tooltip-bg: #151515;
  --alarm: #ee461e;
  --green: #aeeadb;
  --violet: #cad2f6;
  --purple: #e4c5f4;
  --text-dark: #151515;
  --text-gray: #929292;
  --online: #22c55e;
  --dropdown-bg: #fff;
  --dropdown-shadow: rgba(0,0,0,0.12);
  --dropdown-hover: #f4f4f5;
  --dropdown-border: rgba(0,0,0,0.06);
  --danger: #ef4444;
  --danger-hover: #fef2f2;
  --accent: #4f6ef7;
  --accent-light: #eef1fe;
  font-family: "Inter", sans-serif;
  font-size: 16px;
}

/* Dark theme */
.sidebar-root.dark {
  --sidebar-bg: #1a1a1a;
  --text: #8a8a8a;
  --text-headline: #e8e8e8;
  --text-link: #1a1a1a;
  --expand-button: #2a2a2a;
  --search-bg: #222222;
  --tooltip-bg: #e8e8e8;
  --text-dark: #e0e0e0;
  --text-gray: #707070;
  --green: #1a5c47;
  --violet: #3a4080;
  --purple: #5c3570;
  --dropdown-bg: #222222;
  --dropdown-shadow: rgba(0,0,0,0.4);
  --dropdown-hover: #2e2e2e;
  --dropdown-border: rgba(255,255,255,0.08);
  --danger-hover: #2a1515;
  --accent: #6b8aff;
  --accent-light: #1e2443;
}

.sidebar-root *, .sidebar-root *::before, .sidebar-root *::after {
  margin: 0; padding: 0; box-sizing: border-box;
}

/* Sidebar shell */
.sidebar-root .sidebar {
  position: sticky;
  top: 1rem;
  height: calc(100dvh - 2rem);
  padding: 1rem;
  border-radius: 0.75rem;
  max-width: 18rem;
  min-width: 4rem;
  display: flex;
  flex-direction: column;
  background: var(--sidebar-bg);
  box-shadow: rgba(99,99,99,0.2) 0px 2px 8px 0px;
  transition: max-width 0.3s ease, background 0.4s ease, box-shadow 0.4s ease;
}
.sidebar-root.collapsed .sidebar { max-width: 5rem; }
.sidebar-root.dark .sidebar { box-shadow: rgba(0,0,0,0.5) 0px 2px 12px 0px; }

/* hide utility */
.sidebar-root.collapsed .hide {
  opacity: 0; visibility: hidden; pointer-events: none; position: absolute;
}

/* Separator */
.sidebar-root .separator {
  width: 100%; height: 1px; margin: 1rem 0;
  background: rgba(0,0,0,0.08);
  transition: background 0.4s ease; flex-shrink: 0;
}
.sidebar-root.dark .separator { background: rgba(255,255,255,0.08); }

/* Sidebar top */
.sidebar-root .sidebar-top {
  display: flex; align-items: center; height: 3rem; position: relative;
}
.sidebar-root .logo__wrapper {
  display: flex; align-items: center; gap: 0.75rem;
  color: var(--text); background: none; border: none;
  padding: 0; cursor: pointer; font-family: inherit;
  text-align: left; white-space: nowrap;
}
.sidebar-root .company-chevron {
  width: 1.125rem; height: 1.125rem;
  stroke: var(--text-gray); margin-left: auto; flex-shrink: 0;
  transition: stroke 0.4s ease, opacity 0.3s ease;
}
.sidebar-root.collapsed .company-chevron { opacity: 0; }
.sidebar-root .logo-small {
  width: 3rem; height: 3rem; border-radius: 0.5rem;
  object-fit: cover; flex-shrink: 0;
}
.sidebar-root .logo-small--dark {
  background: #1c1c1c; object-fit: contain; padding: 0.5rem;
}
.sidebar-root .sidebar-top__company {
  display: flex; flex-direction: column; gap: 0.15rem;
  overflow: hidden; transition: opacity 0.3s ease;
}
.sidebar-root.collapsed .sidebar-top__company { opacity: 0; pointer-events: none; }
.sidebar-root .company-name {
  font-size: 1.15rem; font-weight: 700;
  color: var(--text-headline); white-space: nowrap; transition: color 0.4s ease;
}
.sidebar-root .company-members {
  font-size: 0.8rem; font-weight: 600;
  color: var(--text); transition: color 0.4s ease;
}

/* Search */
.sidebar-root .search__wrapper { position: relative; margin-top: 1.25rem; }
.sidebar-root .search__wrapper svg {
  position: absolute; z-index: 2; top: 50%; left: 0.9rem;
  width: 1.25rem; height: 1.25rem; stroke: var(--text);
  transform: translateY(-50%); pointer-events: none; transition: stroke 0.4s ease;
}
.sidebar-root .search__wrapper input {
  background: var(--search-bg); min-height: 2.6rem; width: 100%;
  color: var(--text-dark); border-radius: 0.75rem;
  box-shadow: rgba(0,0,0,0.08) 0px 0px 5px 0px, rgba(0,0,0,0.06) 0px 0px 1px 0px;
  padding: 0 1rem 0 2.75rem; font-family: inherit; font-size: 0.95rem;
  border: none; transition: background 0.3s ease, box-shadow 0.3s ease, color 0.4s ease;
}
.sidebar-root .search__wrapper input::placeholder { color: var(--text); font-size: 0.95rem; }
.sidebar-root .search__wrapper input:focus {
  outline: none;
  box-shadow: rgba(0,0,0,0.08) 0px 0px 8px 0px, 0 0 0 1.5px var(--accent);
}
.sidebar-root .search__wrapper:focus-within svg,
.sidebar-root .search__wrapper:hover svg { stroke: var(--accent); }
.sidebar-root.collapsed .search__wrapper input {
  background: transparent; box-shadow: none; cursor: pointer;
}
.sidebar-root.collapsed .search__wrapper input::placeholder { color: transparent; }
.sidebar-root.dark .search__wrapper input:focus {
  box-shadow: rgba(0,0,0,0.3) 0px 0px 8px 0px, 0 0 0 1.5px var(--accent);
}

/* Nav links */
.sidebar-root .sidebar-links--top {
  margin-top: 1.25rem; min-height: 0;
}
.sidebar-root .sidebar-links ul {
  list-style: none; display: flex; flex-direction: column; gap: 0.375rem;
}
.sidebar-root .sidebar-links li {
  color: var(--text-dark); min-width: 3rem; transition: color 0.4s ease;
}
.sidebar-root .sidebar-links li svg {
  stroke: var(--text-dark); width: 1.5rem; height: 1.5rem;
  min-width: 1.5rem; flex-shrink: 0; transition: stroke 0.4s ease;
}
.sidebar-root .sidebar-links li a {
  color: var(--text-dark); width: 100%; padding: 0 0.75rem;
  font-size: 0.95rem; display: flex; gap: 0.875rem; border-radius: 0.625rem;
  align-items: center; min-height: 2.75rem; text-decoration: none;
  transition: background 0.2s ease, color 0.4s ease; position: relative;
}
.sidebar-root .sidebar-links li a:focus-visible {
  outline: 2px solid var(--text-dark); outline-offset: -2px; border-radius: 0.625rem;
}
.sidebar-root .sidebar-links li a .link { overflow: hidden; white-space: nowrap; }
.sidebar-root .sidebar-links .notification {
  position: absolute; top: 0.1rem; left: 1.35rem;
  min-width: 0.9rem; height: 0.9rem; padding: 0 0.15rem;
  background: var(--alarm); color: var(--white);
  border-radius: 0.5rem; border: 1.5px solid var(--sidebar-bg);
  font-size: 0.6rem; font-weight: 800; line-height: 1;
  display: flex; align-items: center; justify-content: center;
}
.sidebar-root.dark .sidebar-links .notification { border-color: var(--sidebar-bg); }
.sidebar-root .sidebar-links li a:hover { background: var(--accent-light); color: var(--accent); }
.sidebar-root .sidebar-links li a:hover svg { stroke: var(--accent); }
.sidebar-root .sidebar-links .active,
.sidebar-root .sidebar-links .active:hover { background: var(--accent-light); color: var(--accent); }
.sidebar-root .sidebar-links .active svg { stroke: var(--accent); }
.sidebar-root .sidebar-links--bottom { margin-top: auto; flex-shrink: 0; }
.sidebar-root .sidebar-links--gray li svg { stroke: var(--text-dark); }
.sidebar-root .sidebar-links--gray li a { color: var(--text-dark); }

/* Badge */
.sidebar-root .badge {
  background: var(--alarm); color: var(--white);
  font-size: 0.65rem; font-weight: 700; min-width: 1.25rem;
  height: 1.25rem; line-height: 1.25rem; text-align: center;
  border-radius: 0.625rem; padding: 0 0.3rem;
}

/* Search filtering */
.sidebar-root .sidebar-links li.search-hidden { display: none; }

/* Tooltips */
.sidebar-root .tooltip .tooltip__content {
  visibility: hidden; opacity: 0;
  background: var(--tooltip-bg); color: var(--text-link);
  text-align: center; border-radius: 0.375rem;
  white-space: nowrap; padding: 0.35rem 0.75rem;
  font-size: 0.8rem; position: absolute; z-index: 10;
  left: calc(100% + 1.25rem); top: 50%; transform: translateY(-50%);
  pointer-events: none; transition: opacity 0.15s ease, visibility 0.15s ease;
}
.sidebar-root .tooltip .tooltip__content::after {
  content: ""; position: absolute; top: 50%; left: -4px;
  transform: translateY(-50%); border-width: 5px; border-style: solid;
  border-color: transparent var(--tooltip-bg) transparent transparent;
}
.sidebar-root.dark .tooltip .tooltip__content { background: var(--tooltip-bg); color: var(--text-link); }
.sidebar-root.dark .tooltip .tooltip__content::after {
  border-color: transparent var(--tooltip-bg) transparent transparent;
}
.sidebar-root.collapsed .tooltip:hover .tooltip__content {
  visibility: visible; opacity: 1;
}

/* Profile section */
.sidebar-root .sidebar__profile {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.25rem 0.25rem 0.5rem; position: relative; flex-shrink: 0;
}
.sidebar-root .avatar__wrapper {
  position: relative; display: flex; flex-shrink: 0; cursor: pointer;
}
.sidebar-root .avatar {
  display: block; width: 2.5rem; height: 2.5rem;
  object-fit: cover; border-radius: 0.5rem;
  transition: outline-offset 0.2s ease;
}
.sidebar-root .avatar:hover { outline: 1.5px solid var(--accent); outline-offset: 2px; }
.sidebar-root .online-status {
  position: absolute; bottom: -1px; right: -1px;
  width: 0.7rem; height: 0.7rem; background: var(--online);
  border-radius: 50%; border: 2px solid var(--sidebar-bg); transition: border-color 0.4s ease;
}
.sidebar-root .avatar__name {
  display: flex; flex-direction: column; gap: 0.125rem;
  white-space: nowrap; overflow: hidden;
}
.sidebar-root .user-name {
  font-weight: 600; font-size: 0.9rem;
  color: var(--text-dark); transition: color 0.4s ease;
}
.sidebar-root .email { color: var(--text-gray); font-size: 0.75rem; transition: color 0.4s ease; }
.sidebar-root .profile-menu-button {
  margin-left: auto; background: none; border: none; cursor: pointer;
  padding: 0.25rem; border-radius: 0.375rem;
  transition: background 0.2s ease; display: grid; place-items: center;
}
.sidebar-root .profile-menu-button:hover { background: var(--accent-light); }
.sidebar-root .profile-menu-button:hover svg { color: var(--accent); }
.sidebar-root .profile-menu-button svg {
  color: var(--text-gray); width: 1.25rem; height: 1.25rem;
}

/* Profile dropdown */
.sidebar-root .profile-dropdown {
  position: absolute; bottom: 0; left: calc(100% + 0.75rem);
  min-width: 13rem; background: var(--dropdown-bg);
  border: 1px solid var(--accent); border-radius: 0.625rem;
  box-shadow: 0 4px 24px var(--dropdown-shadow), 0 1px 4px var(--dropdown-shadow);
  padding: 0.375rem; z-index: 20;
  opacity: 0; visibility: hidden; transform: translateX(-0.5rem);
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
}
.sidebar-root .profile-dropdown.open {
  opacity: 1; visibility: visible; transform: translateX(0);
}
.sidebar-root .profile-dropdown__item {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.625rem 0.75rem; border-radius: 0.5rem;
  font-size: 0.925rem; font-family: inherit; color: var(--text-dark);
  text-decoration: none; border: none; background: none;
  width: 100%; cursor: pointer; transition: background 0.15s ease;
}
.sidebar-root .profile-dropdown__item svg {
  width: 1.25rem; height: 1.25rem; stroke: var(--text-gray); flex-shrink: 0;
}
.sidebar-root .profile-dropdown__item:hover { background: var(--accent-light); color: var(--accent); }
.sidebar-root .profile-dropdown__item:hover svg { stroke: var(--accent); }
.sidebar-root .profile-dropdown__item:focus-visible {
  outline: 2px solid var(--text-dark); outline-offset: -2px;
}
.sidebar-root .profile-dropdown__item--danger { color: var(--danger); }
.sidebar-root .profile-dropdown__item--danger svg { stroke: var(--danger); }
.sidebar-root .profile-dropdown__item--danger:hover { background: var(--danger-hover); color: var(--danger); }
.sidebar-root .profile-dropdown__item--danger:hover svg { stroke: var(--danger); }
.sidebar-root .profile-dropdown__separator {
  height: 1px; margin: 0.25rem 0.375rem; background: var(--dropdown-border);
}

/* Expand button */
.sidebar-root .expand-btn {
  position: absolute; top: 1.5rem; right: -1rem;
  display: grid; place-items: center; cursor: pointer;
  background: var(--expand-button); z-index: 2;
  width: 2rem; height: 2rem; border: none; border-radius: 50%;
  box-shadow: rgba(99,99,99,0.2) 0px 2px 8px 0px; transition: background 0.2s ease;
}
.sidebar-root .expand-btn:hover { background: #ececec; }
.sidebar-root.dark .expand-btn:hover { background: #333; }
.sidebar-root .expand-btn:focus-visible { outline: 2px solid var(--text-dark); outline-offset: 2px; }
.sidebar-root .expand-btn svg {
  stroke: var(--text-dark); width: 1rem; height: 1rem;
  transition: transform 0.3s ease, stroke 0.4s ease; transform: rotate(180deg);
}
.sidebar-root.collapsed .expand-btn svg { transform: rotate(0deg); }

/* Routes */
.sidebar-root .routes .route__marker {
  width: 1.125rem; height: 1.125rem; flex-shrink: 0;
  display: inline-block; border-radius: 0.25rem;
  margin: 0 0.1875rem; transition: background 0.4s ease;
}
.sidebar-root .routes .route__marker--green { background: var(--green); }
.sidebar-root .routes .route__marker--violet { background: var(--violet); }
.sidebar-root .routes .route__marker--purple { background: var(--purple); }
.sidebar-root .routes .route__marker--red { background: var(--danger); }

/* Theme toggle */
.sidebar-root .theme-toggle {
  display: flex; align-items: center; gap: 0.875rem;
  width: 100%; padding: 0 0.75rem; min-height: 2.75rem;
  margin-bottom: 0.75rem; background: none; border: none;
  border-radius: 0.625rem; cursor: pointer; color: var(--text-dark);
  font-family: inherit; font-size: 0.95rem;
  transition: background 0.2s ease, color 0.4s ease; position: relative; flex-shrink: 0;
}
.sidebar-root .theme-toggle:hover { background: var(--accent-light); color: var(--accent); }
.sidebar-root .theme-toggle:hover .theme-toggle__icon { stroke: var(--accent); }
.sidebar-root .theme-toggle:focus-visible { outline: 2px solid var(--text-dark); outline-offset: -2px; }
.sidebar-root .theme-toggle__icon {
  width: 1.5rem; height: 1.5rem; min-width: 1.5rem;
  flex-shrink: 0; stroke: var(--text-dark); transition: stroke 0.4s ease;
}
.sidebar-root .theme-toggle__icon--sun { display: none; }
.sidebar-root.dark .theme-toggle__icon--sun { display: block; }
.sidebar-root.dark .theme-toggle__icon--moon { display: none; }

/* Company dropdown */
.sidebar-root .company-dropdown {
  position: absolute; top: 0; left: calc(100% + 0.75rem);
  min-width: 15rem; background: var(--dropdown-bg);
  border: 1px solid var(--accent); border-radius: 0.625rem;
  box-shadow: 0 4px 24px var(--dropdown-shadow), 0 1px 4px var(--dropdown-shadow);
  padding: 0.375rem; z-index: 20;
  opacity: 0; visibility: hidden; transform: translateX(-0.5rem);
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
}
.sidebar-root .company-dropdown.open {
  opacity: 1; visibility: visible; transform: translateX(0);
}
.sidebar-root .company-dropdown__header {
  font-size: 0.7rem; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.05em; color: var(--text-gray); padding: 0.5rem 0.75rem 0.375rem;
}
.sidebar-root .company-dropdown__item {
  display: flex; align-items: center; gap: 0.625rem;
  padding: 0.5rem 0.75rem; border-radius: 0.5rem;
  width: 100%; border: none; background: none;
  cursor: pointer; font-family: inherit; text-align: left; transition: background 0.15s ease;
}
.sidebar-root .company-dropdown__item:hover { background: var(--accent-light); }
.sidebar-root .company-dropdown__item:focus-visible { outline: 2px solid var(--text-dark); outline-offset: -2px; }
.sidebar-root .company-dropdown__item--active { background: var(--dropdown-hover); }
.sidebar-root .company-dropdown__logo {
  width: 2rem; height: 2rem; border-radius: 0.375rem;
  object-fit: contain; flex-shrink: 0;
}
.sidebar-root .company-dropdown__logo--dark { background: #1c1c1c; padding: 0.35rem; }
.sidebar-root .company-dropdown__info {
  display: flex; flex-direction: column; gap: 0.075rem; min-width: 0;
}
.sidebar-root .company-dropdown__name {
  font-size: 0.875rem; font-weight: 600; color: var(--text-dark); white-space: nowrap;
}
.sidebar-root .company-dropdown__count { font-size: 0.7rem; color: var(--text-gray); }
.sidebar-root .company-dropdown__check {
  width: 1rem; height: 1rem; stroke: var(--online); margin-left: auto; flex-shrink: 0;
}
.sidebar-root .company-dropdown__separator {
  height: 1px; margin: 0.25rem 0.375rem; background: var(--dropdown-border);
}
.sidebar-root .company-dropdown__action {
  display: flex; align-items: center; gap: 0.625rem;
  padding: 0.5rem 0.75rem; border-radius: 0.5rem;
  width: 100%; border: none; background: none;
  cursor: pointer; font-family: inherit; font-size: 0.85rem;
  color: var(--text-gray); transition: background 0.15s ease;
}
.sidebar-root .company-dropdown__action svg {
  width: 1.125rem; height: 1.125rem; stroke: var(--text-gray); flex-shrink: 0;
}
.sidebar-root .company-dropdown__action:hover { background: var(--accent-light); color: var(--accent); }
.sidebar-root .company-dropdown__action:hover svg { stroke: var(--accent); }
.sidebar-root .company-dropdown__action:focus-visible { outline: 2px solid var(--text-dark); outline-offset: -2px; }
`;

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar({ isDark: isDarkProp, onThemeToggle }) {
  const [collapsed, setCollapsed] = useState(true);
  const [isDarkInternal, setIsDarkInternal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // Use external controlled value if provided, otherwise use internal state
  const isDark = isDarkProp !== undefined ? isDarkProp : isDarkInternal;
  const activeLink = location.pathname;
  const [profileOpen, setProfileOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [activeCompany, setActiveCompany] = useState("snk");
  const [activeUser, setActiveUser] = useState("admin");

  const currentUser = USERS.find((u) => u.id === activeUser) || USERS[0];
  const currentIdx = USERS.findIndex((u) => u.id === activeUser);
  const nextUser = USERS[(currentIdx + 1) % USERS.length];

  const handleSwitchRole = () => {
    setActiveUser(nextUser.id);
    setProfileOpen(false);
  };

  const profileDropdownRef = useRef(null);
  const profileMenuBtnRef = useRef(null);
  const companyDropdownRef = useRef(null);
  const logoWrapperRef = useRef(null);
  const searchInputRef = useRef(null);

  const currentCompany = COMPANIES.find((c) => c.id === activeCompany);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "[") {
        e.preventDefault();
        setCollapsed((prev) => !prev);
      }
      if (e.key === "Escape") {
        setProfileOpen(false);
        setCompanyOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState("15m");
  const settingsBtnRef = useRef(null);
  const settingsDropdownRef = useRef(null);
  const sidebarRef = useRef(null);

  // ── Swipe & Click outside logic ──
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartX.current = e.changedTouches[0].screenX;
    };
    const handleTouchMove = (e) => {
      touchEndX.current = e.changedTouches[0].screenX;
    };
    const handleTouchEnd = (e) => {
      const distance = touchEndX.current - touchStartX.current;
      if (distance < -50) {
        // Swipe left -> collapse
        setCollapsed(true);
      }
      if (distance > 50) {
        // Swipe right -> expand if starting from left edge OR if touched on sidebar
        if (touchStartX.current < 100 || (sidebarRef.current && sidebarRef.current.contains(e.target))) {
          setCollapsed(false);
        }
      }
    };

    const handleClick = (e) => {
      // Collapse sidebar if clicking outside of it
      if (
        sidebarRef.current && 
        !sidebarRef.current.contains(e.target) &&
        !supportOpen // Don't collapse if support modal is open
      ) {
        setCollapsed(true);
      }

      if (
        !profileDropdownRef.current?.contains(e.target) &&
        !profileMenuBtnRef.current?.contains(e.target)
      ) {
        setProfileOpen(false);
      }
      if (
        !companyDropdownRef.current?.contains(e.target) &&
        !logoWrapperRef.current?.contains(e.target)
      ) {
        setCompanyOpen(false);
      }
      if (
        !settingsDropdownRef.current?.contains(e.target) &&
        !settingsBtnRef.current?.contains(e.target)
      ) {
        setSettingsOpen(false);
      }
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [supportOpen]);

  const handleToggleProfile = useCallback((e) => {
    e.stopPropagation();
    setProfileOpen((prev) => !prev);
    setCompanyOpen(false);
  }, []);

  const handleToggleCompany = useCallback((e) => {
    e.stopPropagation();
    setCompanyOpen((prev) => !prev);
    setProfileOpen(false);
  }, []);

  const handleSelectCompany = useCallback((id, e) => {
    e.stopPropagation();
    setActiveCompany(id);
    setCompanyOpen(false);
  }, []);

  const [rawSearch, setRawSearch] = useState("");
  const searchQuery = rawSearch.toLowerCase().trim();

  const handleSearchFocus = () => {
    setCollapsed(false);
  };

  const handleSearchChange = (e) => {
    setRawSearch(e.target.value);
  };

  const getGlobalSearchResults = () => {
    if (!searchQuery) return [];
    return GLOBAL_SEARCH_INDEX.filter((item) => {
      if (item.label.toLowerCase().includes(searchQuery)) return true;
      if (item.subLabel.toLowerCase().includes(searchQuery)) return true;
      if (item.keywords.some((k) => k.toLowerCase().includes(searchQuery))) return true;
      return false;
    });
  };

  // Original function for non-global fallback if needed, but we'll use conditional rendering instead.
  const isLinkHidden = (label) => false;

  const rootClass = [
    "sidebar-root",
    collapsed ? "collapsed" : "",
    isDark ? "dark" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass}>
      {/* Inject scoped CSS */}
      <style>{CSS}</style>

      <nav 
        className="sidebar"
        ref={sidebarRef}
        onClick={(e) => {
          // If clicking exactly on the nav or empty areas (not buttons/links inside)
          if (
            e.target.tagName !== 'BUTTON' && 
            e.target.tagName !== 'A' && 
            e.target.closest('a') === null && 
            e.target.closest('button') === null && 
            e.target.tagName !== 'INPUT'
          ) {
            setCollapsed(prev => !prev);
          }
        }}
      >
        {/* ── Logo / Company Switcher ── */}
        <div className="sidebar-top">
          <button
            ref={logoWrapperRef}
            type="button"
            className="logo__wrapper"
            aria-haspopup="true"
            aria-expanded={companyOpen}
            aria-label="Switch company"
            onClick={handleToggleCompany}
          >
            <img
              src={currentCompany.logo}
              alt={currentCompany.name}
              className={`logo-small${currentCompany.dark ? " logo-small--dark" : ""}`}
            />
            <div className="sidebar-top__company">
              <span className="company-name">{currentCompany.name}</span>
              <span className="company-members">{currentCompany.count}</span>
            </div>
            <span className="company-chevron">
              <ChevronUpDownIcon />
            </span>
          </button>

          {/* Company dropdown */}
          <div
            ref={companyDropdownRef}
            className={`company-dropdown${companyOpen ? " open" : ""}`}
            role="menu"
            aria-label="Switch company"
          >
            <div className="company-dropdown__header">Switch workspace</div>
            {COMPANIES.map((company) => (
              <button
                key={company.id}
                type="button"
                className={`company-dropdown__item${activeCompany === company.id ? " company-dropdown__item--active" : ""}`}
                role="menuitem"
                onClick={(e) => handleSelectCompany(company.id, e)}
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className={`company-dropdown__logo${company.dark ? " company-dropdown__logo--dark" : ""}`}
                />
                <div className="company-dropdown__info">
                  <span className="company-dropdown__name">{company.name}</span>
                  <span className="company-dropdown__count">{company.count}</span>
                </div>
                {activeCompany === company.id && (
                  <span className="company-dropdown__check">
                    <CheckIcon />
                  </span>
                )}
              </button>
            ))}
            <div className="company-dropdown__separator" />
            <button type="button" className="company-dropdown__action" role="menuitem">
              <PlusIcon />
              Add workspace
            </button>
          </div>
        </div>

        {/* ── Search ── */}
        <div className="search__wrapper">
          <SearchIcon />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search..."
            aria-label="Search"
            value={rawSearch}
            onFocus={handleSearchFocus}
            onChange={handleSearchChange}
          />
        </div>

        {searchQuery ? (
          <div className="sidebar-links sidebar-links--top">
            <ul>
              {getGlobalSearchResults().map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.path}
                    className="tooltip"
                    data-label={item.label}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.path);
                      setRawSearch("");
                    }}
                  >
                    <SearchIcon />
                    <div className="link hide" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2, padding: '4px 0' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{item.label}</span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{item.subLabel}</span>
                    </div>
                    <span className="tooltip__content">{item.label}</span>
                  </a>
                </li>
              ))}
              {getGlobalSearchResults().length === 0 && (
                <li>
                  <div className="link hide" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    No results found
                  </div>
                </li>
              )}
            </ul>
          </div>
        ) : (
          <>
            {/* ── Top Nav Links ── */}
            <div className="sidebar-links sidebar-links--top">
              <ul>
                {NAV_TOP.map(({ id, label, notification, badge }) => (
                  <li key={id} className={isLinkHidden(label) ? "search-hidden" : ""}>
                    <a
                      href={id}
                      className={`tooltip${activeLink === id ? " active" : ""}`}
                      data-label={label}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(id);
                      }}
                    >
                      {NAV_ICONS[id]}
                      {notification && <span className="notification">{notification}</span>}
                      <span className="link hide">{label}</span>
                      {badge && <span className="badge hide">{badge}</span>}
                      <span className="tooltip__content">{label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="separator" />

            {/* ── Routes ── */}
            <div className="sidebar-links routes sidebar-links--gray">
              <ul>
                {ROUTES.map(({ id, label, color }) => (
                  <li key={id} className={isLinkHidden(label) ? "search-hidden" : ""}>
                    <a
                      href={id}
                      className={`tooltip${activeLink === id ? " active" : ""}`}
                      data-label={label}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(id);
                      }}
                    >
                      <span className={`route__marker route__marker--${color}`} />
                      <span className="link hide">{label}</span>
                      <span className="tooltip__content">{label}</span>
                    </a>
                  </li>
                ))}
                <li className={isLinkHidden("Add Route") ? "search-hidden" : ""}>
                  <a
                    href="#add-route"
                    className="tooltip"
                    data-label="Add Route"
                    onClick={(e) => e.preventDefault()}
                  >
                    <AddRouteIcon />
                    <span className="link hide">Add Route</span>
                    <span className="tooltip__content">Add Route</span>
                  </a>
                </li>
              </ul>
            </div>
          </>
        )}

        {/* ── Bottom Nav ── */}
        <div className="sidebar-links sidebar-links--bottom sidebar-links--gray relative">
          <ul>
            <li className={isLinkHidden("Settings") ? "search-hidden" : ""}>
              <a
                href="#settings"
                ref={settingsBtnRef}
                className={`tooltip${settingsOpen ? " active" : ""}`}
                data-label="Settings"
                onClick={(e) => {
                  e.preventDefault();
                  setSettingsOpen(prev => !prev);
                }}
              >
                <SettingsIcon />
                <span className="link hide">Settings</span>
                <span className="tooltip__content">Settings</span>
              </a>
              {settingsOpen && (
                <div 
                  ref={settingsDropdownRef}
                  className="absolute bottom-full left-4 mb-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] w-[210px] p-2 z-[60]"
                >
                  <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest px-3 pt-2 pb-2">Auto Refresh Interval</p>
                  <div className="grid grid-cols-3 gap-1.5 p-1">
                    {['1m', '5m', '15m', '30m', '1H', '4H', '8H'].map(time => (
                      <button
                        key={time}
                        onClick={(e) => { e.stopPropagation(); setRefreshInterval(time); setSettingsOpen(false); }}
                        className={`text-[12px] font-bold py-2 rounded-lg transition-colors border ${refreshInterval === time ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'bg-[var(--bg-page)] text-[var(--text-primary)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </li>
            
            <li className={isLinkHidden("Support") ? "search-hidden" : ""}>
              <a
                href="#support"
                className="tooltip"
                data-label="Support"
                onClick={(e) => {
                  e.preventDefault();
                  setSupportOpen(true);
                }}
              >
                <SupportIcon />
                <span className="link hide">Support</span>
                <span className="tooltip__content">Support</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="separator" />

        {/* ── Theme Toggle ── */}
        <button
          type="button"
          className="theme-toggle tooltip"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          onClick={() => {
            if (onThemeToggle) {
              onThemeToggle();
            } else {
              setIsDarkInternal((prev) => !prev);
            }
          }}
        >
          <span className="theme-toggle__icon theme-toggle__icon--sun">
            <SunIcon />
          </span>
          <span className="theme-toggle__icon theme-toggle__icon--moon">
            <MoonIcon />
          </span>
          <span className="link hide">{isDark ? "Light Mode" : "Dark Mode"}</span>
          <span className="tooltip__content">{isDark ? "Light Mode" : "Dark Mode"}</span>
        </button>

        {/* ── Profile ── */}
        <div className="sidebar__profile tooltip">
          <div
            className="avatar__wrapper"
            role="button"
            tabIndex={0}
            aria-label="Open profile menu"
            onClick={collapsed ? handleToggleProfile : undefined}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && collapsed) {
                e.preventDefault();
                handleToggleProfile(e);
              }
            }}
          >
            <img
              className="avatar"
              src={currentUser.avatar}
              alt={currentUser.name}
            />
            <span className="online-status" />
          </div>

          <div className="avatar__name hide">
            <div className="user-name">{currentUser.name}</div>
            <div className="email">{currentUser.role} · {currentUser.email}</div>
          </div>

          <span className="tooltip__content">Profile</span>

          <button
            ref={profileMenuBtnRef}
            type="button"
            className="profile-menu-button hide"
            aria-label="Profile menu"
            aria-haspopup="true"
            aria-expanded={profileOpen}
            onClick={handleToggleProfile}
          >
            <DotsVerticalIcon />
          </button>

          {/* Profile dropdown */}
          <div
            ref={profileDropdownRef}
            className={`profile-dropdown${profileOpen ? " open" : ""}`}
            role="menu"
            aria-label="Profile menu"
          >
            {/* Current user info */}
            <div style={{ padding: "0.5rem 0.75rem 0.25rem", borderBottom: "1px solid var(--dropdown-border)", marginBottom: "0.25rem" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-dark)" }}>{currentUser.name}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-gray)", marginTop: "0.1rem" }}>
                <span style={{ background: `${currentUser.color}18`, color: currentUser.color, padding: "0.1rem 0.5rem", borderRadius: "999px", fontWeight: 600, border: `1px solid ${currentUser.color}44` }}>
                  {currentUser.role}
                </span>
              </div>
            </div>

            {[
              { href: "#profile", label: "View Profile", Icon: UserIcon },
              { href: "#account", label: "Account Settings", Icon: SettingsIcon },
            ].map(({ href, label, Icon }) => (
              <a key={label} href={href} className="profile-dropdown__item" role="menuitem"
                onClick={(e) => { e.preventDefault(); setProfileOpen(false); }}>
                <Icon />
                {label}
              </a>
            ))}

            {/* Switch Role — cycles Admin → Manager → Operator → Admin */}
            <button
              type="button"
              className="profile-dropdown__item"
              role="menuitem"
              onClick={handleSwitchRole}
              style={{ color: nextUser.color }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Switch to {nextUser.role}
            </button>

            <div className="profile-dropdown__separator" />
            <button
              type="button"
              className="profile-dropdown__item profile-dropdown__item--danger"
              role="menuitem"
            >
              <LogOutIcon />
              Log Out
            </button>
          </div>
        </div>
      </nav>

      {supportOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" 
          onClick={() => setSupportOpen(false)}
        >
          <div 
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center relative" 
            onClick={e => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" 
              onClick={() => setSupportOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            
            <div className="w-16 h-16 bg-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-[#16A34A]/30">
              <SupportIcon />
            </div>
            
            <h3 className="text-[18px] font-black text-[var(--text-primary)] mb-1">Powered By ACE</h3>
            <p className="text-[12px] font-bold text-[var(--text-secondary)] mb-6 leading-relaxed">
              (Autonomous Cognitive Engineering)<br/>
              PTD (Production Technology Development)
            </p>
            
            <div className="bg-[var(--bg-page)] rounded-xl p-5 border border-[var(--border)] text-left space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--accent)] opacity-5 rounded-bl-full pointer-events-none" />
              <p className="text-[11px] font-black text-[var(--text-secondary)] uppercase tracking-widest border-b border-[var(--border)] pb-2 mb-3">Supportor</p>
              
              <div>
                <p className="text-[15px] font-black text-[var(--accent)] mb-0.5">Surayut Puttipatkul</p>
                <div className="flex items-center gap-2 mt-2 text-[13px] text-[var(--text-secondary)]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[var(--accent)]"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  <span className="font-semibold select-all">surayutp@scg.com</span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-[13px] text-[var(--text-secondary)]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[var(--accent)]"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <span className="font-semibold select-all">099-894-7418</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
