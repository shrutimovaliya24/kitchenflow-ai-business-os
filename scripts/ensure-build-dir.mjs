/**
 * Guards the build against OneDrive "Files On-Demand".
 *
 * This project lives inside a OneDrive-synced folder. OneDrive dehydrates
 * inactive files into cloud placeholders (NTFS reparse points). Node's
 * fs.readlink() fails on those with EINVAL, so a build or dev server that
 * touches a dehydrated file inside .next or node_modules dies with
 *   EINVAL: invalid argument, readlink '...\.next\package.json'
 *   PageNotFoundError: Cannot find module for page: /_document
 * and the page is served without its stylesheet — the browser then renders
 * unstyled HTML even though Tailwind compiled correctly.
 *
 * Pinning ("always keep on this device", attrib +P -U) stops OneDrive from
 * dehydrating those folders. This is a no-op on non-Windows platforms, so
 * Vercel builds are unaffected.
 */

import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

if (process.platform !== "win32") {
  process.exit(0);
}

const targets = [".next", "node_modules"];

for (const target of targets) {
  const dir = resolve(process.cwd(), target);
  try {
    mkdirSync(dir, { recursive: true });
    // +P = pin (always keep on this device), -U = clear "free up space"
    execFileSync("attrib", ["+P", "-U", dir], { stdio: "ignore" });
  } catch {
    // Not on a OneDrive/Files-On-Demand volume, or attrib unavailable.
    // Nothing to guard against here — carry on.
  }
}
