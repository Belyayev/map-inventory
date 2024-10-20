"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@clerk/nextjs";
import dbConnect from "./utils/dbConnect";
import Header from "./components/Header";

// Dynamically import the MapComponent
const MapComponent = dynamic(() => import("./components/MapComponent"), {
  ssr: false,
});

export default function Home() {
  const { isLoaded } = useAuth();
  const [coordinates] = useState<
    { position: [number, number]; info: string }[]
  >([
    { position: [50.92275, -114.09211], info: "Object 1" },
    { position: [50.92275, -114.09211], info: "Object 2" },
    { position: [50.92429, -114.08978], info: "Object 3" },
    // Add more objects as needed
  ]);

  useEffect(() => {
    const connectDb = async () => {
      await dbConnect();
      // Future fetching of coordinates from database can go here
    };
    connectDb();
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const center: [number, number] = [50.92215, -114.09333]; // Shell gas station in Calgary, AB

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="map-container">
        <MapComponent center={center} coordinates={coordinates} />
      </div>
    </div>
  );
}
