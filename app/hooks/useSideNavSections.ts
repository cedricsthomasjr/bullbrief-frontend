"use client";

import { useEffect } from "react";
import { useSideNavContext, type SideNavSection } from "@/app/context/SideNavContext";

/**
 * Call this at the top of any page to register in-page sections with the
 * global side nav. The nav clears itself automatically when the page unmounts.
 */
export function useSideNavSections(
  items: SideNavSection[],
  accent = "#38bdf8",
) {
  const { setSections, clearSections } = useSideNavContext();

  useEffect(() => {
    setSections(items, accent);
    return () => clearSections();
    // Re-run only when item count or accent changes; labels/ids are stable per page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, accent]);
}
