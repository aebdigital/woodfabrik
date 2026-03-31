import { LegacyPage } from "@/components/legacy-page";
import { createLegacyMetadata, loadLegacyDocument } from "@/lib/legacy-site";

const document = loadLegacyDocument("index.html");

export const metadata = createLegacyMetadata(document);

export default function HomePage() {
  return <LegacyPage document={document} />;
}
