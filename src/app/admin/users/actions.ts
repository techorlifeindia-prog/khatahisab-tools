"use server";
import { getServerSession } from "next-auth/next";
import { revalidatePath } from "next/cache";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function deleteUserAction(userId: string) {
  if (!userId) return;
  
  const currentSession = await getServerSession(authOptions);
  if (!currentSession || (currentSession.user?.email !== "techorlifeindia@gmail.com" && currentSession.user?.email !== "demo@khatahisab.in")) {
    return;
  }

  const client = await clientPromise;
  const db = client.db();
  
  // Prevent deleting admin accounts
  const userToDelete = await db.collection("users").findOne({ _id: new ObjectId(userId) });
  if (userToDelete && (userToDelete.email === "techorlifeindia@gmail.com" || userToDelete.email === "demo@khatahisab.in")) {
    return; 
  }

  await db.collection("users").deleteOne({ _id: new ObjectId(userId) });
  revalidatePath("/admin/users");
}

export async function editUserAction(userId: string, data: { name: string }) {
  if (!userId) return;
  
  const currentSession = await getServerSession(authOptions);
  if (!currentSession || (currentSession.user?.email !== "techorlifeindia@gmail.com" && currentSession.user?.email !== "demo@khatahisab.in")) {
    return;
  }

  const client = await clientPromise;
  const db = client.db();
  
  await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    { $set: { name: data.name } }
  );
  revalidatePath("/admin/users");
}
