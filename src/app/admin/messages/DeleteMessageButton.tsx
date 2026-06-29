"use client";

import { Trash2, Settings } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteMessageButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete message");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting message");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
      title="Delete Message"
    >
      {isDeleting ? <Settings className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
    </button>
  );
}
