import { LegacyPage } from "@/components/legacy-page";
import { createLegacyMetadata, loadLegacyDocument } from "@/lib/legacy-site";

const document = loadLegacyDocument("pages/produkty-sluzby.html");

export const metadata = createLegacyMetadata(document);

export default function ProductsPage() {
  return <LegacyPage document={document} />;
}
