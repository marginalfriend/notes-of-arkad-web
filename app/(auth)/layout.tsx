import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center gap-14 w-[97vw] h-[94vh] bg-[url('/images/hero.jpg')] bg-cover bg-blend-lighten rounded-3xl">
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
