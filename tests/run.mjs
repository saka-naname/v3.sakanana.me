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
const noteEntries = "src/content/entries/notes";
const fixtures = [
  [
    "tests/fixtures/image-warning.md",
    "src/content/demo/works/image-warning-test.md",
  ],
  [
    "tests/fixtures/image-warning.astro.txt",
    "src/pages/image-warning-test.astro",
  ],
  // 本番ビルドでは demo のコンテンツが出ないため、ノートの fixture は entries に置く
  [
    "tests/fixtures/cross-posted/cross-posted-note.md",
    `${noteEntries}/cross-posted-note-test.md`,
  ],
  [
    "tests/fixtures/cross-posted/regular-note.md",
    `${noteEntries}/regular-note-test.md`,
  ],
];
const invalidNoteFixtures = [
  ["url-only", "tests/fixtures/cross-posted/invalid-url-only.md"],
  ["medium-only", "tests/fixtures/cross-posted/invalid-medium-only.md"],
];
const created = [];
const buildRoot = mkdtempSync(join(tmpdir(), "sakanana-test-"));
let started = false;

function copyFixture(source, destination) {
  copyFileSync(source, destination, constants.COPYFILE_EXCL);
  created.push(destination);
}

function removeFixture(destination) {
  unlinkSync(destination);
  created.splice(created.indexOf(destination), 1);
}

// 不正な frontmatter のノートを1つずつ置き、コンテンツの同期が失敗するかを記録する
function checkInvalidNotes() {
  const results = {};
  for (const [name, source] of invalidNoteFixtures) {
    const destination = `${noteEntries}/invalid-${name}-test.md`;
    copyFixture(source, destination);
    try {
      const result = spawnSync(process.execPath, [astro, "sync"], {
        encoding: "utf8",
      });
      results[name] = {
        status: result.status,
        output: `${result.stdout}\n${result.stderr}`,
      };
    } finally {
      removeFixture(destination);
    }
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
  checkInvalidNotes();
  for (const [source, destination] of fixtures) {
    copyFixture(source, destination);
  }
  execFileSync(
    process.execPath,
    [astro, "build", "--outDir", join(buildRoot, "dist")],
    { stdio: "inherit" },
  );
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
