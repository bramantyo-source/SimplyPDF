import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DocConverter - Document to PDF",
  description: "Fast, secure, and high-quality conversion for all your documents. Convert Word, Excel, and PowerPoint files to PDF instantly.",
  keywords: ["document converter", "word to pdf", "docx to pdf", "excel to pdf", "online converter"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
