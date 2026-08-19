import type { CollectionEntry } from "astro:content";

export type NoteEntry = CollectionEntry<"note">;

export const noteCategoryOrder = [
  "engineering",
  "making",
  "diary",
  "memorandum",
  "tips",
] as const satisfies ReadonlyArray<NoteEntry["data"]["category"]>;

export const noteCategoryLabels: Record<NoteEntry["data"]["category"], string> =
  {
    engineering: "Engineering",
    making: "Making",
    diary: "Diary",
    memorandum: "Memorandum",
    tips: "Tips",
  };

const fullDateFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const formatNoteDate = (date: Date) =>
  fullDateFormatter.format(date).replaceAll("/", ".");

export const compareNotesByPublishedAt = (a: NoteEntry, b: NoteEntry) =>
  b.data.publishedAt.getTime() - a.data.publishedAt.getTime() ||
  a.data.slug.localeCompare(b.data.slug);
