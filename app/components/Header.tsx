import React, { useState } from "react";
import { useAuth, UserButton, SignInButton, useUser } from "@clerk/nextjs";
import Sidebar from "./Sidebar";
import { OrganizationType } from "@/app/types/organization";

type HeaderProps = {
  organization: OrganizationType | null;
};

const Header: React.FC<HeaderProps> = ({ organization }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="header">
      <h1>Map Inventory App</h1>
      {organization && <h2>{organization.organizationName}</h2>}
      <div className="auth-buttons">
        {isLoaded && isSignedIn ? (
          <div style={{ display: "flex" }}>
            <button
              onClick={toggleSidebar}
              style={{ marginRight: "1rem" }}
              disabled={!userEmail}
            >
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
      {userEmail && (
        <Sidebar
          open={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          organization={organization}
          userEmail={userEmail}
        />
      )}
    </div>
  );
};

export default Header;
