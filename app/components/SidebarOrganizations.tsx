"use client";
import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { OrganizationType } from "@/app/types/organization";
import TextField from "@mui/material/TextField";
import "./sidebar.css"; // Import the CSS file

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
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [originalOrganization, setOriginalOrganization] =
    React.useState<OrganizationType | null>(null);
  const [emailError, setEmailError] = React.useState("");

  React.useEffect(() => {
    fetch(`/api/organizations/getOrganizationByUser?userEmail=${userEmail}`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setOrganization(data);
          setOriginalOrganization(data); // Save the original organization details
          setAdmins(data.admins);
        } else {
          const newOrg = {
            _id: undefined,
            organizationName: "",
            owner: "",
            latitude: 0,
            longitude: 0,
            description: "",
            admins: [userEmail],
          };
          setOrganization(newOrg);
          setOriginalOrganization(newOrg); // Save the original organization details
        }
      });
  }, [userEmail]);

  const handleCreateOrganization = () => {
    setShowCreateForm(true);
  };

  const handleEditOrganization = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setShowCreateForm(false); // Hide the form when canceling edit
    setOrganization(originalOrganization); // Reset organization state to original
    setAdmins(originalOrganization?.admins || []); // Reset admins state to original
  };

  const handleAddAdmin = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newAdminEmail)) {
      setEmailError("Invalid email address.");
      return;
    }
    setEmailError("");
    if (newAdminEmail && !admins.includes(newAdminEmail)) {
      setAdmins([...admins, newAdminEmail]);
      setNewAdminEmail("");
    }
  };

  const handleRemoveAdmin = (emailToRemove: string) => {
    setAdmins(admins.filter((email) => email !== emailToRemove));
  };

  const handleFieldChange =
    (field: keyof OrganizationType) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (organization) {
        setOrganization({
          ...organization,
          [field]:
            field === "latitude" || field === "longitude"
              ? parseFloat(e.target.value)
              : e.target.value,
        });
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
      alert(isEditMode ? "Update successful!" : "Create successful!");
      setShowCreateForm(false);
      setIsEditMode(false);
      setOriginalOrganization(organization); // Update original organization details
    } else {
      alert("Failed to create or update organization.");
    }
  };

  return (
    <>
      {organization && organization.organizationName && !isEditMode ? (
        <ListItem className="organization-info">
          <Box
            display="flex"
            justifyContent="space-between"
            width="100%"
            alignItems="center"
          >
            <ListItemText primary="Your Organization Information" />
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleEditOrganization}
            >
              Update
            </Button>
          </Box>
          <ListItemText primary={`Name: ${organization.organizationName}`} />
          <Box display="flex" justifyContent="space-between" width="100%">
            <ListItemText primary={`Latitude: ${organization.latitude}`} />
            <ListItemText primary={`Longitude: ${organization.longitude}`} />
          </Box>
          <ListItemText primary={`Description: ${organization.description}`} />
          <ListItemText primary={`Organization admins:`} />
          <Box display="flex" flexWrap="wrap" mb={2}>
            {admins.map((email) => (
              <div key={email} className="admin-card">
                {email}
              </div>
            ))}
          </Box>
        </ListItem>
      ) : !isEditMode ? (
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
      ) : null}
      {(showCreateForm || isEditMode) && (
        <ListItem>
          <form className="create-organization-form">
            <h3>
              {isEditMode ? "Update Organization" : "Create New Organization"}
            </h3>
            <TextField
              label="Organization Name"
              variant="outlined"
              fullWidth
              margin="dense"
              value={organization?.organizationName || ""}
              onChange={handleFieldChange("organizationName")}
            />
            <Box display="flex" justifyContent="space-between">
              <TextField
                label="Latitude"
                variant="outlined"
                margin="dense"
                value={organization?.latitude || ""}
                onChange={handleFieldChange("latitude")}
                style={{ marginRight: 8 }}
              />
              <TextField
                label="Longitude"
                variant="outlined"
                margin="dense"
                value={organization?.longitude || ""}
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
              value={organization?.description || ""}
              onChange={handleFieldChange("description")}
            />
            <Box display="flex" justifyContent="center" alignItems="center">
              <TextField
                label="Add Admin Email"
                variant="outlined"
                fullWidth
                margin="dense"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                error={!!emailError}
                helperText={emailError}
                style={{ marginRight: 8 }}
              />
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddAdmin}
                >
                  Add
                </Button>
              </div>
            </Box>
            <Box display="flex" flexWrap="wrap" mt={2}>
              {admins.map((email) => (
                <Chip
                  key={email}
                  label={email}
                  onDelete={() => handleRemoveAdmin(email)}
                  color="primary"
                  variant="outlined"
                  style={{ margin: 2 }}
                />
              ))}
            </Box>
            <Box display="flex" justifyContent="space-between" width="100%">
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateOrUpdate}
                style={{ marginTop: "1rem" }}
              >
                {isEditMode ? "Update" : "Create"}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleCancelEdit}
                style={{ marginTop: "1rem" }}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </ListItem>
      )}
    </>
  );
};

export default SidebarOrganizations;
