"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@clerk/nextjs";
import Header from "./components/Header";
import { LatLngTuple } from "leaflet"; // Import the LatLngTuple type

// Dynamically import the MapComponent
const MapComponent = dynamic(() => import("./components/MapComponent"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default function Home() {
  const { isLoaded } = useAuth();
  const [coordinates] = useState<{ position: LatLngTuple; info: string }[]>([
    { position: [50.92275, -114.09211], info: "Object 1" },
    { position: [50.92275, -114.09211], info: "Object 2" },
    { position: [50.92429, -114.08978], info: "Object 3" },
  ]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const center: LatLngTuple = [50.92215, -114.09333]; // Shell gas station in Calgary, AB

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="map-container">
        <MapComponent center={center} coordinates={coordinates} />
      </div>
    </div>
  );
}
