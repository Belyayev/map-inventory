"use client";
import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "./sidebar.css"; // Import the CSS file
import { OrganizationType } from "@/app/types/organization";
import { InventoryType } from "@/app/types/inventory"; // Import the InventoryType interface

interface SidebarInventoryProps {
  userEmail: string;
  organization: OrganizationType | null;
}

const SidebarInventory: React.FC<SidebarInventoryProps> = ({
  organization,
}) => {
  const [inventory, setInventory] = React.useState<InventoryType[]>([]);
  const [newInventoryItem, setNewInventoryItem] =
    React.useState<InventoryType | null>(null);
  const [showCreateForm, setShowCreateForm] = React.useState(false);

  React.useEffect(() => {
    if (organization?._id) {
      fetch(
        `/api/inventory/getInventoryByOrganization?organizationId=${organization._id}`
      )
        .then((response) => response.json())
        .then((data) => setInventory(data));
    }
  }, [organization?._id]);

  const handleCreateInventory = () => {
    if (organization?._id) {
      setShowCreateForm(true);
      setNewInventoryItem({
        _id: undefined,
        organizationId: organization._id.toString(), // Convert to string
        inventoryName: "",
        latitude: 0,
        longitude: 0,
        description: "",
        lastUpdated: "",
      });
    } else {
      alert("Organization ID is missing. Please try again.");
    }
  };

  const handleFieldChange =
    (field: keyof InventoryType) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (newInventoryItem) {
        setNewInventoryItem({
          ...newInventoryItem,
          [field]:
            field === "latitude" || field === "longitude"
              ? parseFloat(e.target.value)
              : e.target.value,
        });
      }
    };

  const handleSubmit = async () => {
    if (!newInventoryItem) {
      alert("No inventory item to submit. Please try again.");
      return;
    }

    const response = await fetch(`/api/inventory/createInventory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newInventoryItem),
    });

    if (response.ok) {
      fetch(
        `/api/inventory/getInventoryByOrganization?organizationId=${organization?._id}`
      )
        .then((response) => response.json())
        .then((data) => setInventory(data));
      setShowCreateForm(false);
    } else {
      alert("Failed to create inventory item.");
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
        <div>Inventory List</div>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleCreateInventory}
        >
          Add
        </Button>
      </Box>
      {inventory.length > 0 &&
        inventory.map((item) => (
          <ListItem key={item._id?.toString()}>
            <ListItemText
              primary={item.inventoryName}
              secondary={`Lat: ${item.latitude}, Long: ${item.longitude}, Description: ${item.description}`}
            />
          </ListItem>
        ))}

      {showCreateForm && (
        <form className="create-inventory-form">
          <h3>Create New Inventory Item</h3>
          <TextField
            label="Inventory Name"
            variant="outlined"
            fullWidth
            margin="dense"
            value={newInventoryItem?.inventoryName || ""}
            onChange={handleFieldChange("inventoryName")}
          />
          <Box display="flex" justifyContent="space-between">
            <TextField
              label="Latitude"
              variant="outlined"
              margin="dense"
              value={newInventoryItem?.latitude || ""}
              onChange={handleFieldChange("latitude")}
              style={{ marginRight: 8 }}
            />
            <TextField
              label="Longitude"
              variant="outlined"
              margin="dense"
              value={newInventoryItem?.longitude || ""}
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
            value={newInventoryItem?.description || ""}
            onChange={handleFieldChange("description")}
          />
          <Box display="flex" justifyContent="space-between" width="100%">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              style={{ marginTop: "1rem" }}
            >
              Submit
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setShowCreateForm(false)}
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

export default SidebarInventory;
