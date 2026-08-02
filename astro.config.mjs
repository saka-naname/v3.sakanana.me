// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Kiwi Maru",
      cssVariable: "--font-kiwi-maru",
      fallbacks: ["serif"],
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

  integrations: [icon()],
});
