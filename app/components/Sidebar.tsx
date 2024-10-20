import * as React from "react";
import { useUser } from "@clerk/nextjs";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";

interface SidebarProps {
  open: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, toggleSidebar }) => {
  const { user } = useUser();
  const [organizationName, setOrganizationName] = React.useState("");
  const [latitude, setLatitude] = React.useState("");
  const [longitude, setLongitude] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [adminEmails, setAdminEmails] = React.useState("");
  const [organizations, setOrganizations] = React.useState([]);

  React.useEffect(() => {
    if (open && user) {
      fetch(
        `/api/organizations/getOrganizations?userEmail=${user.primaryEmailAddress}`
      )
        .then((response) => response.json())
        .then((data) => setOrganizations(data));
    }
  }, [open, user]);

  const handleCreate = async () => {
    const data = {
      organizationName,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      description,
      admins: adminEmails.split(",").map((email) => email.trim()),
    };

    const response = await fetch("/api/organizations/addNewOrganization", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Organization created successfully!");
    } else {
      alert("Failed to create organization.");
    }
  };

  return (
    <Drawer anchor="left" open={open} onClose={toggleSidebar}>
      <List>
        {user && (
          <ListItem>
            <ListItemText primary={`User: ${user.primaryEmailAddress}`} />
          </ListItem>
        )}
        {organizations.length === 0 ? (
          <ListItem>
            <ListItemText primary="You currently do not admin any organizations." />
          </ListItem>
        ) : (
          <ListItem>
            <TextField
              select
              label="Select Organization"
              variant="outlined"
              fullWidth
              margin="normal"
            >
              {organizations.map((org) => (
                <MenuItem key={org._id} value={org.organizationName}>
                  {org.organizationName}
                </MenuItem>
              ))}
            </TextField>
          </ListItem>
        )}
        <ListItem>
          <form style={{ width: "100%" }}>
            <h3>Organization Information</h3>
            <TextField
              label="Organization Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
            />
            <TextField
              label="Latitude"
              variant="outlined"
              fullWidth
              margin="normal"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
            <TextField
              label="Longitude"
              variant="outlined"
              fullWidth
              margin="normal"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <TextField
              label="Admin Emails (comma-separated)"
              variant="outlined"
              fullWidth
              margin="normal"
              value={adminEmails}
              onChange={(e) => setAdminEmails(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreate}
              style={{ marginTop: "1rem" }}
            >
              Create
            </Button>
          </form>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
