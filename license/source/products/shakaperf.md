---
slug: shakaperf
spdx: LicenseRef-ShakaStack-1.0-ShakaPerf
name: ShakaPerf
copyright_years: "2026"
model: development_tool
packages: [shaka-perf, shaka-shared, shaka-bundle-size, shaka-accessibility]
register_url: https://shakaperf.com/license
pricing_url: https://shakaperf.com/pricing
previous_license: The ShakaPerf License 1.0
---
# Part B. Product Schedule: ShakaPerf

## B1. Software

The Software is ShakaPerf: the `shaka-perf`, `shaka-shared`,
`shaka-bundle-size`, and `shaka-accessibility` npm packages, their command
line tools, agent skills, and report shells, and any other component
ShakaCode distributes under this text as part of ShakaPerf. Third-party components that ShakaPerf depends on (for example
Lighthouse, Playwright, Chromium, axe-core, and ffmpeg) are licensed
separately by their own authors.

## B2. Use model and Covered Use

ShakaPerf is a development tool. It measures, compares, bisects, and
reports on software; it does not serve an application to end users, so it
has no "production" in the sense that a web framework does.

**Covered Use** means any use of the Software other than a Free Use, in
whatever environment the Software runs or targets and by whatever means it
is started. The examples below do not override a Free Use. Covered Use
includes, without limitation:

a. ongoing use on private repositories or private code after the
   Evaluation Period;
b. Automated workflows, including continuous integration, scheduled runs,
   and pull-request or merge checks;
c. coding-agent or agent-assisted development workflows;
d. performance, visual, accessibility, or bundle-size regression gates;
e. runs that a person starts interactively for your organization's work,
   however often;
f. runs against development, test, CI, staging, preview, review-app, or
   production environments alike, and runs against twin or Docker
   servers that the Software starts;
g. privately hosted or internal reports, dashboards, or data derived from
   the Software's output; and
h. services, audits, or deliverables built on the Software.

**"Automated workflow"** means any execution of the Software initiated by
software or by an automated or semi-autonomous agent, whether or not a
human initiates, supervises, or approves individual runs, including
continuous integration or delivery pipelines, scheduled or recurring jobs,
and automated pull-request or merge checks. A human personally running the
Software interactively is not an Automated workflow, and that run can
still be Covered Use.

The environment the Software runs in or measures never makes a use of
ShakaPerf free. Whether a use of ShakaPerf is free is decided only by
Section A4 and Section B3 of this file, never by the environment rule of
another ShakaStack product's license (Section A16). A person's use of the
Software on an organization's code or for an organization's work is use by
that organization, not a personal project under Section A4(d).

Section B3(a) covers only the generation of a qualifying public report. It
does not exempt ongoing work on private code, or any other Covered Use,
because an output is later published.

## B3. Additional free uses

a. generating reports published where the public can access them at a
   discoverable location for at least one year, provided the publication
   visibly attributes ShakaCode with a working link, and provided the
   generation is not part of an Automated workflow or of any workflow
   that gates software development or release. A standalone public benchmark
   made by hand can qualify. Publishing the output of ongoing private
   development, testing, or optimization does not make that work free, and
   publication never exempts automated runs or development gates after the
   fact.

## B4. Evaluation

During the Evaluation Period you may evaluate the Software by any means,
including Automated workflows and agent-assisted runs on private code.
After the Evaluation Period, those uses require a Subscription unless another
Free Use or a grace period applies.

## B5. Grant limits, attribution, and reports

You may distribute copies and derivative works of the Software only under
these same terms (Section A9). You may not remove, disable, or obscure the
license-status and attribution content of generated reports in free use,
and reports shared beyond the person who generated them must retain that
content. Choosing not to generate reports, or filtering logs, is not a
violation. A Subscription may include the right to customize or suppress
report attribution as stated in the subscription terms. You must not
misrepresent your license status in the Software's output.

## B6. Included Product, registration, and purchase

ShakaPerf is an Included Product: its Subscription is ShakaStack Pro
(Section A6). Register, free of charge and optionally, at
https://shakaperf.com/license. Purchase at https://pro.reactonrails.com/.
Free and paid uses are summarized at https://shakaperf.com/pricing.
