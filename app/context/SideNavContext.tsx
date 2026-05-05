"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type SideNavSection = {
  id: string;
  label: string;
  /** If set, item navigates to this URL instead of scrolling. */
  href?: string;
};

type ContextValue = {
  sections: SideNavSection[];
  accent: string;
  setSections: (items: SideNavSection[], accent?: string) => void;
  clearSections: () => void;
};

const SideNavContext = createContext<ContextValue>({
  sections: [],
  accent: "#38bdf8",
  setSections: () => {},
  clearSections: () => {},
});

export function SideNavProvider({ children }: { children: ReactNode }) {
  const [sections, setSectionsState] = useState<SideNavSection[]>([]);
  const [accent, setAccent] = useState("#38bdf8");

  const setSections = useCallback(
    (items: SideNavSection[], color = "#38bdf8") => {
      setSectionsState(items);
      setAccent(color);
    },
    [],
  );

  const clearSections = useCallback(() => {
    setSectionsState([]);
    setAccent("#38bdf8");
  }, []);

  return (
    <SideNavContext.Provider value={{ sections, accent, setSections, clearSections }}>
      {children}
    </SideNavContext.Provider>
  );
}

export function useSideNavContext() {
  return useContext(SideNavContext);
}
