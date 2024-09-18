"use client";

import React from "react";
import { BarLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <BarLoader color="#000000" speedMultiplier={1} />
    </div>
  );
};

export default Loading;
