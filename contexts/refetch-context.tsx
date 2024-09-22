"use client";

import React, { createContext, useContext, useState } from "react";

const RefetchContext = createContext({
  triggerRefetch: () => {},
  refetchTrigger: 0,
});

export const RefetchProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const triggerRefetch = () => setRefetchTrigger((prev) => prev + 1);

  return (
    <RefetchContext.Provider value={{ refetchTrigger, triggerRefetch }}>
      {children}
    </RefetchContext.Provider>
  );
};

export const useRefetch = () => useContext(RefetchContext);
