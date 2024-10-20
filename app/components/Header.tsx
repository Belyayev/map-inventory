import React, { useState } from "react";
import { useAuth, UserButton, SignInButton } from "@clerk/nextjs";
import Sidebar from "./Sidebar";

const Header: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLoaded, isSignedIn } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="header">
      <h1>Map Inventory App</h1>
      <div className="auth-buttons">
        {isLoaded && isSignedIn ? (
          <div style={{ display: "flex" }}>
            <button onClick={toggleSidebar} style={{ marginRight: "1rem" }}>
              Manage
            </button>
            <UserButton />
          </div>
        ) : (
          <SignInButton mode="modal">
            <button>Login</button>
          </SignInButton>
        )}
      </div>
      <Sidebar open={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </div>
  );
};

export default Header;
