"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";

  useEffect(() => {
    async function doLogout() {
      try {
        await fetch("/api/logout", { method: "POST" });
      } catch (e) {
        console.error(e);
      } finally {
        router.replace(`/${locale}/login`);
      }
    }
    doLogout();
  }, [router, locale]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600 text-sm">
      <span>Déconnexion en cours...</span>
    </div>
  );
}
