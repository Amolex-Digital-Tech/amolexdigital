"use client";

import { CompanyProvider } from "@/components/dashboard/company-context";
import { ReactNode, useEffect, useState } from "react";

export function ClientLayoutClient({ children }: { children: ReactNode }) {
  const [companyName, setCompanyName] = useState("Your Workspace");

  useEffect(() => {
    // Get company name from localStorage or cookie
    const stored = localStorage.getItem("user_company_name");
    if (stored) {
      setCompanyName(stored);
    } else {
      // Try to get from cookie
      const cookies = document.cookie.split(";");
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split("=");
        if (name === "user_company_name") {
          setCompanyName(decodeURIComponent(value));
          break;
        }
      }
    }
  }, []);

  return (
    <CompanyProvider companyName={companyName}>
      {children}
    </CompanyProvider>
  );
}