import type { Metadata } from "next";
import ExploreView from "@/app/components/explore/ExploreView";

export const metadata: Metadata = {
  title: "Explore — BullBrief",
  description: "Start from a known company, or browse each sector by market cap.",
};

export default function ExplorePage() {
  return <ExploreView />;
}
