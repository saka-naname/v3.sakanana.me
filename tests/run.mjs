import { execFileSync, spawnSync } from "node:child_process";
import {
  constants,
  copyFileSync,
  mkdtempSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
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
// src/content/test/notes/ の下のディレクトリ。TEST_NOTES で選んだものだけを読み込む
const validNotes = "valid";
const invalidNotes = ["url-only", "medium-only"];
const created = [];
const buildRoot = mkdtempSync(join(tmpdir(), "sakanana-test-"));
let started = false;

const withTestNotes = (testNotes) => ({
  ...process.env,
  TEST_NOTES: testNotes,
});

// 不正な frontmatter のノートを1組ずつ読み込み、コンテンツの同期が失敗するかを記録する
function checkInvalidNotes() {
  const results = {};
  for (const name of invalidNotes) {
    const result = spawnSync(process.execPath, [astro, "sync"], {
      encoding: "utf8",
      env: withTestNotes(`invalid-${name}`),
    });
    results[name] = {
      status: result.status,
      output: `${result.stdout}\n${result.stderr}`,
    };
  }
  writeFileSync(
    join(buildRoot, "invalid-notes.json"),
    JSON.stringify(results, null, 2),
  );
}

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
  checkInvalidNotes();
  execFileSync(
    process.execPath,
    [astro, "build", "--outDir", join(buildRoot, "dist")],
    { stdio: "inherit", env: withTestNotes(validNotes) },
  );
  execFileSync(
    process.execPath,
    [astro, "dev", "--background", "--port", "4322"],
    { stdio: "inherit", env: withTestNotes(validNotes) },
  );
  started = true;
  execFileSync(
    process.execPath,
    ["node_modules/@playwright/test/cli.js", "test", ...process.argv.slice(2)],
    {
      stdio: "inherit",
      env: { ...process.env, TEST_BUILD_ROOT: buildRoot },
    },
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
  rmSync(buildRoot, { recursive: true, force: true });
}
