import type { Metadata } from "next";
import LegalDocumentPage from "@/app/components/LegalDocumentPage";
import { privacyContent } from "@/app/lib/legalContent";

export const metadata: Metadata = {
  title: "Privacy Policy | BullBrief",
  description: "BullBrief Privacy Policy.",
};

export default function PrivacyPage() {
  return <LegalDocumentPage document={privacyContent} />;
}
