import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import { prisma } from "@/lib/db";

export type EmployeeRole = "admin" | "employee";

export type EmployeeListItem = {
  id: string;
  name: string;
  email: string;
  role: string;
  position: string;
  photoUrl: string | null;
  tenantId: string | null;
  active: boolean;
  isSystem?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type EmployeeAuthRecord = {
  id: string;
  name: string;
  email: string;
  role: EmployeeRole;
  position: string;
  photoUrl: string | null;
  tenantId: string | null;
  active: boolean;
};

type StoredEmployeeRecord = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: EmployeeRole;
  position?: string;
  photoUrl?: string | null;
  tenantId: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

const EMPLOYEE_STORE_PATH = path.join(process.cwd(), "data", "employees.json");
const ADMIN_PROFILE_PATH = path.join(process.cwd(), "data", "admin-profile.json");

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) {
    return false;
  }

  const derivedHash = scryptSync(password, salt, 64);
  const expectedHash = Buffer.from(hash, "hex");

  if (expectedHash.length !== derivedHash.length) {
    return false;
  }

  return timingSafeEqual(expectedHash, derivedHash);
}

function toListItem(record: StoredEmployeeRecord): EmployeeListItem {
  const position = record.position?.trim() || (record.role === "admin" ? "Administrator" : "Employee");

  return {
    id: record.id,
    name: record.name,
    email: record.email,
    role: record.role,
    position,
    photoUrl: record.photoUrl ?? null,
    tenantId: record.tenantId,
    active: record.active,
    isSystem: false,
    createdAt: new Date(record.createdAt),
    updatedAt: new Date(record.updatedAt)
  };
}

export async function getSystemAdminEmployee(): Promise<EmployeeListItem | null> {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return null;
  }

  const profile = await loadAdminProfile();
  const photoUrl = profile.photoUrl ?? (process.env.ADMIN_PHOTO_URL?.trim() || null);

  return {
    id: `system-admin:${normalizeEmail(email)}`,
    name: "Admin User",
    email,
    role: "admin",
    position: "Administrator",
    photoUrl,
    tenantId: null,
    active: true,
    isSystem: true,
    createdAt: new Date(0),
    updatedAt: new Date(0)
  };
}

async function loadFileEmployees() {
  try {
    const raw = await readFile(EMPLOYEE_STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as StoredEmployeeRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function saveFileEmployees(employees: StoredEmployeeRecord[]) {
  await mkdir(path.dirname(EMPLOYEE_STORE_PATH), { recursive: true });
  await writeFile(EMPLOYEE_STORE_PATH, JSON.stringify(employees, null, 2), "utf8");
}

async function loadAdminProfile() {
  try {
    const raw = await readFile(ADMIN_PROFILE_PATH, "utf8");
    const parsed = JSON.parse(raw) as { photoUrl?: string | null };
    return {
      photoUrl: parsed.photoUrl ?? null
    };
  } catch {
    return {
      photoUrl: null
    };
  }
}

async function saveAdminProfile(photoUrl: string | null) {
  await mkdir(path.dirname(ADMIN_PROFILE_PATH), { recursive: true });
  await writeFile(
    ADMIN_PROFILE_PATH,
    JSON.stringify(
      {
        photoUrl,
        updatedAt: new Date().toISOString()
      },
      null,
      2
    ),
    "utf8"
  );
}

function employeeSelect() {
  return {
    id: true,
    name: true,
    email: true,
    role: true,
    position: true,
    photoUrl: true,
    tenantId: true,
    active: true,
    createdAt: true,
    updatedAt: true
  } as const;
}

function toEmployeeListItemFromDb(employee: {
  id: string;
  name: string;
  email: string;
  role: string;
  position?: string | null;
  photoUrl?: string | null;
  tenantId: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}): EmployeeListItem {
  return {
    id: employee.id,
    name: employee.name,
    email: employee.email,
    role: employee.role,
    position: employee.position?.trim() || (employee.role === "admin" ? "Administrator" : "Employee"),
    photoUrl: employee.photoUrl ?? null,
    tenantId: employee.tenantId,
    active: employee.active,
    createdAt: employee.createdAt,
    updatedAt: employee.updatedAt
  };
}

function toEmployeeAuthRecord(employee: {
  id: string;
  name: string;
  email: string;
  role: string;
  position?: string | null;
  photoUrl?: string | null;
  tenantId: string | null;
  active: boolean;
}): EmployeeAuthRecord {
  return {
    id: employee.id,
    name: employee.name,
    email: employee.email,
    role: employee.role as EmployeeRole,
    position: employee.position?.trim() || (employee.role === "admin" ? "Administrator" : "Employee"),
    photoUrl: employee.photoUrl ?? null,
    tenantId: employee.tenantId ?? null,
    active: employee.active
  };
}

export async function listEmployees(): Promise<EmployeeListItem[]> {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: {
        createdAt: "desc"
      },
      select: employeeSelect()
    });

    const systemAdmin = await getSystemAdminEmployee();
    const filtered = employees.map((employee) => ({ ...toEmployeeListItemFromDb(employee), isSystem: false }));

    if (!systemAdmin) {
      return filtered;
    }

    const normalizedSystemEmail = normalizeEmail(systemAdmin.email);
    return [
      systemAdmin,
      ...filtered.filter((employee) => normalizeEmail(employee.email) !== normalizedSystemEmail)
    ];
  } catch {
    const fallback = await loadFileEmployees();
    const systemAdmin = await getSystemAdminEmployee();
    const fallbackEmployees = fallback.map(toListItem);
    if (!systemAdmin) {
      return fallbackEmployees.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    const normalizedSystemEmail = normalizeEmail(systemAdmin.email);
    const filtered = fallbackEmployees.filter(
      (employee) => normalizeEmail(employee.email) !== normalizedSystemEmail
    );

    return [
      systemAdmin,
      ...filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    ];
  }
}

export async function getEmployeeByEmail(email: string): Promise<EmployeeListItem | null> {
  const normalizedEmail = normalizeEmail(email);
  const systemAdmin = await getSystemAdminEmployee();

  if (systemAdmin && normalizeEmail(systemAdmin.email) === normalizedEmail) {
    return systemAdmin;
  }

  try {
    const employee = await prisma.employee.findUnique({
      where: { email: normalizedEmail },
      select: employeeSelect()
    });

    if (employee) {
      return toEmployeeListItemFromDb(employee);
    }
  } catch {
    // Fall back to the local file store below.
  }

  const fallback = await loadFileEmployees();
  const record = fallback.find((entry) => entry.email.toLowerCase() === normalizedEmail);
  return record ? toListItem(record) : null;
}

export async function createEmployee(input: {
  name: string;
  email: string;
  password: string;
  role?: EmployeeRole;
  position: string;
  photoUrl?: string | null;
  tenantId?: string | null;
  active?: boolean;
}): Promise<EmployeeListItem> {
  const name = input.name.trim();
  const email = normalizeEmail(input.email);
  const position = input.position.trim();
  const nowIso = new Date().toISOString();
  const passwordHash = hashPassword(input.password);
  const systemAdmin = await getSystemAdminEmployee();

  if (systemAdmin && normalizeEmail(systemAdmin.email) === email) {
    throw new Error("This email is reserved for the system admin account.");
  }

  try {
    const existing = await prisma.employee.findUnique({
      where: { email }
    });

    if (existing) {
      throw new Error("An employee with this email already exists.");
    }

    const created = await prisma.employee.create({
      data: {
        name,
        email,
        passwordHash,
        role: input.role ?? "employee",
        position,
        photoUrl: input.photoUrl ?? null,
        tenantId: input.tenantId ?? null,
        active: input.active ?? true
      },
      select: employeeSelect()
    });

    return toEmployeeListItemFromDb(created);
  } catch (error) {
    if (error instanceof Error && error.message.includes("already exists")) {
      throw error;
    }

    const employees = await loadFileEmployees();
    const existing = employees.find((employee) => employee.email.toLowerCase() === email);
    if (existing) {
      throw new Error("An employee with this email already exists.");
    }

    const created: StoredEmployeeRecord = {
      id: randomUUID(),
      name,
      email,
      passwordHash,
      role: input.role ?? "employee",
      position,
      photoUrl: input.photoUrl ?? null,
      tenantId: input.tenantId ?? null,
      active: input.active ?? true,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    employees.unshift(created);
    await saveFileEmployees(employees);
    return toListItem(created);
  }
}

export async function updateEmployeePhoto(email: string, photoUrl: string | null): Promise<EmployeeListItem> {
  const normalizedEmail = normalizeEmail(email);
  const systemAdmin = await getSystemAdminEmployee();

  if (systemAdmin && normalizeEmail(systemAdmin.email) === normalizedEmail) {
    await saveAdminProfile(photoUrl);
    return (await getSystemAdminEmployee()) ?? { ...systemAdmin, photoUrl };
  }

  try {
    const updated = await prisma.employee.update({
      where: { email: normalizedEmail },
      data: {
        photoUrl,
        updatedAt: new Date()
      },
      select: employeeSelect()
    });

    return toEmployeeListItemFromDb(updated);
  } catch {
    const employees = await loadFileEmployees();
    const index = employees.findIndex((entry) => entry.email.toLowerCase() === normalizedEmail);
    if (index === -1) {
      throw new Error("Employee not found.");
    }

    const current = employees[index];
    const updated: StoredEmployeeRecord = {
      ...current,
      photoUrl,
      updatedAt: new Date().toISOString()
    };

    employees[index] = updated;
    await saveFileEmployees(employees);
    return toListItem(updated);
  }
}

export async function authenticateEmployee(
  email: string,
  password: string
): Promise<EmployeeAuthRecord | null> {
  const normalizedEmail = normalizeEmail(email);

  try {
    const employee = await prisma.employee.findUnique({
      where: {
        email: normalizedEmail
      }
    });

    if (!employee || !employee.active) {
      return null;
    }

    if (!verifyPassword(password, employee.passwordHash)) {
      return null;
    }

    return toEmployeeAuthRecord(employee);
  } catch {
    const employees = await loadFileEmployees();
    const employee = employees.find((entry) => entry.email.toLowerCase() === normalizedEmail);
    if (!employee || !employee.active) {
      return null;
    }

    if (!verifyPassword(password, employee.passwordHash)) {
      return null;
    }

    return toEmployeeAuthRecord(employee);
  }
}
