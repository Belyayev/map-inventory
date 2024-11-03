import { LatLngTuple } from "leaflet";

interface DraggableMarkerProps {
  position: LatLngTuple;
  info: string;
  color: string;
  onDragEnd: (newPos: LatLngTuple) => void;
}
