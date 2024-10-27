import * as React from "react";
import { useUser } from "@clerk/nextjs";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import SidebarOrganizations from "./SidebarOrganizations";
import "./sidebar.css";

interface SidebarProps {
  open: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, toggleSidebar }) => {
  const { user } = useUser();

  // Ensure that the email is correctly extracted
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  return (
    <Drawer anchor="left" open={open} onClose={toggleSidebar}>
      <List>
        {userEmail && (
          <ListItem>
            <ListItemText primary={`User: ${userEmail}`} />
          </ListItem>
        )}
        {userEmail && <SidebarOrganizations userEmail={userEmail} />}
      </List>
    </Drawer>
  );
};

export default Sidebar;
