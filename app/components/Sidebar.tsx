import * as React from "react";

import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import SidebarOrganizations from "./SidebarOrganizations";
import "./sidebar.css";
import SidebarInventory from "./SidebarInventory";
import { OrganizationType } from "../types/organization";

interface SidebarProps {
  open: boolean;
  toggleSidebar: () => void;
  organization: OrganizationType | null;
  userEmail: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  open,
  toggleSidebar,
  organization,
  userEmail,
}) => {
  return (
    <Drawer anchor="left" open={open} onClose={toggleSidebar}>
      <List>
        <ListItem>
          <ListItemText primary={`User: ${userEmail}`} />
        </ListItem>
        <SidebarOrganizations userEmail={userEmail} />
        {organization && (
          <SidebarInventory userEmail={userEmail} organization={organization} />
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
