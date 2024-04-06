import {
  SignInButton,
  SignOutButton,
  UserButton,
  auth,
  useAuth,
} from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavLink from "./NavLink";

const Navbar = () => {
  const { sessionId } = auth();

  return (
    <nav className="border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex justify-between p-3">
        <div className="flex gap-8 items-center">
          <Link href="/app">
            <img src="/brand.svg" />
          </Link>
          <NavLink href="/app/propound-request">Propound</NavLink>
          <NavLink href="/app/respond-request">Respond</NavLink>
        </div>
        {!sessionId ? <SignInButton /> : <UserButton afterSignOutUrl="/" />}
      </div>
    </nav>
  );
};

export default Navbar;
