import type { CollectionEntry } from "astro:content";

type PublicContentEntry = CollectionEntry<"note"> | CollectionEntry<"work">;

const demoContentDirectories = [
  "src/content/notes/demo/",
  "src/content/works/demo/",
];

export function isPublicContentEntry(entry: PublicContentEntry): boolean {
  if (!entry.filePath) {
    throw new Error(
      `Local ${entry.collection} entry "${entry.id}" does not have a file path`,
    );
  }

  if (entry.data.draft) return false;

  const filePath = entry.filePath.replaceAll("\\", "/");
  const isDemo = demoContentDirectories.some((directory) =>
    filePath.startsWith(directory),
  );

  return !import.meta.env.PROD || !isDemo;
}
