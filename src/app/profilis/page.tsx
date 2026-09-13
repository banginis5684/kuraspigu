import type { Metadata } from "next";
import { ProfileClient } from "@/components/ProfileClient";

export const metadata: Metadata = { title: "Mano profilis" };

export default function Page() {
  return <ProfileClient />;
}
