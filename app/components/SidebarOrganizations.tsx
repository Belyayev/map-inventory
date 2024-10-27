"use client";
import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { OrganizationType } from "@/app/types/organization";
import TextField from "@mui/material/TextField";

interface SidebarOrganizationsProps {
  userEmail: string;
}

const SidebarOrganizations: React.FC<SidebarOrganizationsProps> = ({
  userEmail,
}) => {
  const [organization, setOrganization] =
    React.useState<OrganizationType | null>(null);
  const [newAdminEmail, setNewAdminEmail] = React.useState("");
  const [admins, setAdmins] = React.useState<string[]>([userEmail]);
  const [showCreateForm, setShowCreateForm] = React.useState(false);

  React.useEffect(() => {
    fetch(`/api/organizations/getOrganizationByUser?userEmail=${userEmail}`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setOrganization(data);
          setAdmins(data.admins);
        } else {
          setOrganization({
            _id: "",
            organizationName: "",
            owner: "",
            latitude: 0,
            longitude: 0,
            description: "",
            admins: [userEmail],
          });
        }
      });
  }, [userEmail]);

  const handleCreateOrganization = () => {
    setShowCreateForm(true);
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

  const handleCreateOrUpdate = async () => {
    const data = {
      organizationName: organization?.organizationName || "",
      latitude: organization?.latitude || 0,
      longitude: organization?.longitude || 0,
      description: organization?.description || "",
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
      alert("Create successful!");
      setShowCreateForm(false);
    } else {
      alert("Failed to create organization.");
    }
  };

  return (
    <>
      {organization && organization.organizationName ? (
        <ListItem className="organization-info">
          <ListItemText primary="Organization Information" />
          <ListItemText primary={`Name: ${organization.organizationName}`} />
          <ListItemText primary={`Latitude: ${organization.latitude}`} />
          <ListItemText primary={`Longitude: ${organization.longitude}`} />
          <ListItemText primary={`Description: ${organization.description}`} />
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
        </ListItem>
      ) : (
        <ListItem className="no-organization">
          <ListItemText primary="This user does not own any organizations" />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateOrganization}
          >
            Create Organization
          </Button>
        </ListItem>
      )}
      {showCreateForm && (
        <ListItem>
          <form className="create-organization-form">
            <h3>Create New Organization</h3>
            <TextField
              label="Organization Name"
              variant="outlined"
              fullWidth
              margin="dense"
              value={organization?.organizationName || ""}
              onChange={(e) =>
                setOrganization({
                  ...organization,
                  organizationName: e.target.value,
                })
              }
            />
            <Box display="flex" justifyContent="space-between">
              <TextField
                label="Latitude"
                variant="outlined"
                margin="dense"
                value={organization?.latitude || ""}
                onChange={(e) =>
                  setOrganization({
                    ...organization,
                    latitude: parseFloat(e.target.value),
                  })
                }
                style={{ marginRight: 8 }}
              />
              <TextField
                label="Longitude"
                variant="outlined"
                margin="dense"
                value={organization?.longitude || ""}
                onChange={(e) =>
                  setOrganization({
                    ...organization,
                    longitude: parseFloat(e.target.value),
                  })
                }
              />
            </Box>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              margin="dense"
              multiline
              rows={2}
              value={organization?.description || ""}
              onChange={(e) =>
                setOrganization({
                  ...organization,
                  description: e.target.value,
                })
              }
            />
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
              Create
            </Button>
          </form>
        </ListItem>
      )}
    </>
  );
};

export default SidebarOrganizations;
