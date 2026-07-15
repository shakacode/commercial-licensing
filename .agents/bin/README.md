# Agent Workflow Scripts

Standard entry points that portable agent-workflow skills call, so a skill can
run `.agents/bin/<name>` in any repo without knowing this repo's specific
commands. Each script is a thin, repo-owned wrapper. A script that is **absent**
means that capability is n/a here.

| Script | Purpose | This repo runs |
| --- | --- | --- |
| `setup` | Install dependencies | n/a |
| `validate` | Pre-push gate | Refreshes the configured `origin` base ref whenever `origin` is reachable (including when a remote-tracking ref already exists), then falls back to the existing remote-tracking or local branch when offline. It runs Git whitespace checks for unstaged and staged content, refreshes shallow history to obtain a merge base before checking the PR range, and clearly reports when base-range checks cannot run. It also rejects invalid UTF-8 in tracked Markdown documentation from the working tree, index, `HEAD`, and every Markdown blob changed since the merge base, including merge-commit resolution blobs, so an uncommitted replacement cannot hide invalid content that would be pushed. It rejects invalid policy YAML. |
| `test` | Run tests | verify the required portable workflow-policy keys |
| `lint` | Lint / format | n/a |
| `build` | Build / type-check | n/a |
| `docs` | Docs checks | n/a |
| `ci-detect` | CI change detector | n/a |

Non-command policy lives in [`../agent-workflow.yml`](../agent-workflow.yml).
