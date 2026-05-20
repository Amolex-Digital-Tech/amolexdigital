"use client";

import { createContext, useContext, ReactNode, useEffect, useState } from "react";

interface CompanyContextType {
  companyName: string;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ 
  children, 
  companyName 
}: { 
  children: ReactNode; 
  companyName: string;
}) {
  return (
    <CompanyContext.Provider value={{ companyName }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompanyName() {
  const context = useContext(CompanyContext);
  // Try to get from localStorage if not in context
  if (!context) {
    const stored = localStorage.getItem("user_company_name");
    return stored || "Your Workspace";
  }
  return context.companyName;
}