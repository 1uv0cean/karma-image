import { getDictionary } from "@/lib/dictionary";
import AnalysisClient from "./AnalysisClient";

export default async function AnalysisPage({
  params,
}: {
  params: Promise<{ lang: "en" | "ko" | "ja" | "th" }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <AnalysisClient dictionary={dictionary} lang={lang} />;
}
