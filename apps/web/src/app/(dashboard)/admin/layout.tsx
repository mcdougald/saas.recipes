import type { ReactNode } from "react";

import { requireAdminUser } from "@/lib/session";

/**
 * Protect all dashboard admin routes behind an admin check.
 *
 * @param props - Layout props containing route children.
 * @returns Admin route content when the current user is an admin.
 */
export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdminUser();
  return children;
}
