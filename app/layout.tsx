import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import dotenv from "dotenv";
import "./globals.css";

dotenv.config();

export const metadata: Metadata = {
  title: "My map",
  description: "My map free",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider publishableKey={process.env.CLERK_API_KEY}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
