import * as React from "react";
import { LatLngTuple } from "leaflet";
import { MapContainer, TileLayer, Popup, Marker, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { OrganizationType } from "../types/organization";
import { InventoryType } from "../types/inventory"; // Import the InventoryType interface
import { LocationType } from "../types/location";

interface MapComponentProps {
  organization: OrganizationType | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ organization }) => {
  const [inventory, setInventory] = React.useState<InventoryType[]>([]);
  const [locations, setLocations] = React.useState<LocationType[]>([]);
  const [showLocations, setShowLocations] = React.useState(false);
  const [showInventory, setShowInventory] = React.useState(true);

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

  const getClusterData = (
    coordinates: { position: LatLngTuple; info: string }[]
  ) => {
    const clusters: {
      [key: string]: { position: LatLngTuple; count: number; items: string[] };
    } = {};

    coordinates.forEach((coord) => {
      const key = `${coord.position[0]}-${coord.position[1]}`;
      if (!clusters[key]) {
        clusters[key] = { position: coord.position, count: 0, items: [] };
      }
      clusters[key].count += 1;
      clusters[key].items.push(coord.info);
    });

    return Object.values(clusters);
  };

  // Ensure inventory is an array before mapping
  const coordinates = Array.isArray(inventory)
    ? inventory.map((item) => ({
        position: [item.latitude, item.longitude] as LatLngTuple,
        info: item.inventoryName,
      }))
    : [];

  const clusters = getClusterData(coordinates);

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
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {showInventory &&
          clusters.map((cluster, idx) => {
            const icon = L.divIcon({
              html: `<div style="background-color: lime; border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; color: black; font-weight: bold; font-size: 25px">${cluster.count}</div>`,
              className: "",
            });

            return (
              <Marker key={idx} position={cluster.position} icon={icon}>
                <Popup>
                  <div>
                    <ul>
                      {cluster.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        {showLocations &&
          locations.map((location, idx) => (
            <Circle
              key={idx}
              center={[location.latitude, location.longitude] as LatLngTuple}
              radius={200} // Adjust the radius as needed
              pathOptions={{
                color: "transparent",
                fillColor: "blue",
                fillOpacity: 0.2, // Adjust the opacity as needed
              }}
            />
          ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
