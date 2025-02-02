import type { Metadata } from "next";
import "@fontsource-variable/archivo";
import "./globals.css";
import Head from "next/head";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "motionly - Discovery motions drafted automagically",
  description: "Discovery motions drafted automagically",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="theme-color" content="#131E41" />
        </Head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
