import React from "react";
import ProfileNotify from "./ProfileNotify";

const Navbar = () => {
  return (
    <div className="flex w-full bg-white dark:bg-neutral-900  items-center px-4 py-2 border-b border-neutral-200 dark:border-neutral-700">
      <ProfileNotify className="w-[50px]" />
    </div>
  );
};

export default Navbar;
