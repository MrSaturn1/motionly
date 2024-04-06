import type { Metadata } from "next";
import "@fontsource-variable/archivo";
import "./globals.css";

export const metadata: Metadata = {
  title: "Motionly",
  description: "Drafts discovery motion with a simply click",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
