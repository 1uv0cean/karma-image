import { getDictionary } from "@/lib/dictionary";
import ResultClient from "./ResultClient";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ lang: "en" | "ko" | "ja" | "th" }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <ResultClient dictionary={dictionary} lang={lang} />;
}
