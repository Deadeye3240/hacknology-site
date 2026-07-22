import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { legalDocuments } from "@/data/legal";

export default function PrivacyPage() {
  return <LegalDocumentView document={legalDocuments.privacy} />;
}
