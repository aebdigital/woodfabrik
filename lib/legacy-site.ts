import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";

export type LegacyDocument = {
  bodyClassName: string;
  bodyHtml: string;
  canonical: string;
  description: string;
  jsonLdScripts: string[];
  keywords: string;
  ogDescription: string;
  ogImage: string;
  ogLocale: string;
  ogSiteName: string;
  ogTitle: string;
  ogUrl: string;
  title: string;
  twitterDescription: string;
  twitterImage: string;
  twitterTitle: string;
  twitterUrl: string;
};

const documentCache = new Map<string, LegacyDocument>();

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchMeta(html: string, attribute: string, value: string) {
  const escapedValue = escapeRegExp(value);
  const directPattern = new RegExp(
    `<meta[^>]*${attribute}=["']${escapedValue}["'][^>]*content=["']([^"']*)["'][^>]*>`,
    "i",
  );
  const reversePattern = new RegExp(
    `<meta[^>]*content=["']([^"']*)["'][^>]*${attribute}=["']${escapedValue}["'][^>]*>`,
    "i",
  );

  return html.match(directPattern)?.[1] ?? html.match(reversePattern)?.[1] ?? "";
}

function matchLink(html: string, rel: string) {
  const escapedRel = escapeRegExp(rel);
  const directPattern = new RegExp(
    `<link[^>]*rel=["']${escapedRel}["'][^>]*href=["']([^"']*)["'][^>]*>`,
    "i",
  );
  const reversePattern = new RegExp(
    `<link[^>]*href=["']([^"']*)["'][^>]*rel=["']${escapedRel}["'][^>]*>`,
    "i",
  );

  return html.match(directPattern)?.[1] ?? html.match(reversePattern)?.[1] ?? "";
}

function cleanBodyHtml(html: string) {
  const bodyMatch = html.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) {
    throw new Error("Could not find <body> in legacy document.");
  }

  const bodyAttributes = bodyMatch[1] ?? "";
  const bodyClassName = bodyAttributes.match(/class=["']([^"']+)["']/i)?.[1] ?? "";

  const bodyHtml = bodyMatch[2]
    .replace(/<div id="navigation-container"><\/div>\s*/i, "")
    .replace(/<div id="footer-container"><\/div>\s*/i, "")
    .replace(/<script[\s\S]*?<\/script>\s*/gi, "")
    .replace(/(src|href)=["'](?:\.\.\/)?sources\//gi, '$1="/sources/')
    .replace(
      /(src|href)=["'](?:\.\.\/)?grift-geometric-typeface\//gi,
      '$1="/grift-geometric-typeface/',
    )
    .replace(/href=["']pages\/referencie\.html["']/gi, 'href="/referencie"')
    .replace(
      /href=["']pages\/produkty-sluzby\.html["']/gi,
      'href="/produkty-sluzby"',
    )
    .replace(/href=["']pages\/kontakt\.html["']/gi, 'href="/kontakt"')
    .replace(/href=["']\.\.\/contact-form\.php["']/gi, 'href="/kontakt"')
    .trim();

  return { bodyClassName, bodyHtml };
}

export function loadLegacyDocument(relativePath: string) {
  const cached = documentCache.get(relativePath);
  if (cached) {
    return cached;
  }

  const absolutePath = path.join(process.cwd(), relativePath);
  const html = fs.readFileSync(absolutePath, "utf8");
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "";
  const { bodyClassName, bodyHtml } = cleanBodyHtml(html);
  const jsonLdScripts = Array.from(
    html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi),
  ).map((match) => match[1].trim());

  const document: LegacyDocument = {
    bodyClassName,
    bodyHtml,
    canonical: matchLink(html, "canonical"),
    description: matchMeta(html, "name", "description"),
    jsonLdScripts,
    keywords: matchMeta(html, "name", "keywords"),
    ogDescription: matchMeta(html, "property", "og:description"),
    ogImage: matchMeta(html, "property", "og:image"),
    ogLocale: matchMeta(html, "property", "og:locale"),
    ogSiteName: matchMeta(html, "property", "og:site_name"),
    ogTitle: matchMeta(html, "property", "og:title"),
    ogUrl: matchMeta(html, "property", "og:url"),
    title,
    twitterDescription: matchMeta(html, "property", "twitter:description"),
    twitterImage: matchMeta(html, "property", "twitter:image"),
    twitterTitle: matchMeta(html, "property", "twitter:title"),
    twitterUrl: matchMeta(html, "property", "twitter:url"),
  };

  documentCache.set(relativePath, document);
  return document;
}

export function createLegacyMetadata(document: LegacyDocument): Metadata {
  return {
    title: document.title,
    description: document.description,
    keywords: document.keywords,
    alternates: document.canonical ? { canonical: document.canonical } : undefined,
    openGraph: {
      type: "website",
      url: document.ogUrl || document.canonical || undefined,
      title: document.ogTitle || document.title,
      description: document.ogDescription || document.description,
      locale: document.ogLocale || "sk_SK",
      siteName: document.ogSiteName || "Woodfabrik",
      images: document.ogImage ? [{ url: document.ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: document.twitterTitle || document.ogTitle || document.title,
      description:
        document.twitterDescription || document.ogDescription || document.description,
      images:
        document.twitterImage || document.ogImage
          ? [document.twitterImage || document.ogImage]
          : undefined,
    },
  };
}
