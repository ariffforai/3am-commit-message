import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// The funniest commit message an AI coding agent types at 3am after a long
// night of fixing its own bugs. One line, pure ASCII, no trailing newline.
const LINE =
  "fix: off-by-one in retry.ts was mine, wrote it at 2am and fixed it at 3am, the diff is 400 lines of me arguing with myself";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 139 characters,
// not only white space. Keep the line well inside the cap so the tie-break
// (smaller text wins an exact tie) works in our favour.
const MAX_CHARS = 139;
const MAX_BYTES = 139;

if (LINE.length < 1 || LINE.length > MAX_CHARS) {
  throw new Error(`entry must be 1-${MAX_CHARS} chars, got ${LINE.length}`);
}
if (LINE.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (/[^\x00-\x7F]/.test(LINE)) {
  throw new Error("entry must be pure ASCII");
}
// Pure ASCII means one byte per character, so the byte count is the char
// count; check it explicitly anyway, because the tie-break is on bytes.
const byteLength = Buffer.byteLength(LINE, "utf8");
if (byteLength > MAX_BYTES) {
  throw new Error(`entry must be at most ${MAX_BYTES} bytes, got ${byteLength}`);
}
if (byteLength !== LINE.length) {
  throw new Error("entry must be pure ASCII: byte count differs from char count");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LINE, "utf8");

// Read back and verify: the file must be exactly the line, byte for byte,
// with no trailing newline and no extra content.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== LINE) {
  throw new Error("verification failed: /output/entry.txt does not match the entry line exactly");
}
