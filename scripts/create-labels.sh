#!/usr/bin/env bash
set -euo pipefail

OWNER="${OWNER:-shakacode}"
REPO="${REPO:-commercial-licensing}"

create_label() {
  local name="$1"
  local color="$2"
  local description="$3"
  gh label create "$name" --repo "$OWNER/$REPO" --color "$color" --description "$description" 2>/dev/null \
    || gh label edit "$name" --repo "$OWNER/$REPO" --color "$color" --description "$description"
}

create_label "area:licensing" "5319e7" "Licensing docs and templates"
create_label "area:agents" "1d76db" "Agent-related licensing instructions"
create_label "type:docs" "0075ca" "Documentation"
create_label "type:template" "c5def5" "Reusable templates"
create_label "priority:p0" "b60205" "Must do first"
create_label "priority:p1" "d93f0b" "Important"
create_label "status:needs-human-review" "fbca04" "Needs human review"
create_label "status:ready-for-codex" "0e8a16" "Ready for Codex"
