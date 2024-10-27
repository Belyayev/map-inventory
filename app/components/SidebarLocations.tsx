"use client";
import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { OrganizationType } from "@/app/types/organization";
import { LocationType } from "@/app/types/location";

interface SidebarLocationsProps {
  organization: OrganizationType | null;
  userEmail: string;
}

const SidebarLocations: React.FC<SidebarLocationsProps> = ({
  organization,
}) => {
  const [locations, setLocations] = React.useState<LocationType[]>([]);
  const [currentLocationItem, setCurrentLocationItem] =
    React.useState<LocationType | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);

  React.useEffect(() => {
    if (organization?._id) {
      fetch(
        `/api/locations/getLocationsByOrganization?organizationId=${organization._id}`
      )
        .then((response) => response.json())
        .then((data) => setLocations(data));
    }
  }, [organization?._id]);

  const handleCreateLocation = () => {
    if (organization?._id) {
      setShowForm(true);
      setIsEditMode(false);
      setCurrentLocationItem({
        _id: undefined,
        organizationId: organization._id.toString(), // Convert to string
        locationName: "",
        latitude: 0,
        longitude: 0,
        description: "",
        lastUpdated: "",
      });
    } else {
      alert("Organization ID is missing. Please try again.");
    }
  };

  const handleEditLocation = (item: LocationType) => {
    setShowForm(true);
    setIsEditMode(true);
    setCurrentLocationItem(item);
  };

  const handleFieldChange =
    (field: keyof LocationType) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (currentLocationItem) {
        setCurrentLocationItem({
          ...currentLocationItem,
          [field]:
            field === "latitude" || field === "longitude"
              ? parseFloat(e.target.value)
              : e.target.value,
        });
      }
    };

  const handleSubmit = async () => {
    if (!currentLocationItem) {
      alert("No location to submit. Please try again.");
      return;
    }

    const url = isEditMode
      ? `/api/locations/updateLocation`
      : `/api/locations/createLocation`;
    const method = isEditMode ? "PUT" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentLocationItem),
    });

    if (response.ok) {
      fetch(
        `/api/locations/getLocationsByOrganization?organizationId=${organization?._id}`
      )
        .then((response) => response.json())
        .then((data) => setLocations(data));
      setShowForm(false);
      setIsEditMode(false);
    } else {
      alert(`Failed to ${isEditMode ? "update" : "create"} location item.`);
    }
  };

  return (
    <ListItem className="organization-info">
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        alignItems="center"
      >
        <div>Locations List</div>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleCreateLocation}
        >
          Add
        </Button>
      </Box>
      {locations.length > 0 &&
        locations.map((item) => (
          <ListItem
            key={item._id?.toString()}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <ListItemText
              primary={item.locationName}
              secondary={`Lat: ${item.latitude}, Long: ${item.longitude}, Description: ${item.description}`}
            />
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => handleEditLocation(item)}
            >
              Edit
            </Button>
          </ListItem>
        ))}

      {showForm && (
        <form className="create-inventory-form">
          <h3>{isEditMode ? "Update Location" : "Create New Location"}</h3>
          <TextField
            label="Location Name"
            variant="outlined"
            fullWidth
            margin="dense"
            value={currentLocationItem?.locationName || ""}
            onChange={handleFieldChange("locationName")}
          />
          <Box display="flex" justifyContent="space-between">
            <TextField
              label="Latitude"
              variant="outlined"
              margin="dense"
              value={currentLocationItem?.latitude || ""}
              onChange={handleFieldChange("latitude")}
              style={{ marginRight: 8 }}
            />
            <TextField
              label="Longitude"
              variant="outlined"
              margin="dense"
              value={currentLocationItem?.longitude || ""}
              onChange={handleFieldChange("longitude")}
            />
          </Box>
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            margin="dense"
            multiline
            rows={2}
            value={currentLocationItem?.description || ""}
            onChange={handleFieldChange("description")}
          />
          <Box display="flex" justifyContent="space-between" width="100%">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              style={{ marginTop: "1rem" }}
            >
              {isEditMode ? "Update" : "Submit"}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setShowForm(false)}
              style={{ marginTop: "1rem" }}
            >
              Cancel
            </Button>
          </Box>
        </form>
      )}
    </ListItem>
  );
};

export default SidebarLocations;
