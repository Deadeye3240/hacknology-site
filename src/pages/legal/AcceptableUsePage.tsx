import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { legalDocuments } from "@/data/legal";

export default function AcceptableUsePage() {
  return <LegalDocumentView document={legalDocuments.acceptableUse} />;
}
