import { AboutSection } from "@/components/features/home/AboutSection";
import { ContactsSection } from "@/components/features/home/ContactsSection";
import { DoctorsSection } from "@/components/features/home/DoctorsSection";
import { HeroSection } from "@/components/features/home/HeroSection";
import { LabSection } from "@/components/features/home/LabSection";
import { PopularServicesSection } from "@/components/features/home/PopularServicesSection";
import { PromotionsSection } from "@/components/features/home/PromotionsSection";
import { QuickLinksSection } from "@/components/features/home/QuickLinksSection";
import { connection } from "next/server";
import { getHomepageData } from "@/services/homepage";

/** Главная — порядок секций как в Homepage-Desktop / Mobile.dc.html. */
export default async function HomePage() {
  // Ближайшее время врачей зависит от текущего момента — страница собирается на каждый запрос.
  await connection();
  const data = await getHomepageData();

  return (
    <>
      <HeroSection preview={data.bookingPreview} />
      <QuickLinksSection links={data.quickLinks} />
      <PopularServicesSection services={data.popularServices} />
      <LabSection analyses={data.featuredAnalyses} />
      <DoctorsSection doctors={data.featuredDoctors} />
      <PromotionsSection promotions={data.promotions} />
      <AboutSection address={data.clinic.address} />
      <ContactsSection clinic={data.clinic} />
    </>
  );
}
