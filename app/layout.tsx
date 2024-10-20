import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import dotenv from "dotenv";
import "./globals.css";

dotenv.config();

export const metadata: Metadata = {
  title: "Map Inventory",
  description: "Add objects like inventory on the map",
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
