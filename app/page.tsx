"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@clerk/nextjs";
// import dbConnect from "./utils/dbConnect";
import Header from "./components/Header";
// import Modal from "react-modal"; // import Modal

// Dynamically import the MapComponent
const MapComponent = dynamic(() => import("./components/MapComponent"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default function Home() {
  const { isLoaded } = useAuth();
  const [coordinates] = useState([
    { position: [50.92275, -114.09211], info: "Object 1" },
    { position: [50.92275, -114.09211], info: "Object 2" },
    { position: [50.92429, -114.08978], info: "Object 3" },
  ]);

  // useEffect(() => {
  //   const connectDb = async () => {
  //     try {
  //       await dbConnect();
  //       console.log("Database connected");
  //     } catch (error) {
  //       console.error("Database connection error:", error);
  //     }
  //   };
  //   connectDb();

  //   // Set the app element to avoid the warning on client-side only
  //   if (typeof document !== "undefined") {
  //     Modal.setAppElement(document.body);
  //   }
  // }, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const center = [50.92215, -114.09333]; // Shell gas station in Calgary, AB

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="map-container">
        <MapComponent center={center} coordinates={coordinates} />
      </div>
    </div>
  );
}
