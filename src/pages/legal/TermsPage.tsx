import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { legalDocuments } from "@/data/legal";

export default function TermsPage() {
  return <LegalDocumentView document={legalDocuments.terms} />;
}
