# Publishing `@web-hig/*` to npm

CI publishes when a **GitHub Release is published** ([`.github/workflows/npm-publish-github-packages.yml`](../.github/workflows/npm-publish-github-packages.yml)).

## Why `E404` on first publish

```text
npm error 404 Not Found - PUT https://registry.npmjs.org/@web-hig%2fcore
```

This almost always means **the npm scope `@web-hig` is not set up for your account/token**, not that the package tarball is wrong.

Scoped packages (`@web-hig/core`) require:

1. An npm **organization** (or user) that **owns the scope name** `web-hig`.
2. A token whose user is a **member** of that org with **publish** rights.
3. First publish of each package with **`--access public`** (already in CI).

Until step 1–2 are done, **every** `@web-hig/*` publish fails with 404.

---

## Why `EOTP` in GitHub Actions

```text
npm error code EOTP
npm error This operation requires a one-time password from your authenticator.
```

CI **cannot** enter a TOTP code. This means **`NPM_TOKEN` is the wrong token type** (or 2FA bypass is not enabled for that token).

| Token / login style | Works in CI? |
| --- | --- |
| Classic **Automation** token | Yes — intended for CI/CD |
| Granular token with **Bypass 2FA** (automation) | Yes |
| Classic **Publish** token with 2FA on the account | No — prompts `EOTP` |
| `npm login` session / personal publish without automation token | No |

### Fix `EOTP`

1. npm → **Access Tokens** → revoke the secret currently stored as `NPM_TOKEN` if it was a Publish token.
2. Create a replacement:
   - **Classic:** type **Automation** (not Publish), or
   - **Granular:** read/write on `@web-hig/*`, org **web-hig**, enable **Bypass two-factor authentication** for automation.
3. Update GitHub → **Settings** → **Secrets** → **`NPM_TOKEN`** with the new token.
4. Re-run the **Publish npm packages** workflow (re-publish the release or use **Re-run all jobs**).

Do **not** put OTP codes in GitHub secrets for routine CI — rotate to an automation-capable token instead.

---

## One-time npm setup

### 1. Create the org (claim scope `@web-hig`)

1. Sign in at [npmjs.com](https://www.npmjs.com/).
2. Open [Create an organization](https://www.npmjs.com/org/create).
3. Choose an org name that yields scope **`@web-hig`** (typically org name **`web-hig`**).
4. Complete billing/plan (public open-source packages can use the free tier).

If `@web-hig` is already taken by another account, you must either obtain access from that org or rename packages in this repo (coordinated semver change).

### 2. Create `NPM_TOKEN` (automation — no OTP)

1. npm → **Access Tokens** → **Generate New Token**.
2. Use **one** of:
   - **Classic token** → type **Automation** (bypasses 2FA for publish in CI), or
   - **Granular Access Token** → read/write packages for org **web-hig** / scope `@web-hig/*`, with **Bypass 2FA** enabled for automation.
3. Do **not** use a Classic **Publish** token if your npm account has 2FA — GitHub Actions will fail with **`EOTP`**.
4. Copy the token once.

### 3. Add GitHub secret

Repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Name        | Value        |
| ----------- | ------------ |
| `NPM_TOKEN` | npm token    |

### 4. Bootstrap (optional, local)

After org + token are ready, from a machine logged in with the same rights:

```bash
cd packages/core
npm publish --access public

cd ../cli
npm pkg set "dependencies[@web-hig/core]=1.13.0"
npm install --omit=dev
npm publish --access public

cd ../install
npm publish --access public
```

Order matters: **core → cli → install**.

---

## CI verification

The publish workflow runs **`npm whoami`** and checks org membership before `npm publish`. See workflow logs if preflight fails.

## Package metadata

`repository.url` uses `git+https://github.com/frozonfreak/hig.git` so npm does not rewrite it on publish.
