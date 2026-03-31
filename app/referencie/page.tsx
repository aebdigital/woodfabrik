import { LegacyPage } from "@/components/legacy-page";
import { createLegacyMetadata, loadLegacyDocument } from "@/lib/legacy-site";

const document = loadLegacyDocument("pages/referencie.html");

export const metadata = createLegacyMetadata(document);

export default function ReferencesPage() {
  return <LegacyPage document={document} />;
}
