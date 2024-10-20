"use client";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@clerk/nextjs";
import dbConnect from "./utils/dbConnect";

// Dynamically import the MapComponent
const MapComponent = dynamic(() => import("./components/MapComponent"), {
  ssr: false,
});

export default function Home() {
  const { isLoaded } = useAuth();

  useEffect(() => {
    const connectDb = async () => {
      await dbConnect();
    };
    connectDb();
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const center: [number, number] = [50.92215, -114.09333]; // Shell gas station in Calgary, AB

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <MapComponent center={center} />
    </div>
  );
}
