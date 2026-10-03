# Share this HIG

Copy a badge into your README, blog, or docs. Every link points at [the GitHub repo](https://github.com/frozonfreak/webhig) with **UTM parameters** so inbound clicks can be attributed by source.

**Badge image:** [docs/badge.svg](./docs/badge.svg) · served at `https://frozonfreak.github.io/webhig/badge.svg`

This is a **share** badge (spread the standard). For a **conformance** claim after you pin a semver, see [PROFILES.md](./PROFILES.md). To adopt the contract in a product repo, use the **Pin me** badge on [README.md](./README.md) and start with [HIG-QUICK.md](./HIG-QUICK.md).

---

## UTM convention

Keep `utm_medium` and `utm_campaign` fixed. Change only `utm_source` to match where you posted the badge.

| Parameter | Value | Purpose |
| --- | --- | --- |
| `utm_source` | Placement slug (see below) | Distinguishes README vs blog vs social |
| `utm_medium` | `badge` | Always this graphic |
| `utm_campaign` | `share` | This campaign |

**Source slugs** — lowercase letters, numbers, and underscores only:

| Where you post | `utm_source` |
| --- | --- |
| GitHub README | `github_readme` |
| Docs site | `docs` |
| Blog or article | `blog` |
| Social post | `social` |
| Newsletter | `newsletter` |
| Your website | `website` |
| Something else | a short slug such as `meetup_slides` |

GitHub Traffic Insights reports referring *sites*, not UTM breakdowns. Keep these parameters anyway: they show up in any analytics you attach later, and they stay visible on the destination URL.

Interactive copy UI: [documentation site — Share this HIG](https://frozonfreak.github.io/webhig/adopt.html#share).

---

## Copy-paste markdown

### GitHub README

```markdown
[![The Web HIG](https://frozonfreak.github.io/webhig/badge.svg)](https://github.com/frozonfreak/webhig?utm_source=github_readme&utm_medium=badge&utm_campaign=share)
```

### Docs site

```markdown
[![The Web HIG](https://frozonfreak.github.io/webhig/badge.svg)](https://github.com/frozonfreak/webhig?utm_source=docs&utm_medium=badge&utm_campaign=share)
```

### Blog or article

```markdown
[![The Web HIG](https://frozonfreak.github.io/webhig/badge.svg)](https://github.com/frozonfreak/webhig?utm_source=blog&utm_medium=badge&utm_campaign=share)
```

### Social post

```markdown
[![The Web HIG](https://frozonfreak.github.io/webhig/badge.svg)](https://github.com/frozonfreak/webhig?utm_source=social&utm_medium=badge&utm_campaign=share)
```

### Newsletter

```markdown
[![The Web HIG](https://frozonfreak.github.io/webhig/badge.svg)](https://github.com/frozonfreak/webhig?utm_source=newsletter&utm_medium=badge&utm_campaign=share)
```

### Website

```markdown
[![The Web HIG](https://frozonfreak.github.io/webhig/badge.svg)](https://github.com/frozonfreak/webhig?utm_source=website&utm_medium=badge&utm_campaign=share)
```

### Custom source

Replace `YOUR_SOURCE` with a short slug (`meetup_slides`, `podcast_notes`, …):

```markdown
[![The Web HIG](https://frozonfreak.github.io/webhig/badge.svg)](https://github.com/frozonfreak/webhig?utm_source=YOUR_SOURCE&utm_medium=badge&utm_campaign=share)
```

---

## HTML

Use the same UTM query on `<a href>`. Example for a website:

```html
<a href="https://github.com/frozonfreak/webhig?utm_source=website&utm_medium=badge&utm_campaign=share">
  <img src="https://frozonfreak.github.io/webhig/badge.svg" width="204" height="20" alt="The Web HIG — open behavioral standard">
</a>
```

---

## Text-only link

When a graphic does not fit:

```markdown
[The Web HIG](https://github.com/frozonfreak/webhig?utm_source=blog&utm_medium=text&utm_campaign=share) — open behavioral standard for the modern web.
```

Use `utm_medium=text` for these so badge clicks stay separate from plain-link clicks.
