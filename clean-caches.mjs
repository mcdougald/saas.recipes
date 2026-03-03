#!/usr/bin/env node

import { readdir, rm } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const TARGET_DIRECTORIES = new Set([
  "node_modules",
  ".pnpm-store",
  ".turbo",
  ".next",
  "dist",
  "build",
  "out",
  "coverage",
  ".cache",
  ".parcel-cache",
  ".vite",
  ".svelte-kit",
  ".nuxt",
]);

const IGNORED_DIRECTORIES = new Set([".git"]);
const TARGET_FILE_SUFFIXES = [".tsbuildinfo"];

const removedPaths = [];

async function removeTarget(targetPath) {
  await rm(targetPath, { recursive: true, force: true });
  removedPaths.push(path.relative(root, targetPath) || ".");
}

async function walkDirectory(currentPath) {
  const entries = await readdir(currentPath, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(currentPath, entry.name);

    if (entry.isDirectory()) {
      if (IGNORED_DIRECTORIES.has(entry.name)) {
        continue;
      }

      if (TARGET_DIRECTORIES.has(entry.name)) {
        await removeTarget(entryPath);
        continue;
      }

      await walkDirectory(entryPath);
      continue;
    }

    if (entry.isFile()) {
      const shouldRemoveFile = TARGET_FILE_SUFFIXES.some((suffix) =>
        entry.name.endsWith(suffix),
      );

      if (shouldRemoveFile) {
        await removeTarget(entryPath);
      }
    }
  }
}

async function main() {
  await walkDirectory(root);

  if (removedPaths.length === 0) {
    console.log("No cache/build artifacts found.");
    return;
  }

  removedPaths.sort((a, b) => a.localeCompare(b));
  console.log(`Removed ${removedPaths.length} path(s):`);
  for (const removedPath of removedPaths) {
    console.log(`- ${removedPath}`);
  }
}

main().catch((error) => {
  console.error("Failed to clean cache/build artifacts.");
  console.error(error);
  process.exitCode = 1;
});
