import { LatLngTuple } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default marker icon issue in React-Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapComponentProps {
  center: LatLngTuple;
  coordinates: { position: LatLngTuple; info: string }[];
}

const MapComponent: React.FC<MapComponentProps> = ({ center, coordinates }) => {
  return (
    <MapContainer
      key={center.toString()}
      center={center}
      zoom={13}
      style={{ height: "100vh", width: "100vw" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {coordinates.map((coord, idx) => (
        <Marker key={idx} position={coord.position}>
          <Popup>
            {coordinates
              .filter(
                (c) =>
                  c.position[0] === coord.position[0] &&
                  c.position[1] === coord.position[1]
              )
              .map((c, i) => (
                <div key={i}>{c.info}</div>
              ))}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
