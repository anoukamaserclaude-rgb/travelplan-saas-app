"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function createTravelAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const title = String(formData.get("title") ?? "");
  const destination = String(formData.get("destination") ?? "");
  const startDate = String(formData.get("startDate") ?? "");
  const endDate = String(formData.get("endDate") ?? "");
  const travelers = Number(formData.get("travelers") ?? 1);

  if (!title || !destination || !startDate || !endDate) {
    throw new Error("Champs du voyage incomplets.");
  }

  const travel = await prisma.travel.create({
    data: {
      title,
      destination,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      travelers,
      ownerId: user.id,
    },
  });

  revalidatePath("/dashboard");
  redirect(`/travel/${travel.id}`);
}

export async function addActivityAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const travelId = String(formData.get("travelId") ?? "");
  if (!travelId) throw new Error("Aucun voyage sélectionné.");

  await prisma.activity.create({
    data: {
      travelId,
      title: String(formData.get("title") ?? ""),
      location: String(formData.get("location") ?? ""),
      notes: String(formData.get("notes") ?? ""),
      date: new Date(String(formData.get("date") ?? Date.now())),
      cost: Number(formData.get("cost") ?? 0),
    },
  });

  revalidatePath(`/travel/${travelId}`);
  redirect(`/travel/${travelId}`);
}

export async function addExpenseAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const travelId = String(formData.get("travelId") ?? "");
  if (!travelId) throw new Error("Aucun voyage sélectionné.");

  await prisma.expense.create({
    data: {
      travelId,
      category: String(formData.get("category") ?? "Divers"),
      amount: Number(formData.get("amount") ?? 0),
      note: String(formData.get("note") ?? ""),
    },
  });

  revalidatePath(`/travel/${travelId}`);
  redirect(`/travel/${travelId}`);
}

export async function addReservationAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const travelId = String(formData.get("travelId") ?? "");
  if (!travelId) throw new Error("Aucun voyage sélectionné.");

  await prisma.reservation.create({
    data: {
      travelId,
      type: (String(formData.get("type") ?? "OTHER")) as any,
      title: String(formData.get("title") ?? "Réservation"),
      details: String(formData.get("details") ?? ""),
      date: formData.get("date") ? new Date(String(formData.get("date"))) : null,
      amount: Number(formData.get("amount") ?? 0),
      status: String(formData.get("status") ?? "confirmé"),
    },
  });

  revalidatePath(`/travel/${travelId}`);
  redirect(`/travel/${travelId}`);
}

export async function addLuggageItemAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const travelId = String(formData.get("travelId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!travelId || !name) throw new Error("Informations du bagage incomplètes.");

  await prisma.luggageItem.create({
    data: { travelId, name, packed: false },
  });

  revalidatePath(`/travel/${travelId}`);
  redirect(`/travel/${travelId}`);
}

export async function toggleLuggageItemAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const travelId = String(formData.get("travelId") ?? "");
  const itemId = String(formData.get("itemId") ?? "");
  if (!travelId || !itemId) throw new Error("Élément introuvable.");

  const item = await prisma.luggageItem.findUnique({ where: { id: itemId } });
  if (!item) throw new Error("Élément introuvable.");

  await prisma.luggageItem.update({
    where: { id: itemId },
    data: { packed: !item.packed },
  });

  revalidatePath(`/travel/${travelId}`);
  redirect(`/travel/${travelId}`);
}

export async function addNotificationAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const travelId = String(formData.get("travelId") ?? "");
  const message = String(formData.get("message") ?? "").trim();
  if (!travelId || !message) throw new Error("Message requis.");

  await prisma.notification.create({
    data: {
      travelId,
      userId: user.id,
      message,
      scheduledFor: formData.get("scheduledFor") ? new Date(String(formData.get("scheduledFor"))) : null,
    },
  });

  revalidatePath(`/travel/${travelId}`);
  redirect(`/travel/${travelId}`);
}

export async function shareTravelAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const travelId = String(formData.get("travelId") ?? "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!travelId || !email) throw new Error("Informations de partage incomplètes.");

  const existingMember = await prisma.travelMember.findFirst({ where: { travelId, email } });
  const invitedUser = await prisma.user.findUnique({ where: { email } });

  if (existingMember) {
    await prisma.travelMember.update({
      where: { id: existingMember.id },
      data: { userId: invitedUser?.id ?? null, role: "VIEWER" },
    });
  } else {
    await prisma.travelMember.create({
      data: {
        travelId,
        email,
        userId: invitedUser?.id ?? null,
        role: "VIEWER",
      },
    });
  }

  revalidatePath(`/travel/${travelId}`);
  redirect(`/travel/${travelId}`);
}

export async function updateUserPlanAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const plan = String(formData.get("plan") ?? "FREE");
  const userId = String(formData.get("userId") ?? "");
  await prisma.user.update({ where: { id: userId }, data: { plan: plan as any } });

  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateUserRoleAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const role = String(formData.get("role") ?? "USER");
  const userId = String(formData.get("userId") ?? "");
  await prisma.user.update({ where: { id: userId }, data: { role: role as any } });

  revalidatePath("/admin");
  redirect("/admin");
}
