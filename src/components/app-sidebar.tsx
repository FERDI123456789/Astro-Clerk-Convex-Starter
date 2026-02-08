import { useEffect, useState } from "react";
import { ChevronUp, Home, Inbox, User, User2 } from "lucide-react";
import {
  SignUpButton,
  UserProfile,
  SignInButton,
  SignOutButton,
} from "@clerk/astro/react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@clerk/clerk-react";
import { Authenticated } from "convex/react";
import { withConvexClerkProvider } from "@/lib/withConvexClerkProvider";

// Menu items.
const items = [
  {
    title: "Public's",
    url: "/",
    icon: Home,
  },
  {
    title: "Private's",
    url: "/private-messages",
    icon: Inbox,
  },
];

export default function AppSidebar() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  const { user, isLoaded } = useUser();

  const username = `${user?.fullName}`;

  const userImage = `${user?.imageUrl}`;

  useEffect(() => {
    if (open) {
      setVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  function closeModal() {
    setVisible(false);
    setTimeout(() => setOpen(false), 300);
  }

  function openModal() {
    setOpen(true);
    setVisible(false); // start hidden
    requestAnimationFrame(() => setVisible(true));
  }

  return (
    <>
      <Sidebar className="bg-white">
        <SidebarContent className="bg-white">
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    {!user ? (
                      <User2 />
                    ) : (
                      <img src={userImage} className="size-8 rounded-full" />
                    )}{" "}
                    <span className="truncate">
                      {!user ? "Anonymous" : username}
                    </span>
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" className="w-56">
                  {!user ? (
                    <>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <SignInButton mode="modal" />
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <SignUpButton mode="modal" />
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <span>Account</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <SignOutButton />
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SignInButton mode="modal" />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={closeModal}
        >
          {/* Backdrop */}
          <div
            className={`
        absolute inset-0 bg-black/50
        transition-opacity duration-150
        ${visible ? "opacity-100" : "opacity-0"}
      `}
          />

          {/* Modal */}
          <div
            className={`
        relative z-10
        max-h-[90vh] overflow-y-auto shadow-xl
        transform transition-all duration-150 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
      `}
            onClick={(e) => e.stopPropagation()}
          >
            <UserProfile />
          </div>
        </div>
      )}
    </>
  );
}
