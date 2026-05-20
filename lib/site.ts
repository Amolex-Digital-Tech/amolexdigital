import type { Metadata } from "next";

export const LOGO_ASSET_PATH = "/brand/amolex-new.png";

export const siteConfig = {
  name: "Amolex Digital Tech",
  shortName: "Amolex",
  description:
    "Amolex Digital Tech builds intelligent software, AI systems, and scalable digital infrastructure for modern businesses.",
  url: "https://amolex.tech",
  ogImage: "/opengraph-image",
  links: {
    x: "https://x.com/amolextech",
    linkedin: "https://linkedin.com/company/amolex-digital-tech",
    github: "https://github.com/amolex-digital-tech"
  }
};

type MetadataInput = {
  title: string;
  description?: string;
  path?: string;
};

export function buildMetadata({
  title,
  description = siteConfig.description,
  path = ""
}: MetadataInput): Metadata {
  const canonicalUrl = `${siteConfig.url}${path}`;

  return {
    title,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: "en_US",
      type: "website",
      images: [siteConfig.ogImage]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteConfig.ogImage]
    }
  };
}
