import { getDictionary } from "@/lib/dictionary";
import LandingClient from "./LandingClient";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ lang: "en" | "ko" | "ja" | "th" }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <LandingClient dictionary={dictionary} />;
}
