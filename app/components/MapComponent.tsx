import { LatLngTuple } from "leaflet";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Marker,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapComponentProps {
  center: LatLngTuple;
  coordinates: { position: LatLngTuple; info: string }[];
}

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

const MapComponent: React.FC<MapComponentProps> = ({ center, coordinates }) => {
  const clusters = getClusterData(coordinates);

  return (
    <div className="map-container">
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
        {clusters.map((cluster, idx) => {
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
      </MapContainer>
    </div>
  );
};

export default MapComponent;
