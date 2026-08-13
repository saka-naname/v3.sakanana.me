import type { CollectionEntry } from "astro:content";

export type WorkEntry = CollectionEntry<"work">;

export const kindLabels: Record<WorkEntry["data"]["kind"], string> = {
  software: "Software",
  illustration: "Illustration",
  music: "Music",
  other: "Other",
};

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "2-digit",
});

export const formatPublishedDate = (date: Date) =>
  dateFormatter.format(date).replace("/", ".");
