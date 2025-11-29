import { getDictionary } from "@/lib/dictionary";
import QuizClient from "./QuizClient";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ lang: "en" | "ko" | "ja" | "th" }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <QuizClient dictionary={dictionary} lang={lang} />;
}
