import type { Metadata } from "next";

export const DEFAULT_META_DESCRIPTION =
  "An open-source, curated directory of cybersecurity tools, commands, and structured learning paths.";

export function socialMetadata(
  title: string,
  description: string,
): Pick<Metadata, "openGraph" | "twitter"> {
  const image = {
    url: "/og-image.png",
    width: 1366,
    height: 640,
    alt: "CyberAtlas Tool Directory",
  };

  return {
    openGraph: {
      type: "website",
      siteName: "CyberAtlas Tool Directory",
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}