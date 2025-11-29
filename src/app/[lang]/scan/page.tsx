import { getDictionary } from "@/lib/dictionary";
import ScanClient from "./ScanClient";

export default async function ScanPage({
  params,
}: {
  params: Promise<{ lang: "en" | "ko" | "ja" | "th" }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <ScanClient dictionary={dictionary} lang={lang} />;
}
