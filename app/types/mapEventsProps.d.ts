import { LeafletMouseEvent } from "leaflet";

interface MapEventsProps {
  onRightClick: (event: LeafletMouseEvent) => void;
}
