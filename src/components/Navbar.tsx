import {
  SignInButton,
  SignOutButton,
  UserButton,
  auth,
  useAuth,
} from "@clerk/nextjs";

const Navbar = () => {
  const { sessionId } = auth();
  return (
    <nav className="flex justify-between">
      <img src="/brand.svg" />
      {!sessionId ? <SignInButton /> : <UserButton afterSignOutUrl="/" />}
    </nav>
  );
};

export default Navbar;
