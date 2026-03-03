"use client";

import { usePathname } from "next/navigation";
import DashboardLayout from "../../components/DashboardLayout.jsx";

export default function DashboardGroupLayout({ children }) {
  const pathname = usePathname();

  let activeKey = "dashboard";
  if (pathname.includes("/transfer")) activeKey = "transfer";
  else if (pathname.includes("/transactions")) activeKey = "history";
  else if (pathname.includes("/profile")) activeKey = "profile";

  return <DashboardLayout activeKey={activeKey}>{children}</DashboardLayout>;
}
