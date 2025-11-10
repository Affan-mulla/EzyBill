import React, { useState } from "react";
import { items } from "@/Constants";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserContext } from "@/Context/AuthContext";

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);
  const toggleSidebar = () => setIsExpanded(!isExpanded);
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);
  const closeMobileSidebar = () => setIsMobileOpen(false);
  const { user } = useUserContext();

  console.log(user);


  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border hover:bg-accent/50 transition-colors backdrop-blur"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:static left-0 top-0 h-screen bg-sidebar backdrop-blur-sm border-r border-border z-40 md:z-auto shadow-lg transition-all duration-300 ease-in-out flex flex-col",
          isMobileOpen
            ? "translate-x-0 h-screen"
            : "-translate-x-full md:translate-x-0",
          "w-80 md:w-auto",
          isExpanded ? "md:w-56" : "md:w-20",

        )}
      >
        {/* Header */}
        <div className={cn(
          "flex items-center justify-between px-4 py-2 mt-3",
          isExpanded ? "md:justify-between" : "md:justify-center"
        )}>
          {
            isExpanded && (
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
                  <span className="text-primary-foreground font-bold text-xl">E</span>
                </div>
                <span
                  className={cn(
                    "font-semibold text-lg text-foreground transition-all duration-300",
                    isExpanded ? "opacity-100" : "opacity-0 md:hidden"
                  )}
                >
                  EzyBill
                </span>
              </div>
            )
          }

          <button
            onClick={toggleSidebar}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-accent transition-colors"
            aria-label="Toggle sidebar"
          >
            {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 ">
          <ul className="space-y-1">
            {items.map((item, i) => {
              const isActive = location.pathname === item.route;
              return (
                <li key={i}>
                  <Link
                    to={item.route}
                    onClick={closeMobileSidebar}
                    className={cn(
                      "group relative flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      isExpanded || isMobileOpen ? "justify-start " : "justify-center px-1"
                    )}
                  >
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>

                    {(isExpanded || isMobileOpen) && (
                      <span className="whitespace-nowrap transition-opacity duration-300">
                        {item.label}
                      </span>
                    )}

                    {/* Tooltip */}
                    {!isExpanded && (
                      <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 
      px-2 py-1 bg-popover text-sm text-popover-foreground rounded-md shadow-md 
      opacity-0 group-hover:opacity-100 whitespace-nowrap border border-border 
      z-50 transition-opacity duration-200">
                        {item.label}
                      </div>

                    )}

                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className={cn(
          "relative rounded-xl border border-border bg-card/80 backdrop-blur-md p-3 m-2 shadow-md overflow-hidden",
          isExpanded ? "p-3" : "p-2")}>
          {/* Glow Background */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-violet-600/80 via-purple-600/70 to-transparent blur-2xl rounded-full opacity-80 animate-pulse" />

          {/* Card Content */}
          <div className="relative z-10 flex items-center gap-3 sm:gap-4">
            <img
              src={user.imageUrl || ''}
              alt="User"
              className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-cover border border-border shadow-sm"
            />

            {isExpanded  && (
              <div className="">
                <p className="text-sm sm:text-base font-medium text-foreground truncate">
                  {user.name || 'User Name'}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {user.email || 'User Email'}
                </p>
              </div>
            )}
          </div>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
