
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BeaverTek Email Test",
  description: "Testing BeaverTek email integration",
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
