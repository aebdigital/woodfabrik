import { LegacyPage } from "@/components/legacy-page";
import { createLegacyMetadata, loadLegacyDocument } from "@/lib/legacy-site";

const document = loadLegacyDocument("pages/kontakt.html");

export const metadata = createLegacyMetadata(document);

export default function ContactPage() {
  return <LegacyPage document={document} />;
}
