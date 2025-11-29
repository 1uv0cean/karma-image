import { getDictionary } from "@/lib/dictionary";
import ResultClient from "./ResultClient";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ lang: "en" | "ko" }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <ResultClient dictionary={dictionary} />;
}
