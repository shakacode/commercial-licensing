#!/usr/bin/env bash
# Focused regression coverage for the portable pre-push wrapper.
set -euo pipefail

repo_root="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
tmpdir="$(mktemp -d)"
trap 'rm -rf "${tmpdir}"' EXIT

fixture="${tmpdir}/fixture"
origin="${tmpdir}/origin.git"
shallow="${tmpdir}/shallow"
mkdir -p "${fixture}"
git init --initial-branch=main "${fixture}" >/dev/null
git -C "${fixture}" config user.email seam-test@example.invalid
git -C "${fixture}" config user.name 'Seam Test'
mkdir -p "${fixture}/.agents/bin"
cp "${repo_root}/.agents/agent-workflow.yml" "${fixture}/.agents/agent-workflow.yml"
cp "${repo_root}/.agents/bin/validate" "${fixture}/.agents/bin/validate"
cp "${repo_root}/AGENTS.md" "${repo_root}/CLAUDE.md" "${repo_root}/README.md" "${fixture}/"
cp "${repo_root}/.agents/bin/README.md" "${fixture}/.agents/bin/README.md"
git -C "${fixture}" add .
git -C "${fixture}" commit -m 'base' >/dev/null
git -C "${fixture}" checkout -b feature >/dev/null
printf '\nFeature line.\n' >> "${fixture}/README.md"
git -C "${fixture}" add README.md
git -C "${fixture}" commit -m 'feature' >/dev/null
git init --bare "${origin}" >/dev/null
git -C "${fixture}" remote add origin "${origin}"
git -C "${fixture}" push --all origin >/dev/null
git -C "${fixture}" checkout main >/dev/null
printf '\nBase update.\n' >> "${fixture}/README.md"
git -C "${fixture}" add README.md
git -C "${fixture}" commit -m 'base update' >/dev/null
git -C "${fixture}" push origin main >/dev/null
expected_base="$(git -C "${fixture}" rev-parse main)"

git clone --depth 1 --branch feature "file://${origin}" "${shallow}" >/dev/null
"${shallow}/.agents/bin/validate" >"${tmpdir}/validate.out" 2>"${tmpdir}/validate.err"
if grep -q 'skipping base-range' "${tmpdir}/validate.err"; then
  echo 'shallow clone did not recover a merge base' >&2
  exit 1
fi
[[ "$(git -C "${shallow}" rev-parse origin/main)" == "${expected_base}" ]]

printf '\377\n' > "${shallow}/README.md"
git -C "${shallow}" add README.md
git -C "${shallow}" show HEAD:README.md > "${shallow}/README.md"
if "${shallow}/.agents/bin/validate" >"${tmpdir}/invalid-utf8.out" 2>"${tmpdir}/invalid-utf8.err"; then
  echo 'staged invalid UTF-8 unexpectedly passed validation' >&2
  exit 1
fi
grep -q 'invalid UTF-8 in staged README.md' "${tmpdir}/invalid-utf8.err"
git -C "${shallow}" reset --hard HEAD >/dev/null

printf 'trailing whitespace \n' > "${shallow}/README.md"
git -C "${shallow}" add README.md
git -C "${shallow}" show HEAD:README.md > "${shallow}/README.md"
if "${shallow}/.agents/bin/validate" >"${tmpdir}/staged-whitespace.out" 2>"${tmpdir}/staged-whitespace.err"; then
  echo 'staged whitespace unexpectedly passed validation' >&2
  exit 1
fi
grep -q 'trailing whitespace' "${tmpdir}/staged-whitespace.out"
git -C "${shallow}" reset --hard HEAD >/dev/null

git -C "${shallow}" remote set-url origin "${tmpdir}/unreachable-origin.git"
"${shallow}/.agents/bin/validate"
git -C "${shallow}" remote remove origin
"${shallow}/.agents/bin/validate"

# A valid staged replacement must not hide invalid Markdown already committed
# on the branch, including after a later commit repairs HEAD.
committed_fixture="${tmpdir}/committed-fixture"
git init --initial-branch=main "${committed_fixture}" >/dev/null
git -C "${committed_fixture}" config user.email seam-test@example.invalid
git -C "${committed_fixture}" config user.name 'Seam Test'
mkdir -p "${committed_fixture}/.agents/bin"
cp "${repo_root}/.agents/bin/validate" "${committed_fixture}/.agents/bin/validate"
cp "${repo_root}/.agents/agent-workflow.yml" "${committed_fixture}/.agents/agent-workflow.yml"
chmod +x "${committed_fixture}/.agents/bin/validate"
printf '# valid\n' > "${committed_fixture}/README.md"
git -C "${committed_fixture}" add .
git -C "${committed_fixture}" commit -m 'base' >/dev/null
git -C "${committed_fixture}" checkout -b feature >/dev/null
printf '# broken \377\n' > "${committed_fixture}/README.md"
git -C "${committed_fixture}" add README.md
git -C "${committed_fixture}" commit -m 'invalid committed Markdown' >/dev/null

printf '# repaired\n' > "${committed_fixture}/README.md"
git -C "${committed_fixture}" add README.md
if "${committed_fixture}/.agents/bin/validate" >"${tmpdir}/committed-head.out" 2>&1; then
  echo 'committed invalid UTF-8 unexpectedly passed validation' >&2
  exit 1
fi
grep -q 'invalid UTF-8 in committed HEAD README.md' "${tmpdir}/committed-head.out"

git -C "${committed_fixture}" commit -m 'repair staged Markdown' >/dev/null
if "${committed_fixture}/.agents/bin/validate" >"${tmpdir}/committed-range.out" 2>&1; then
  echo 'invalid UTF-8 in commit range unexpectedly passed validation' >&2
  exit 1
fi
grep -q 'invalid UTF-8 in committed ' "${tmpdir}/committed-range.out"
