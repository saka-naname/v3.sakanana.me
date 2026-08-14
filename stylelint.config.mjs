/** @type {import("stylelint").Config} */
export default {
  ignoreFiles: ["dist/**"],
  extends: [
    "stylelint-config-standard",
    "stylelint-config-html/astro",
    "stylelint-config-recess-order",
  ],
};
