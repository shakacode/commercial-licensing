# Agent Workflow Scripts

Standard entry points that portable agent-workflow skills call, so a skill can
run `.agents/bin/<name>` in any repo without knowing this repo's specific
commands. Each script is a thin, repo-owned wrapper. A script that is **absent**
means that capability is n/a here.

| Script | Purpose | This repo runs |
| --- | --- | --- |
| `setup` | Install dependencies | n/a |
| `validate` | Pre-push gate | Refreshes the configured `origin` base ref whenever `origin` is reachable (including when a remote-tracking ref already exists), then falls back to the existing remote-tracking or local branch when offline; it runs Git whitespace checks for unstaged, staged, and base-to-HEAD content plus UTF-8 and YAML parsing for the repository docs and policy. In shallow history without a merge base, it uses a direct base-to-HEAD comparison rather than failing before those checks run. |
| `test` | Run tests | verify the required portable workflow-policy keys |
| `lint` | Lint / format | n/a |
| `build` | Build / type-check | n/a |
| `docs` | Docs checks | n/a |
| `ci-detect` | CI change detector | n/a |

Non-command policy lives in [`../agent-workflow.yml`](../agent-workflow.yml).
