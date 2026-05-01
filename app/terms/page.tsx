import type { Metadata } from "next";
import LegalDocumentPage from "@/app/components/LegalDocumentPage";
import { termsContent } from "@/app/lib/legalContent";

export const metadata: Metadata = {
  title: "Terms of Service | BullBrief",
  description: "BullBrief Terms of Service and user obligations.",
};

export default function TermsPage() {
  return <LegalDocumentPage document={termsContent} />;
}
