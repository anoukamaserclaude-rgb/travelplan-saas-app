import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardHomePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return redirect("/dashboard");
}
