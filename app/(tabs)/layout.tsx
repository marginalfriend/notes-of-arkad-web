import React, { ReactNode, Suspense } from "react";
import { Footer } from "./_components/footer";
import Loading from "@/loading";
import { EntryProvider } from "@/contexts/entry-context";

const TabsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <EntryProvider>
      <div className="min-w-screen min-h-screen">
        <Suspense fallback={<Loading />}>{children}</Suspense>
        <Footer />
      </div>
    </EntryProvider>
  );
};

export default TabsLayout;
