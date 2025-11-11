import { useUserContext } from "@/Context/AuthContext";
import { useTheme } from "@/Context/ThemeProvider";
import React from "react";
import { Link } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconInvoice,
  IconLogout,
  IconNotification,
  IconSettings,
  IconSun,
  IconMoon,
  IconDeviceDesktop,
} from "@tabler/icons-react";
import { useGetProduct, useLogout } from "@/lib/Query/queryMutation";
import Loader from "../ui/Loader";

const ProfileNotify = ({ className }) => {
  const { user } = useUserContext();
  const { setTheme } = useTheme();
  const { mutateAsync, isPending } = useLogout();
  const { data } = useGetProduct(user.id);

  const lowStock = data?.filter((row) => row.Stock <= 10) || [];

  return (
    <div className="flex items-center gap-5">
      {/* Notifications */}
      <Popover>
        <PopoverTrigger className="relative flex justify-center items-center hover:bg-accent/60 p-2 rounded-lg transition-colors">
          <IconNotification className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
          {lowStock.length > 0 && (
            <span className="absolute top-1.5 right-1.5 flex items-center justify-center size-2.5 rounded-full bg-red-500 animate-pulse" />
          )}
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-64 bg-popover border border-border shadow-md rounded-xl p-3"
        >
          <h4 className="text-sm font-medium mb-2 text-foreground">
            Low Stock Alerts
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {lowStock.length > 0 ? (
              lowStock.map((row) => (
                <div
                  key={row.id}
                  className="text-sm text-muted-foreground bg-muted/30 p-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium text-foreground">
                    {row.productName}
                  </span>{" "}
                  – only <b>{row.Stock}</b> left.
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No alerts.</p>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Profile + Theme */}
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full focus:outline-none ring-0">
          <img
            src={user.imageUrl || "/assets/ProfilePlaceholder.svg"}
            className={`${className} rounded-full border border-border hover:scale-105 transition-transform object-cover w-9 h-10 aspect-square`}
            alt="profile"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="text-sm">My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link to="/billing" className="flex items-center gap-2 w-full">
              <IconInvoice size={18} /> Billing
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/setting" className="flex items-center gap-2 w-full">
              <IconSettings size={18} /> Settings
            </Link>
          </DropdownMenuItem>

          {/* Theme Switch */}
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Theme
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setTheme("light")}>
            <IconSun size={18} className="mr-2" /> Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <IconMoon size={18} className="mr-2" /> Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            <IconDeviceDesktop size={18} className="mr-2" /> System
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => mutateAsync()}
            className="text-destructive font-semibold"
          > 
            {isPending ? (
              <Loader />
            ) : (
              <>
                <IconLogout size={18} className="mr-2 " /> Logout
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProfileNotify;
