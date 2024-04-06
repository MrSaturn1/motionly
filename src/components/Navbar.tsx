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
    <nav className="">
      <div className="max-w-6xl mx-auto flex justify-between p-3">
        <img src="/brand.svg" />
        {!sessionId ? <SignInButton /> : <UserButton afterSignOutUrl="/" />}
      </div>
    </nav>
  );
};

export default Navbar;
