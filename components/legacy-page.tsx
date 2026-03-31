import type { LegacyDocument } from "@/lib/legacy-site";

type LegacyPageProps = {
  document: LegacyDocument;
};

export function LegacyPage({ document }: LegacyPageProps) {
  const mainClassName = document.bodyClassName
    ? `${document.bodyClassName} min-h-screen`
    : "min-h-screen";

  return (
    <>
      {document.jsonLdScripts.map((jsonLd, index) => (
        <script
          key={`${document.title}-jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      ))}
      <main
        className={mainClassName}
        dangerouslySetInnerHTML={{ __html: document.bodyHtml }}
      />
    </>
  );
}
