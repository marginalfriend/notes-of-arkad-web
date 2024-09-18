import React from "react";
import { BarLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <BarLoader color="#1e1e1e" />
    </div>
  );
};

export default Loading;
