// react-leaflet-markercluster.d.ts
declare module "react-leaflet-markercluster" {
  import { ReactNode } from "react";

  interface MarkerClusterGroupProps {
    children?: ReactNode;
    // other props...
  }

  const MarkerClusterGroup: React.ComponentType<MarkerClusterGroupProps>;
  export default MarkerClusterGroup;
}
