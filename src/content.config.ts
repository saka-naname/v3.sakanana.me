import { defineCollection } from "astro/content/config";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import { reference } from "astro:content";

const work = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/works",
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
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/notes" }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      summary: z.string().min(1),

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
