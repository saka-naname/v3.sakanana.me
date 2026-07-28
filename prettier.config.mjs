/** @type {import("prettier").Config} */
const config = {
  plugins: ["prettier-plugin-astro"],
  singleQuote: false,
  tabWidth: 2,
  useTabs: false,
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};

export default config;
