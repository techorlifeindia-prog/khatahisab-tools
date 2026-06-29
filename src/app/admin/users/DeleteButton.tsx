"use client";

import { Trash2 } from "lucide-react";
import { deleteUserAction } from "./actions";

export default function DeleteButton({ userId }: { userId: string }) {
  const handleDelete = async () => {
    const ans = prompt('To confirm deletion, type "DELETE":');
    if (ans === "DELETE") {
      await deleteUserAction(userId);
    }
  };

  return (
    <button 
      type="button"
      onClick={handleDelete}
      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
    >
      <Trash2 className="w-4 h-4" />
      <span>Delete</span>
    </button>
  );
}
