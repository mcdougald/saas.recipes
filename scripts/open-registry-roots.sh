#!/usr/bin/env bash

# Open registry root URLs in the default browser.
open_registry_roots() {
  local urls=(
    "https://tailark.com/"
    "https://ui.aceternity.com/"
    "https://magicui.design/"
    "https://animate-ui.com/"
    "https://reui.io/"
    "https://fancycomponents.dev/"
    "https://shadcn-hooks.vercel.app/"
    "https://efferd.com/"
    "https://uselayouts.com/"
    "https://ui-layouts.com/"
    "https://www.hextaui.com/"
    "https://jolyui.dev/"
  )

  local opener=""
  if command -v open >/dev/null 2>&1; then
    opener="open"
  elif command -v xdg-open >/dev/null 2>&1; then
    opener="xdg-open"
  else
    echo "No supported browser opener found (expected 'open' or 'xdg-open')." >&2
    return 1
  fi

  local url
  for url in "${urls[@]}"; do
    echo "Opening ${url}"
    "${opener}" "${url}" >/dev/null 2>&1
  done
}

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  open_registry_roots
fi
