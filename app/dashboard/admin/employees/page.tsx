import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { listEmployees } from "@/lib/employee-auth";
import { EmployeeManager } from "./employee-manager";

function serializeEmployees(
  employees: Awaited<ReturnType<typeof listEmployees>>
) {
  return employees.map((employee) => ({
    ...employee,
    createdAt: employee.createdAt.toISOString(),
    updatedAt: employee.updatedAt.toISOString()
  }));
}

export default async function AdminEmployeesPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/dashboard/admin/sign-in");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard/admin");
  }

  try {
    const employees = await listEmployees();

    return (
      <EmployeeManager
        initialEmployees={serializeEmployees(employees)}
        initialError={null}
      />
    );
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Unable to load employee records.";

    return <EmployeeManager initialEmployees={[]} initialError={message} />;
  }
}
