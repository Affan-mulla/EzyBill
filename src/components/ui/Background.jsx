import React from "react";

export function GridBackgroundDemo() {
  return (
    (<div
      className=" w-full bg-black    bg-grid-white/[0.2] relative flex items-center justify-center">
      {/* Radial gradient for the container to give a faded look */}
      <div
        className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background   mask-[radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
    </div>)
  );
}
