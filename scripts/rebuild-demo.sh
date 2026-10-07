#!/usr/bin/env bash
# Rebuilds the demo at website/public/demo/ from hivemind-ui and opens a pull request.
#
# The demo is hivemind-ui's read-only snapshot build (`npm run build:demo`): the
# app over example data, labelled "Example data", with no server and no sign-in.
# This script builds it from one hivemind-ui commit in a temporary clone (the
# checkout it is pointed at is never touched), adds a page for every link the app
# makes (scripts/demo-routes.mjs), replaces website/public/demo/ with the result,
# records the commit in website/public/demo/build.json, and opens a pull request
# listing the UI commits since the last build. Merging it deploys the demo.
#
# Usage:
#   scripts/rebuild-demo.sh [--no-pr] <hivemind-ui repository> [<ref>]
#
#   <repository>  anything `git clone` takes: a path or a URL
#   <ref>         a branch, tag or commit; default main
#   --no-pr       only rebuild website/public/demo/ in this working tree
#
# Needs git, Node (^20.19 or >=22.12), npm, rsync, jq, and for a pull request a
# logged-in gh.
set -euo pipefail

pr=1
if [[ ${1:-} == --no-pr ]]; then
  pr=0
  shift
fi
if [[ $# -lt 1 || $# -gt 2 ]]; then
  sed -n '12,17p' "$0" >&2
  exit 2
fi
repo=$1
ref=${2:-main}

site=$(git -C "$(dirname "$0")" rev-parse --show-toplevel)
demo=website/public/demo
cd "$site"

# The demo sits under the site's base path, read from the siteUrl line in astro.config.mjs.
site_url=$(sed -n "s|^const siteUrl = new URL('\(.*\)');\$|\1|p" website/astro.config.mjs)
[[ -n $site_url ]] || { echo "rebuild-demo: no siteUrl line in website/astro.config.mjs" >&2; exit 1; }
site_path=${site_url#*://*/}
base=/${site_path}demo/

if [[ $pr == 1 && -n $(git status --porcelain) ]]; then
  echo "rebuild-demo: the working tree has changes; commit them or set them aside first" >&2
  exit 1
fi

work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
ui=$work/hivemind-ui

echo "==> cloning $repo at $ref"
git clone -q --no-checkout "$repo" "$ui"
commit=$(git -C "$ui" rev-parse --verify -q "origin/$ref^{commit}" || git -C "$ui" rev-parse --verify "$ref^{commit}")
git -C "$ui" checkout -q --detach "$commit"
short=${commit:0:7}
echo "    $(git -C "$ui" log -1 --format='%h %s')"

echo "==> building the demo for $base"
(cd "$ui" && npm ci --no-audit --no-fund --loglevel=error && DEMO_BASE=$base npm run build:demo)

echo "==> writing a page for every link the app makes"
cp scripts/demo-routes.mjs "$ui/"
(cd "$ui" && node demo-routes.mjs dist "$base")
jq -n --arg commit "$commit" '{hivemind_ui: $commit}' >"$ui/dist/build.json"

previous=$(jq -r '.hivemind_ui // empty' "$demo/build.json" 2>/dev/null || true)
if [[ $pr == 1 ]]; then
  git fetch -q origin main
  git switch -q -c "demo/hivemind-ui-$short" origin/main
fi
rsync -a --delete "$ui/dist/" "$demo/"

if [[ -z $(git status --porcelain -- "$demo") ]]; then
  echo "==> $demo already holds this build; nothing to do"
  [[ $pr == 1 ]] && git switch -q - && git branch -q -D "demo/hivemind-ui-$short"
  exit 0
fi
echo "==> $demo now holds hivemind-ui $short"

changes="(unknown: no earlier build is recorded, or its commit is not in this hivemind-ui history)"
if [[ -n $previous ]] && git -C "$ui" merge-base --is-ancestor "$previous" "$commit" 2>/dev/null; then
  changes=$(git -C "$ui" log --no-merges --format='- %s' "$previous..$commit")
fi
printf 'UI changes since the last build:\n%s\n' "$changes"
[[ $pr == 0 ]] && exit 0

title="demo: rebuild from hivemind-ui $short"
git add -A -- "$demo"
git commit -q -m "$title" -m "UI changes since the last build:" -m "$changes"
git push -q -u origin HEAD
gh pr create --base main --title "$title" --body-file - <<EOF
Rebuilds \`website/public/demo/\` with \`scripts/rebuild-demo.sh\` from hivemind-ui \`$commit\` (was \`${previous:-unknown}\`).

UI changes since the last build:

$changes

Check it before merging: \`cd website && npm ci && npm run build && npx astro preview\`, then open http://localhost:4321${base}. Merging deploys it.
EOF
