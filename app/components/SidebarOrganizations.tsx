import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { Organization } from "@/app/types/organization";

interface SidebarOrganizationsProps {
  userEmail: string;
}

const SidebarOrganizations: React.FC<SidebarOrganizationsProps> = ({
  userEmail,
}) => {
  const [organizationName, setOrganizationName] = React.useState("");
  const [latitude, setLatitude] = React.useState("");
  const [longitude, setLongitude] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [newAdminEmail, setNewAdminEmail] = React.useState("");
  const [organizations, setOrganizations] = React.useState<Organization[]>([]);
  const [admins, setAdmins] = React.useState<string[]>([userEmail]);
  const [buttonLabel, setButtonLabel] = React.useState("Create");

  React.useEffect(() => {
    fetch(`/api/organizations/getOrganizations?userEmail=${userEmail}`)
      .then((response) => response.json())
      .then((data) => setOrganizations(data));
  }, [userEmail]);

  const handleCreateOrUpdate = async () => {
    const data = {
      organizationName,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      description,
      admins,
    };

    const response = await fetch(`/api/organizations/addNewOrganization`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert(`${buttonLabel} successful!`);
    } else {
      alert(`Failed to ${buttonLabel.toLowerCase()} organization.`);
    }
  };

  const handleAddAdmin = () => {
    if (newAdminEmail && !admins.includes(newAdminEmail)) {
      setAdmins([...admins, newAdminEmail]);
      setNewAdminEmail("");
    }
  };

  const handleRemoveAdmin = (emailToRemove: string) => {
    if (emailToRemove !== userEmail) {
      setAdmins(admins.filter((email) => email !== emailToRemove));
    }
  };

  const handleOrganizationSelect = (organizationName: string) => {
    const selectedOrg = organizations.find(
      (org) => org.organizationName === organizationName
    );
    if (selectedOrg) {
      setOrganizationName(selectedOrg.organizationName);
      setLatitude(selectedOrg.latitude.toString());
      setLongitude(selectedOrg.longitude.toString());
      setDescription(selectedOrg.description);
      setAdmins(selectedOrg.admins);
      setButtonLabel("Update");
    }
  };

  React.useEffect(() => {
    if (
      !organizations.find((org) => org.organizationName === organizationName)
    ) {
      setButtonLabel("Create");
    }
  }, [organizationName]);

  return (
    <>
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
            margin="dense"
            onChange={(e) => handleOrganizationSelect(e.target.value)}
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
            margin="dense"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
          />
          <Box display="flex" justifyContent="space-between">
            <TextField
              label="Latitude"
              variant="outlined"
              margin="dense"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              style={{ marginRight: 8 }}
            />
            <TextField
              label="Longitude"
              variant="outlined"
              margin="dense"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </Box>
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            margin="dense"
            multiline
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <h4>Admins</h4>
          <Box display="flex" flexWrap="wrap" mb={2}>
            {admins.map((email) => (
              <Chip
                key={email}
                label={email}
                onDelete={() => handleRemoveAdmin(email)}
                color="primary"
                variant="outlined"
                style={{ margin: 2 }}
                disabled={email === userEmail}
              />
            ))}
          </Box>
          <Box display="flex" alignItems="center">
            <TextField
              label="Add Admin Email"
              variant="outlined"
              fullWidth
              margin="dense"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              style={{ marginRight: 8 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddAdmin}
              style={{ height: "56px" }}
            >
              Add
            </Button>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateOrUpdate}
            style={{ marginTop: "1rem" }}
          >
            {buttonLabel}
          </Button>
        </form>
      </ListItem>
    </>
  );
};

export default SidebarOrganizations;
