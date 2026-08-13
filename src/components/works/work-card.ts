import type { CollectionEntry } from "astro:content";

export type WorkEntry = CollectionEntry<"work">;

export const kindLabels: Record<WorkEntry["data"]["kind"], string> = {
  development: "Development",
  illustration: "Illustration",
  music: "Music",
  other: "Other",
};

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "2-digit",
});

const fullDateFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const formatPublishedDate = (date: Date) =>
  dateFormatter.format(date).replace("/", ".");

export const formatPublishedDateFull = (date: Date) =>
  fullDateFormatter.format(date).replaceAll("/", ".");
