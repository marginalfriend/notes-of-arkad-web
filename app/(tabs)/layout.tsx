import React, { ReactNode, Suspense } from "react";
import { Footer } from "./_components/footer";
import Loading from "@/loading";

const TabsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-w-screen min-h-screen">
      <Suspense fallback={<Loading />}>{children}</Suspense>
      <Footer />
    </div>
  );
};

export default TabsLayout;
