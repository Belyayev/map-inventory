import * as React from "react";
import {
  MapContainer,
  TileLayer,
  Popup,
  CircleMarker,
  useMapEvents,
  Marker,
} from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { LatLngTuple, LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { OrganizationType } from "../types/organization";
import { InventoryType } from "../types/inventory"; // Import the InventoryType interface
import { LocationType } from "../types/location";
import ContextMenu from "./ContextMenu";
import "./map.css";
import { DraggableMarkerProps } from "../types/draggableMarkerProps";
import { MapEventsProps } from "../types/mapEventsProps";

interface MapComponentProps {
  organization: OrganizationType | null;
}

const createCircleIcon = (color: unknown) => {
  return L.divIcon({
    className: "custom-circle-icon",
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: solid green 2px"></div>`,
  });
};

const DraggableMarker = ({
  position,
  info,
  color,
  onDragEnd,
}: DraggableMarkerProps) => {
  return (
    <Marker
      position={position}
      icon={createCircleIcon(color)}
      draggable={true}
      eventHandlers={{
        dragend: (event) => {
          const newPos = event.target.getLatLng();
          onDragEnd(newPos);
        },
      }}
    >
      <Popup>{info}</Popup>
    </Marker>
  );
};

const onMarkerDragEnd = (idx: number, newPos: unknown) => {
  console.log(idx);
  console.log(newPos);
  // const updatedCoordinates = [...coordinates];
  // updatedCoordinates[idx].position = [newPos.lat, newPos.lng];
  // setCoordinates(updatedCoordinates);

  // // Call your API to update the coordinates
  // fetch(`/api/updateCoordinates`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     id: coordinates[idx].id,
  //     latitude: newPos.lat,
  //     longitude: newPos.lng,
  //   }),
  // });
};

// const ContextMenu = ({ position, onAddInventory, onAddLocation }) => {
//   return (
//     <div
//       style={{
//         position: "absolute",
//         display: "flex",
//         flexDirection: "column",
//         top: position.y,
//         left: position.x,
//         backgroundColor: "white",
//         border: "1px solid #ccc",
//         zIndex: 1000,
//       }}
//     >
//       <button onClick={onAddInventory}>Add Inventory</button>
//       <button onClick={onAddLocation}>Add Location</button>
//     </div>
//   );
// };

const MapComponent: React.FC<MapComponentProps> = ({ organization }) => {
  const [contextMenu, setContextMenu] = React.useState(null);
  const [inventory, setInventory] = React.useState<InventoryType[]>([]);
  const [locations, setLocations] = React.useState<LocationType[]>([]);
  const [showLocations, setShowLocations] = React.useState(false);
  const [showInventory, setShowInventory] = React.useState(true);
  const [zoom, setZoom] = React.useState(13);

  const MapEvents = ({ onRightClick }: MapEventsProps) => {
    useMapEvents({
      zoomend: (e) => {
        setZoom(e.target.getZoom());
      },
      contextmenu: (event) => {
        onRightClick(event);
      },
    });
    return null;
  };

  const handleRightClick = (event: LeafletMouseEvent) => {
    setContextMenu({
      x: event.containerPoint.x,
      y: event.containerPoint.y,
      latlng: event.latlng,
    });
  };

  const handleAddInventory = () => {
    // Add inventory at contextMenu.latlng
    setContextMenu(null);
  };

  const handleAddLocation = () => {
    // Add location at contextMenu.latlng
    setContextMenu(null);
  };

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
        <MapEvents onRightClick={handleRightClick} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='<a href="https://belyayev.vercel.app">developed by:</a>'
        />
        {showInventory && (
          <MarkerClusterGroup>
            {coordinates.map((coord, idx) => (
              <DraggableMarker
                key={idx}
                position={coord.position}
                info={coord.info}
                color="lime"
                onDragEnd={(newPos: unknown) => onMarkerDragEnd(idx, newPos)}
              />
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
      {contextMenu && (
        <ContextMenu
          position={contextMenu}
          onAddInventory={handleAddInventory}
          onAddLocation={handleAddLocation}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};

export default MapComponent;
