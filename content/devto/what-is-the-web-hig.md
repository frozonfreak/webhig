---
title: "What is The Web HIG? (and why product teams are pinning it)"
published: false
description: "A short primer on The Web HIG — an open behavioral standard for modern web apps that works for developers, reviewers, CI, and AI coding agents."
tags: webdev, opensource, beginners, ux, productivity
canonical_url: https://github.com/frozonfreak/webhig
---

**The Web HIG** (Universal Human Interface Guidelines for the web) is an open standard that answers: *how should this interface behave?*

It is **not** a UI kit. It does not tell you which button radius to use. It tells you things like:

- Every async path needs a clear loading / success / error / empty state
- Destructive actions need confirmation matched to risk
- Motion must respect reduced-motion preferences
- Agents and humans should cite the same rule IDs in reviews

## Who it is for

- Product engineers shipping UI weekly
- Designers who care about interaction, not only visuals
- Teams using Cursor, Copilot, Claude Code, or other agents
- Anyone who wants a **semver-pinned** contract across multiple apps

## Who it is not for

- Teams looking for React components or Figma frames (use your design system)
- Replacing WCAG audits (HIG *targets* WCAG 2.2 AA; it does not replace it)

## Get started in five minutes

1. Read [HIG-QUICK.md](https://github.com/frozonfreak/webhig/blob/main/HIG-QUICK.md)
2. Run `npx @web-hig/install` or copy the Quick Reference into `docs/hig/`
3. Tell your agent: *Follow The Web HIG Quick Reference*
4. Declare page archetypes in a short scope file for your product

Repo: [github.com/frozonfreak/webhig](https://github.com/frozonfreak/webhig?utm_source=blog&utm_medium=article&utm_campaign=share)  
Docs: [frozonfreak.github.io/webhig](https://frozonfreak.github.io/webhig/)  
Audit tool: [hig.aruviflow.com](https://hig.aruviflow.com/)

Current release: **v1.12.5** · License: **MIT**

[![The Web HIG](https://frozonfreak.github.io/webhig/badge.svg)](https://github.com/frozonfreak/webhig?utm_source=blog&utm_medium=badge&utm_campaign=share)
