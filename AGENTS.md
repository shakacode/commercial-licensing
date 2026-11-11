# AGENTS.md — ShakaCode Commercial Licensing

This public repository contains ShakaCode's reusable licensing philosophy,
templates, and documentation.

## Rules for agents

- Keep this repository public-safe.
- Do not include confidential strategy, private pricing debates, prospect names,
  or private sales notes.
- The complete license file delivered with a product release governs that release.
  `license/` is where those files are written for future releases.
- Legal wording should be framed as template/business intent unless counsel has
  approved it.
- Preserve developer-friendly tone:
  - clear
  - firm
  - not moralizing
  - not scary
  - not open-washing
- Do not call source-available commercial products “open source” unless the
  applicable license version has converted to an OSI-approved license.

## Agent Workflow Configuration

Portable shared skills resolve this repo's commands and policy through:
- **Commands** — run `.agents/shaka/bin/<name>` (`setup`, `validate`, `test`, ...); see `.agents/shaka/bin/README.md`. A missing script means that capability is n/a here.
- **Policy / config** — `.agents/shaka/config.yml`.
- **Review:** Licensing wording stays with maintainers. The weekly license fleet check detects drift in product branches.
