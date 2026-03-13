import assert from "node:assert/strict";
import test from "node:test";

import { type NavCollapsible, type NavLink } from "@/lib/types";
import {
  checkIsActive,
  checkIsGroupActive,
  checkIsLocked,
  matchesPathPattern,
  normalizePath,
} from "./nav-group.utils";

const recipesNavLink: NavLink = {
  title: "Recipes",
  url: "/dashboard",
  activeUrls: ["/dashboard/[slug]"],
};

const settingsCollapsible: NavCollapsible = {
  title: "Settings",
  items: [
    {
      title: "Profile",
      url: "/settings",
    },
    {
      title: "Billing",
      url: "/settings/billing",
    },
  ],
};

test("normalizePath strips query/hash and trailing slash", () => {
  assert.equal(normalizePath("/dashboard/?tab=all#anchor"), "/dashboard");
  assert.equal(normalizePath("/"), "/");
});

test("matchesPathPattern supports dynamic segment notation", () => {
  assert.equal(
    matchesPathPattern("/dashboard/vercel", "/dashboard/[slug]"),
    true,
  );
  assert.equal(
    matchesPathPattern("/dashboard/vercel/stats", "/dashboard/[slug]"),
    false,
  );
});

test("checkIsActive matches by explicit dynamic activeUrls", () => {
  assert.equal(checkIsActive("/dashboard/vercel", recipesNavLink), true);
  assert.equal(checkIsActive("/analytics", recipesNavLink), false);
});

test("checkIsActive bubbles through collapsible children", () => {
  assert.equal(checkIsActive("/settings/billing", settingsCollapsible), true);
  assert.equal(checkIsActive("/settings/team", settingsCollapsible), false);
});

test("checkIsGroupActive returns true when one item is active", () => {
  const groupItems = [recipesNavLink, settingsCollapsible];
  assert.equal(checkIsGroupActive("/settings", groupItems), true);
  assert.equal(checkIsGroupActive("/commits", groupItems), false);
});

test("checkIsLocked gates requiresAuth items", () => {
  const privateLink: NavLink = {
    title: "Private",
    url: "/private",
    requiresAuth: true,
  };

  assert.equal(checkIsLocked(privateLink, false), true);
  assert.equal(checkIsLocked(privateLink, true), false);
});
