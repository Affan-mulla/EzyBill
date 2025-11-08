import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Shared/Navbar";

const RootLayout = () => {
  
  return (
    <div className="w-full min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 transition-all duration-300 ease-in-out">
        <Navbar />
        <div className="">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default RootLayout;
