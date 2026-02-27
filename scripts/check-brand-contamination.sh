#!/usr/bin/env bash
set -euo pipefail

TARGET_DIR="src/app/(portal)/app"
BANNED_PATTERN="Justin Robinson|robinsonfit|Admin CRM Mockup|Justin Performance CRM|MOCKUP MODE"

if [ ! -d "$TARGET_DIR" ]; then
  echo "Missing portal directory: $TARGET_DIR"
  exit 1
fi

FILES=(
  "src/app/(portal)/app/layout.tsx"
  "src/app/(portal)/app/Sidebar.tsx"
  "src/app/(portal)/app/page.tsx"
  "src/app/(portal)/app/leads/page.tsx"
  "src/app/(portal)/app/leads/[id]/page.tsx"
  "src/app/(portal)/app/clients/page.tsx"
  "src/app/(portal)/app/clients/[id]/page.tsx"
  "src/app/(portal)/app/meals/page.tsx"
  "src/app/(portal)/app/workouts/page.tsx"
  "src/app/(portal)/app/analytics/page.tsx"
  "src/app/(portal)/app/settings/page.tsx"
  "src/app/(portal)/app/onboarding/page.tsx"
)

for file in "${FILES[@]}"; do
  if [ ! -f "$file" ]; then
    continue
  fi
  if grep -nE "$BANNED_PATTERN" "$file"; then
    echo ""
    echo "Brand contamination detected in $file"
    exit 1
  fi
done

echo "Brand contamination check passed."
