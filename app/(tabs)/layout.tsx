import React, { ReactNode, Suspense } from "react";
import { Footer } from "./_components/footer";

const TabsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-w-screen min-h-screen">
      <Suspense>{children}</Suspense>
      <Footer />
    </div>
  );
};

export default TabsLayout;
