"use client";
import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { OrganizationType } from "@/app/types/organization";
import { InventoryType } from "@/app/types/inventory"; // Import the InventoryType interface

interface SidebarInventoryProps {
  organization: OrganizationType | null;
  userEmail: string;
}

const SidebarInventory: React.FC<SidebarInventoryProps> = ({
  organization,
}) => {
  const [inventory, setInventory] = React.useState<InventoryType[]>([]);
  const [currentInventoryItem, setCurrentInventoryItem] =
    React.useState<InventoryType | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);

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
      setShowForm(true);
      setIsEditMode(false);
      setCurrentInventoryItem({
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

  const handleEditInventory = (item: InventoryType) => {
    setShowForm(true);
    setIsEditMode(true);
    setCurrentInventoryItem(item);
  };

  const handleFieldChange =
    (field: keyof InventoryType) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (currentInventoryItem) {
        setCurrentInventoryItem({
          ...currentInventoryItem,
          [field]:
            field === "latitude" || field === "longitude"
              ? parseFloat(e.target.value)
              : e.target.value,
        });
      }
    };

  const handleSubmit = async () => {
    if (!currentInventoryItem) {
      alert("No inventory item to submit. Please try again.");
      return;
    }

    const url = isEditMode
      ? `/api/inventory/updateInventory`
      : `/api/inventory/createInventory`;
    const method = isEditMode ? "PUT" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentInventoryItem),
    });

    if (response.ok) {
      fetch(
        `/api/inventory/getInventoryByOrganization?organizationId=${organization?._id}`
      )
        .then((response) => response.json())
        .then((data) => setInventory(data));
      setShowForm(false);
      setIsEditMode(false);
    } else {
      alert(`Failed to ${isEditMode ? "update" : "create"} inventory item.`);
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
          <ListItem
            key={item._id?.toString()}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <ListItemText
              primary={item.inventoryName}
              secondary={`Lat: ${item.latitude}, Long: ${item.longitude}, Description: ${item.description}`}
            />
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => handleEditInventory(item)}
            >
              Edit
            </Button>
          </ListItem>
        ))}

      {showForm && (
        <form className="create-inventory-form">
          <h3>
            {isEditMode ? "Update Inventory Item" : "Create New Inventory Item"}
          </h3>
          <TextField
            label="Inventory Name"
            variant="outlined"
            fullWidth
            margin="dense"
            value={currentInventoryItem?.inventoryName || ""}
            onChange={handleFieldChange("inventoryName")}
          />
          <Box display="flex" justifyContent="space-between">
            <TextField
              label="Latitude"
              variant="outlined"
              margin="dense"
              value={currentInventoryItem?.latitude || ""}
              onChange={handleFieldChange("latitude")}
              style={{ marginRight: 8 }}
            />
            <TextField
              label="Longitude"
              variant="outlined"
              margin="dense"
              value={currentInventoryItem?.longitude || ""}
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
            value={currentInventoryItem?.description || ""}
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

export default SidebarInventory;
