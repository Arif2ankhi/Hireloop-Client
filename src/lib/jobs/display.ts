import type { LucideIcon } from "lucide-react";
import {
  BadgeCheckIcon,
  Code2Icon,
  MegaphoneIcon,
  PenToolIcon,
  ServerCogIcon,
} from "lucide-react";

/** Category → icon chips, shared by the manage table and the job cards. */
export const DEPT_ICONS: Record<string, LucideIcon> = {
  "Engineering & Tech": Code2Icon,
  Design: PenToolIcon,
  "Infrastructure & Tech": ServerCogIcon,
  Marketing: MegaphoneIcon,
  Quality: BadgeCheckIcon,
};

export function getDeptIcon(category: string): LucideIcon {
  return DEPT_ICONS[category] ?? Code2Icon;
}

export const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  BDT: "৳",
};

/**
 * Deadline display. Fixed locale keeps server/client markup identical
 * (no hydration drift).
 */
export function formatDeadline(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** "per hour" → "/ hr" */
export function formatFrequency(frequency: string) {
  return ` / ${frequency.replace(/^per /, "")}`;
}

/**
 * US state codes as they appear after the comma in stored locations
 * ("Austin, TX", "Boston, MA", …).
 */
const US_STATE_CODES = new Set([
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID",
  "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS",
  "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK",
  "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV",
  "WI", "WY", "DC",
]);

/** Non-US suffixes seen in the data, e.g. "London, UK". */
const COUNTRY_SUFFIXES: Record<string, string> = {
  UK: "United Kingdom",
  BD: "Bangladesh",
};

/**
 * Country-wise display: "Austin, TX" → "Austin, TX (United States)",
 * "London, UK" → "London, UK (United Kingdom)". Locations that already end
 * with a country name ("Dhaka, Bangladesh") or have no comma pass through.
 */
export function formatLocationWithCountry(location: string) {
  const parts = location
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const last = parts[parts.length - 1]?.toUpperCase() ?? "";
  if (US_STATE_CODES.has(last)) return `${location} (United States)`;
  if (COUNTRY_SUFFIXES[last]) return `${location} (${COUNTRY_SUFFIXES[last]})`;
  return location;
}

/**
 * Compact money/count: "130000" → "130k", "20.5k"; values under 1k and
 * non-numbers pass through unchanged. Plain string math keeps SSR and
 * client markup identical.
 */
export function formatCompact(value: string | number): string {
  const amount = Number(String(value).replace(/,/g, ""));
  if (!Number.isFinite(amount) || amount < 1000) return String(value);
  const thousands = amount / 1000;
  return `${Number.isInteger(thousands) ? thousands : thousands.toFixed(1)}k`;
}
