export const EXPLORE_TITLE = "Explore";
export const EXPLORE_SUBHEAD =
  "A few places to start, then each sector ordered by market cap.";
export const WAY_IN_KICKER = "Start here";
export const PRESET_KICKER = "Compare a group";
export const MAP_KICKER = "Sectors";
export const LIVE_SECTOR_TITLE = "Largest by market cap";
export const STATIC_SECTOR_TITLE = "Companies in this sector";
export const OPEN_BRIEF = "Open Brief";
export const ADD_TO_COMPARE = "Add to Compare";
export const REMOVE_FROM_COMPARE = "Remove from Compare";
export const COMPARE_FULL = "Compare full";
export const LOAD_ERROR = "The sector lists could not be loaded.";
export const COMPARE_TRAY_ONE = "1 name staged. Add another to compare side by side.";
export const COMPARE_TRAY_OPEN = "Open Compare";

export function compareTrayMany(count: number): string {
  return `${count} names staged for Compare.`;
}

export function sectorTitle(source: "fmp" | "static"): string {
  return source === "fmp" ? LIVE_SECTOR_TITLE : STATIC_SECTOR_TITLE;
}
