import { useAuth, UserButton, SignInButton } from "@clerk/nextjs";

const Header: React.FC = () => {
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <div className="header">
      <h1>Map Inventory App</h1>
      <div className="auth-buttons">
        {isLoaded && isSignedIn ? (
          <UserButton />
        ) : (
          <SignInButton mode="modal">
            <button>Login</button>
          </SignInButton>
        )}
      </div>
    </div>
  );
};

export default Header;
