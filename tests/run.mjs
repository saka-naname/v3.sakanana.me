import { execFileSync } from "node:child_process";
import { constants, copyFileSync, unlinkSync } from "node:fs";
import process from "node:process";

const astro = "node_modules/astro/bin/astro.mjs";
const fixtures = [
  [
    "tests/fixtures/image-warning.md",
    "src/content/demo/works/image-warning-test.md",
  ],
  [
    "tests/fixtures/image-warning.astro.txt",
    "src/pages/image-warning-test.astro",
  ],
];
const created = [];
let started = false;

try {
  const status = execFileSync(process.execPath, [astro, "dev", "status"], {
    encoding: "utf8",
  });
  if (status.includes("Dev server running at")) {
    throw new Error(
      "Stop the existing dev server before running browser tests.",
    );
  }
  for (const [source, destination] of fixtures) {
    copyFileSync(source, destination, constants.COPYFILE_EXCL);
    created.push(destination);
  }
  execFileSync(
    process.execPath,
    [astro, "dev", "--background", "--port", "4322"],
    {
      stdio: "inherit",
    },
  );
  started = true;
  execFileSync(
    process.execPath,
    ["node_modules/@playwright/test/cli.js", "test", ...process.argv.slice(2)],
    { stdio: "inherit" },
  );
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = error.status || 1;
} finally {
  if (started) {
    execFileSync(process.execPath, [astro, "dev", "stop"], {
      stdio: "inherit",
    });
  }
  for (const path of created) unlinkSync(path);
}
