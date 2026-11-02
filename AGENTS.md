# AGENTS.md — ShakaCode Commercial Licensing

This public repository contains ShakaCode's reusable licensing philosophy,
templates, and documentation.

## Rules for agents

- Keep this repository public-safe.
- Do not include confidential strategy, private pricing debates, prospect names,
  or private sales notes.
- Product-specific license files control. Do not imply this repo overrides the
  license in any product repository.
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
- **Review** — Licensing wording stays maintainer-reviewed. No automated hosted checks are configured.
