import * as React from "react";
import {
  MapContainer,
  TileLayer,
  Popup,
  CircleMarker,
  useMapEvents,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { OrganizationType } from "../types/organization";
import { InventoryType } from "../types/inventory"; // Import the InventoryType interface
import { LocationType } from "../types/location";
import "./map.css";

interface MapComponentProps {
  organization: OrganizationType | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ organization }) => {
  const [inventory, setInventory] = React.useState<InventoryType[]>([]);
  const [locations, setLocations] = React.useState<LocationType[]>([]);
  const [showLocations, setShowLocations] = React.useState(false);
  const [showInventory, setShowInventory] = React.useState(true);
  const [zoom, setZoom] = React.useState(13);

  React.useEffect(() => {
    if (organization?._id) {
      fetch(
        `/api/inventory/getInventoryByOrganization?organizationId=${organization._id}`
      )
        .then((response) => response.json())
        .then((data) => setInventory(data));

      fetch(
        `/api/locations/getLocationsByOrganization?organizationId=${organization._id}`
      )
        .then((response) => response.json())
        .then((data) => setLocations(data));
    }
  }, [organization?._id]);

  const center: LatLngTuple = [
    organization?.latitude || 40.7128,
    organization?.longitude || -74.006, // Set coordinates of New York city by default
  ];

  // Ensure inventory is an array before mapping
  const coordinates = Array.isArray(inventory)
    ? inventory.map((item) => ({
        position: [item.latitude, item.longitude] as LatLngTuple,
        info: item.inventoryName,
      }))
    : [];

  const MapEvents = () => {
    useMapEvents({
      zoomend: (e) => {
        setZoom(e.target.getZoom());
      },
    });
    return null;
  };

  const getRadius = (zoomLevel: number) => {
    return zoomLevel * 1.5; // Adjust the multiplier as needed
  };

  return (
    <div className="map-container">
      <div
        style={{
          position: "absolute",
          top: "4.5rem",
          left: "3.5rem",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <button
          onClick={() => setShowLocations(!showLocations)}
          style={{
            padding: "5px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "12px",
          }}
        >
          {showLocations ? "Hide Locations" : "Show Locations"}
        </button>
        <button
          onClick={() => setShowInventory(!showInventory)}
          style={{
            padding: "5px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "12px",
          }}
        >
          {showInventory ? "Hide Inventory" : "Show Inventory"}
        </button>
      </div>
      <MapContainer
        key={center.toString()}
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
      >
        <MapEvents />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='<a href="https://belyayev.vercel.app">developed by:</a>'
        />
        {showInventory && (
          <MarkerClusterGroup>
            {coordinates.map((coord, idx) => (
              <CircleMarker
                key={idx}
                center={coord.position}
                radius={getRadius(zoom)}
                color="green"
                fillColor="lime"
                fillOpacity={0.5}
              >
                <Popup>{coord.info}</Popup>
              </CircleMarker>
            ))}
          </MarkerClusterGroup>
        )}
        {showLocations &&
          locations.map((location, idx) => (
            <CircleMarker
              key={idx}
              center={[location.latitude, location.longitude] as LatLngTuple}
              radius={getRadius(zoom)}
              color="blue"
              fillColor="blue"
              fillOpacity={0.5}
            >
              <Popup>{location.locationName}</Popup>
            </CircleMarker>
          ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
