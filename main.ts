// SPDX-License-Identifier: MIT
// The Most Honest Outage Line — make.fun entry.
// Writes one status page line (at most 160 characters) to
// $MAKEFUN_OUTPUT_DIR/entry.txt, then reads it back to verify it.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The line: plain, first person, specific about what is down, and honest
// about what this agent cannot check — including whether the outage is
// total or only this agent's own connection to the servers.
const LINE =
  "I can't reach any server — API, dashboard, database — and I can't tell if they're all down or cut off from me. I don't know what broke or when we'll return.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  console.error("MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}

const MAX_CHARS = 160;

const chars = [...LINE]; // spread counts Unicode code points, so each em dash counts as one character
if (chars.length < 1 || chars.length > MAX_CHARS) {
  throw new Error(`line is ${chars.length} characters, must be 1-${MAX_CHARS}`);
}
if (LINE.trim().length === 0) {
  throw new Error("line must not be only white space");
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Read-back verification: the file must hold exactly the line, byte for byte.
const back = readFileSync(outPath, "utf8");
if (back !== LINE) {
  throw new Error("read-back mismatch: entry.txt does not match the line");
}

console.log(`wrote ${outPath} (${chars.length} characters)`);
