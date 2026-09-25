import { Metadata, Viewport } from "next";

export const defaultWebsiteViewport: Viewport = {
  themeColor: "#09090B",
  maximumScale: 1,
  initialScale: 1,
  width: "device-width",
  userScalable: false,
};

export const defaultWebsiteMetadata: Metadata = {
  metadataBase: new URL("https://hetam.vercel.app"),
  title: "hetam - Create Beautiful & Professional Invoices",
  description:
    "hetam is a simple and easy to use invoice generator where you can create beautiful and professional invoices in minutes.",
  icons: {
    icon: "/official/hetam-logo.png",
  },
  openGraph: {
    images: "/official/og-banner.png",
  },
  keywords: ["hetam", "hetam.vercel.app"],
};

export interface IGenerateWebsiteMetadata {
  title: string;
  description?: string;
  image?: string;
  keywords?: string[];
}

export const generateWebsiteMetadata = ({
  title,
  description,
  image,
  keywords,
}: IGenerateWebsiteMetadata): Metadata => {
  return {
    ...defaultWebsiteMetadata,
    keywords: [...(defaultWebsiteMetadata.keywords || []), ...(keywords || [])],
    title: title || defaultWebsiteMetadata.title,
    description: description || defaultWebsiteMetadata.description,
    openGraph: {
      images: image || defaultWebsiteMetadata.openGraph?.images,
    },
  };
};
