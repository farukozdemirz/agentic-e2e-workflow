export type ParsedPrice = {
  value: number;
  unit: "TRY" | "GRAM_AU" | "GRAM" | "UNKNOWN";
};

export function parsePriceText(raw: string): ParsedPrice | null {
  if (!raw) return null;

  const text = raw.trim();

  let unit: ParsedPrice["unit"] = "UNKNOWN";

  if (text.endsWith("TL")) {
    unit = "TRY";
  } else if (text.toLowerCase().includes("gr au")) {
    unit = "GRAM_AU";
  } else if (text.toLowerCase().includes("gram")) {
    unit = "GRAM";
  }

  const numericPart = text
    .replace(/TL|gr Au|gram/gi, "")
    .replace(/[^\d.,]/g, "")
    .trim();

  if (!numericPart) return null;

  const normalized = numericPart.replace(/\./g, "").replace(",", ".");

  const value = Number(normalized);

  if (Number.isNaN(value)) return null;

  return { value, unit };
}
