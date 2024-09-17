import React, { ReactNode } from "react";
import { Footer } from "./_components/footer";

const TabsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-w-screen min-h-screen">
      {children}
      <Footer />
    </div>
  );
};

export default TabsLayout;
