// @ts-check
import mdx from "@astrojs/mdx";
import { defineConfig, fontProviders } from "astro/config";
import icon from "astro-icon";

export default defineConfig({
  site: "https://sakanana.me",

  image: {
    layout: "constrained",
    responsiveStyles: true,
  },

  fonts: [
    {
      provider: fontProviders.local(),
      name: "KT Kiyosuna Sans",
      cssVariable: "--font-kiyosuna-sans",
      fallbacks: ["sans-serif"],
      options: {
        variants: [
          {
            weight: 300,
            style: "normal",
            src: ["./src/assets/fonts/KiyosunaSans-L-1.0.1.woff2"],
          },
          {
            weight: 700,
            style: "normal",
            src: ["./src/assets/fonts/KiyosunaSans-B-1.0.1.woff2"],
          },
        ],
      },
    },
    {
      provider: fontProviders.fontsource(),
      name: "Zen Kaku Gothic Antique",
      cssVariable: "--font-zen-kaku-gothic-antique",
      fallbacks: ["sans-serif"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "SUSE Mono",
      cssVariable: "--font-suse-mono",
      fallbacks: ["ui-monospace", "monospace"],
    },
  ],

  integrations: [icon(), mdx()],
});
