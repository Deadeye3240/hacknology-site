/** A section within a legal document (Terms, Privacy, etc.). */
export interface LegalSection {
  id: string;
  title: string;
  paragraphs: string[];
  list?: string[];
}

/** Static legal page content rendered at /terms, /privacy, etc. */
export interface LegalDocument {
  slug: string;
  title: string;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
}
