import type { Metadata } from "next";
import { ProfileView } from "@/components/features/account/ProfileView";

export const metadata: Metadata = { title: "Профиль" };

/** Профиль пациента (PD-14): имя, телефон, выход. */
export default function ProfilePage() {
  return <ProfileView />;
}
