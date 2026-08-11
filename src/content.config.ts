import { defineCollection } from "astro/content/config";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const work = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/works" }),
  schema: ({ image }) => {
    const base = z.object({
      title: z.string().min(1),
      summary: z.string().min(1),

      status: z.enum(["wip", "released"]),
      cover: z.object({
        image: image(),
        alt: z.string().min(1),
      }),

      links: z.array(
        z.object({
          type: z.enum(["source", "website", "download", "article", "other"]),
          label: z.string().min(1),
          url: z.url(),
        }),
      ),
      tags: z.array(z.string()),
      pubDate: z.date(),
      draft: z.boolean().optional(),
    });

    return z.discriminatedUnion("kind", [
      base.extend({
        kind: z.literal("software"),
        details: z.object({}),
      }),
      base.extend({
        kind: z.literal("illustration"),
        details: z.object({}),
      }),
      base.extend({
        kind: z.literal("music"),
        details: z.object({}),
      }),
      base.extend({
        kind: z.literal("other"),
        details: z.object({}),
      }),
    ]);
  },
});

export const collections = { work };
