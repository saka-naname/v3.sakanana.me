import { existsSync } from "node:fs";

import { defineCollection } from "astro/content/config";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import { reference } from "astro:content";

const workEntryBySlug = new Map<string, string>();
const workSlugByEntry = new Map<string, string>();
const noteEntryBySlug = new Map<string, string>();
const noteSlugByEntry = new Map<string, string>();

const work = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/works",
    generateId: ({ base, data, entry }) => {
      if (typeof data.slug !== "string") {
        throw new Error(`Work entry ${entry} requires a slug`);
      }

      const previousSlug = workSlugByEntry.get(entry);
      if (
        previousSlug !== undefined &&
        previousSlug !== data.slug &&
        workEntryBySlug.get(previousSlug) === entry
      ) {
        workEntryBySlug.delete(previousSlug);
      }

      const existingEntry = workEntryBySlug.get(data.slug);
      if (existingEntry !== undefined && existingEntry !== entry) {
        const existingFile = new URL(encodeURI(existingEntry), base);
        if (existsSync(existingFile)) {
          throw new Error(
            `Duplicate work slug "${data.slug}" in ${existingEntry} and ${entry}`,
          );
        }

        workSlugByEntry.delete(existingEntry);
      }

      workEntryBySlug.set(data.slug, entry);
      workSlugByEntry.set(entry, data.slug);

      return data.slug;
    },
  }),
  schema: ({ image }) => {
    const base = z.object({
      title: z.string().min(1),
      summary: z.string().min(1),
      slug: z
        .string()
        .regex(
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          "slug must use lowercase ASCII kebab-case",
        ),

      status: z.enum(["wip", "released"]),
      images: z
        .array(
          z.object({
            image: image(),
            alt: z.string().min(1),
          }),
        )
        .min(1),

      collaboration: z.discriminatedUnion("type", [
        z.object({
          type: z.literal("personal"),
        }),
        z.object({
          type: z.literal("organization"),
          organization: z.string().min(1),
        }),
      ]),
      links: z.array(
        z.object({
          type: z.enum(["source", "website", "download", "article", "other"]),
          label: z.string().min(1),
          url: z.url(),
        }),
      ),
      tags: z.array(z.string()),
      publishedAt: z.date(),
      draft: z.boolean().optional(),
    });

    return z.discriminatedUnion("kind", [
      base.extend({
        kind: z.literal("development"),
        details: z.object({
          platforms: z.array(
            z.enum(["web-frontend", "web-backend", "desktop", "cli", "other"]),
          ),
          stacks: z.array(z.string().min(1)),
        }),
      }),
      base.extend({
        kind: z.literal("illustration"),
      }),
      base.extend({
        kind: z.literal("music"),
      }),
      base.extend({
        kind: z.literal("other"),
      }),
    ]);
  },
});

const note = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/notes",
    generateId: ({ base, data, entry }) => {
      if (typeof data.slug !== "string") {
        throw new Error(`Note entry ${entry} requires a slug`);
      }

      const previousSlug = noteSlugByEntry.get(entry);
      if (
        previousSlug !== undefined &&
        previousSlug !== data.slug &&
        noteEntryBySlug.get(previousSlug) === entry
      ) {
        noteEntryBySlug.delete(previousSlug);
      }

      const existingEntry = noteEntryBySlug.get(data.slug);
      if (existingEntry !== undefined && existingEntry !== entry) {
        const existingFile = new URL(encodeURI(existingEntry), base);
        if (existsSync(existingFile)) {
          throw new Error(
            `Duplicate note slug "${data.slug}" in ${existingEntry} and ${entry}`,
          );
        }

        noteSlugByEntry.delete(existingEntry);
      }

      noteEntryBySlug.set(data.slug, entry);
      noteSlugByEntry.set(entry, data.slug);

      return data.slug;
    },
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      summary: z.string().min(1),
      slug: z
        .string()
        .regex(
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          "slug must use lowercase ASCII kebab-case",
        ),

      category: z.enum([
        "engineering",
        "making",
        "diary",
        "memorandum",
        "tips",
      ]),
      cover: z
        .object({
          image: image(),
          alt: z.string().min(1),
        })
        .optional(),

      tags: z.array(z.string()),
      publishedAt: z.date(),
      updatedAt: z.date().optional(),
      draft: z.boolean().optional(),

      relatedWorks: z.array(reference("work")),
    }),
});

const homeCuration = defineCollection({
  loader: file("./src/content/home-curation.yaml"),
  schema: z.object({
    highlights: z.array(reference("work")),
    selectedNotes: z.array(reference("note")),
  }),
});

const worksCuration = defineCollection({
  loader: file("./src/content/works-curation.yaml"),
  schema: z.object({
    featured: z.array(reference("work")),
  }),
});

export const collections = { work, note, homeCuration, worksCuration };
