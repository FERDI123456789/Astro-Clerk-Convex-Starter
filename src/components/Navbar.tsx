// Navbar.tsx
import { withConvexClerkProvider } from "@/lib/withConvexClerkProvider";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/astro/react";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const AdminBadge = function () {
  const isAdmin = useQuery(api.messages.userRole);
  return (
    <>
      {isAdmin ? (
        <span className="inline-flex items-center rounded-full bg-blue-200 px-2 py-0.5 text-xs font-medium text-blue-700">
          Admin
        </span>
      ) : null}
    </>
  );
};

const NavbarComponent = function () {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top Bar */}
      <div
        className="
          font-bold
          py-2 px-3 sm:px-6
          flex items-center justify-between
          w-full
          hover:bg-gray-100
          rounded-b-2xl sm:rounded-b-3xl
          transition-all
        "
      >
        {/* Left */}
        <a
          href="/"
          className="hover:text-gray-500 transition-colors text-sm sm:text-lg hidden sm:flex"
        >
          Home
        </a>

        {/* Desktop Middle */}
        <div className="flex sm:hidden text-base sm:text-lg gap-1">
          <span
            onClick={() => window.open("https://astro.build", "_blank")}
            className="hover:text-orange-500 cursor-pointer"
          >
            Astro
          </span>
          +
          <span
            onClick={() => window.open("https://clerk.com", "_blank")}
            className="hover:text-blue-500 cursor-pointer"
          >
            Clerk
          </span>
          +
          <span
            onClick={() => window.open("https://convex.dev", "_blank")}
            className="hover:text-yellow-400 cursor-pointer"
          >
            Convex
          </span>
          +
          <span
            onClick={() => (window.location.href = "/")}
            className="cursor-pointer"
          >
            Starter
          </span>
        </div>

        {/* Desktop Right */}
        <div className="hidden sm:flex items-center gap-4">
          <SignedIn>
            <AdminBadge />
            <UserButton />
          </SignedIn>

          <SignedOut>
            <SignUpButton
              mode="modal"
              /* @ts-ignore */
              className="px-3 py-1 rounded-full text-sm hover:bg-gray-200"
            />

            <SignInButton
              mode="modal"
              /* @ts-ignore */
              className="px-3 py-1 rounded-full text-sm border hover:bg-gray-200"
            />
          </SignedOut>
        </div>

        {/* Mobile Burger */}
        <button
          onClick={() => setOpen(true)}
          className="sm:hidden p-2 rounded-lg hover:bg-gray-200"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            className="
              fixed inset-0
              bg-black/40
              backdrop-blur-sm
              z-40
            "
          />

          {/* Slide Down Panel */}
          <div
            className="
              fixed top-0 left-0 right-0
              bg-white
              z-50
              rounded-b-2xl
              shadow-xl
              p-6
              animate-slideDown
            "
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center gap-6 mt-4">
              {/* Home */}
              <a
                href="/"
                onClick={() => setOpen(false)}
                className="text-lg font-semibold"
              >
                Home
              </a>

              {/* Auth */}
              <SignedIn>
                <div className="flex flex-col items-center gap-3">
                  <AdminBadge />
                  <UserButton />
                </div>
              </SignedIn>

              <SignedOut>
                <div className="flex flex-col gap-3 w-full">
                  <SignUpButton
                    mode="modal"
                    /* @ts-ignore */
                    className="
                      w-full text-center
                      py-2 rounded-full
                      bg-gray-100
                      hover:bg-gray-200
                    "
                  />

                  <SignInButton
                    mode="modal"
                    /* @ts-ignore */
                    className="
                      w-full text-center
                      py-2 rounded-full
                      border
                      hover:bg-gray-100
                    "
                  />
                </div>
              </SignedOut>
            </div>
          </div>
        </>
      )}
    </>
  );
};

const Navbar = withConvexClerkProvider(NavbarComponent);
export default Navbar;
