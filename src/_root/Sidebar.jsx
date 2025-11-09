import React, { useState } from "react";
import { items } from "@/Constants";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);
  const toggleSidebar = () => setIsExpanded(!isExpanded);
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);
  const closeMobileSidebar = () => setIsMobileOpen(false);

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
          "fixed md:static left-0 top-0 md:h-auto bg-card backdrop-blur-sm border-r border-border z-40 md:z-auto shadow-lg transition-all duration-300 ease-in-out flex flex-col",
          isMobileOpen
            ? "translate-x-0 h-screen"
            : "-translate-x-full md:translate-x-0",
          "w-80 md:w-auto",
          isExpanded ? "md:w-56" : "md:w-20",

        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
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
                      "group relative flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      isExpanded || isMobileOpen ? "justify-start" : "justify-center"
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
        <div className="p-4 border-t border-border">
          <div
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors",
              isExpanded ? "justify-start" : "justify-center"
            )}
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-semibold">U</span>
            </div>
            {isExpanded && (
              <div>
                <p className="text-sm font-medium text-foreground">User</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
