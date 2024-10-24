import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <div className="relative min-h-screen">
      {/* Outlet takes the whole screen, with padding at the bottom for Sidebar */}
      <div className="min-h-screen">
        <Outlet />
      </div>

      {/* Sidebar floating at the bottom */}
      <div className="fixed bottom-5 z-50 w-fit md:left-[50%] md:translate-x-[-50%]">
        <Sidebar className="" />
      </div>

    </div>
  );
};

export default RootLayout;
