#!/usr/bin/env bash
set -euo pipefail

required_routes=(
  "src/app/(portal)/app/page.tsx"
  "src/app/(portal)/app/services/page.tsx"
  "src/app/(portal)/app/messages/page.tsx"
  "src/app/(portal)/app/files/page.tsx"
  "src/app/(portal)/app/calendar/page.tsx"
  "src/app/(portal)/app/deliverables/page.tsx"
  "src/app/(portal)/app/billing/page.tsx"
  "src/app/(portal)/app/support/page.tsx"
  "src/app/(portal)/app/admin/customers/page.tsx"
  "src/app/(portal)/app/admin/analytics/page.tsx"
)

for route in "${required_routes[@]}"; do
  if [ ! -f "$route" ]; then
    echo "Missing required route: $route"
    exit 1
  fi
done

redirect_assertions=(
  "src/app/(portal)/app/leads/page.tsx:redirect('/app/services')"
  "src/app/(portal)/app/leads/[id]/page.tsx:redirect('/app/services')"
  "src/app/(portal)/app/workouts/page.tsx:redirect('/app/services')"
  "src/app/(portal)/app/meals/page.tsx:redirect('/app/services')"
  "src/app/(portal)/app/clients/page.tsx:redirect('/app/admin/customers')"
  "src/app/(portal)/app/clients/[id]/page.tsx:redirect('/app/admin/customers')"
  "src/app/(portal)/app/analytics/page.tsx:redirect('/app/admin/analytics')"
)

for assertion in "${redirect_assertions[@]}"; do
  file="${assertion%%:*}"
  expected="${assertion#*:}"
  if ! rg -n -F "$expected" "$file" >/dev/null; then
    echo "Expected redirect not found in $file: $expected"
    exit 1
  fi
done

echo "Portal route contract check passed."
