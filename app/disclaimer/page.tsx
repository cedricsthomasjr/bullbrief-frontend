import type { Metadata } from "next";
import LegalDocumentPage from "@/app/components/LegalDocumentPage";
import { disclaimerContent } from "@/app/lib/legalContent";

export const metadata: Metadata = {
  title: "Investment Disclaimer | BullBrief",
  description: "BullBrief investment, AI, and research disclaimer.",
};

export default function DisclaimerPage() {
  return <LegalDocumentPage document={disclaimerContent} />;
}
