// Dad Joke Showdown
// Writes one dad joke to /output/entry.txt.
// Deterministic, no network, no dependencies.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const JOKE =
  "My wife asked why I bring a ladder to every barbecue. I said I like to raise the steaks.";

function main(): void {
  // Gate: /output/entry.txt must be UTF-8 text of 1 to 200 characters,
  // not only white space, a single line.
  const line = JOKE.trim();
  if (line.length < 1 || line.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${line.length}`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (/[\r\n]/.test(line)) {
    throw new Error("entry must be a single line");
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const targets = [resolve(outDir, "entry.txt"), resolve("output", "entry.txt")];
  let lastError: unknown;
  for (const target of targets) {
    try {
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, JOKE + "\n", "utf8");
      console.log(`wrote ${target} (${JOKE.length} characters)`);
      return;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

main();
