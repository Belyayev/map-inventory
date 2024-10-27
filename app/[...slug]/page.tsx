"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@clerk/nextjs";
import Header from "../../app/components/Header"; // Adjust the path based on your directory structure
import { LatLngTuple } from "leaflet"; // Import the LatLngTuple type
import { OrganizationType } from "../types/organization";

const MapComponent = dynamic(
  () => import("../../app/components/MapComponent"),
  {
    ssr: false,
    loading: () => (
      <div className="loading-container">
        <div className="loading-text">Loading Map...</div>
      </div>
    ),
  }
);

interface DynamicPageProps {
  params: {
    slug: string[];
  };
}

const DynamicPage: React.FC<DynamicPageProps> = ({ params }) => {
  const { isLoaded } = useAuth();
  const [coordinates] = useState<{ position: LatLngTuple; info: string }[]>([
    { position: [50.92275, -114.09211], info: "Object 1" },
    { position: [50.92275, -114.09211], info: "Object 2" },
    { position: [50.92429, -114.08978], info: "Object 3" },
  ]);
  const [organization, setOrganization] = useState<OrganizationType | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const slug = params.slug || [];
    if (slug.length === 0) {
      // Redirect to a default page if the slug is missing
      router.push("/");
      return;
    }
    console.log("Current slug: ", slug); // Debugging
    const fetchOrganization = async () => {
      if (slug.length === 0) {
        setLoading(false);
        return;
      }
      const orgName = slug[0]; // Assuming the orgName is the first part of the slug
      try {
        console.log("Fetching organization:", orgName); // Debugging
        const response = await fetch(`/api/organizations/${orgName}`);
        if (response.ok) {
          const data = await response.json();
          setOrganization(data);
        } else {
          console.log("Organization not found."); // Debugging
          setOrganization(null); // Ensure it doesn’t cause a redirect
        }
      } catch (error) {
        console.error("Error fetching organization:", error);
        setOrganization(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrganization();
  }, [params.slug, router]);

  if (loading || !isLoaded) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  const center: LatLngTuple = [50.92215, -114.09333]; // Shell gas station in Calgary, AB

  return (
    <div className="min-h-screen flex flex-col">
      <Header organization={organization} />
      <div className="map-container">
        <MapComponent
          center={center}
          coordinates={coordinates}
          organization={organization}
        />
      </div>
    </div>
  );
};

export default DynamicPage;
