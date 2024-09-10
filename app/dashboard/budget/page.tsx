import React from "react";
import { CreateBudgetDialog } from "./_components/create-budget-dialog";

const BudgetPage = () => {
  return (
    <div className="w-full h-full p-4">
      <CreateBudgetDialog />
      <div className="grid grid-cols-1 md:grid-cols-2"></div>
    </div>
  );
};

export default BudgetPage;
