# PristineAI website

Static marketing + legal + support site for the PristineAI app. Plain HTML/CSS/JS,
no build step, no dependencies. Deploy the contents of this folder to any static
host.

```
website/
  index.html      landing page  (use as the App Store "Marketing URL")
  privacy.html    privacy policy (use as the App Store "Privacy Policy URL")
  terms.html      terms of service
  support.html    support + FAQ  (use as the App Store "Support URL")
  404.html        not-found page
  styles.css      shared styles
  toc.js          table-of-contents highlighting on the legal pages
  favicon.svg
```

---

## 1. Fill in the placeholders

Every placeholder looks like `{{THIS}}`. Search the folder for `{{` and replace
each one everywhere it appears. Nothing should ship with a `{{...}}` left in it.

| Placeholder | What to put | Appears in |
|---|---|---|
| `{{COMPANY_NAME}}` | The legal name that operates the app — your company, or your name if you're a sole developer | all pages |
| `{{CONTACT_EMAIL}}` | A monitored support/privacy address, e.g. `support@yourdomain.com` | all pages |
| `{{SITE_URL}}` | The site's canonical origin, no trailing slash, e.g. `https://getpristine.app` | `<head>` of index/privacy/terms/support |
| `{{EFFECTIVE_DATE}}` | The date the documents take effect, e.g. `March 3, 2026` | privacy, terms |
| `{{GOVERNING_LAW}}` | The jurisdiction whose law governs the Terms and where disputes are heard, e.g. `the State of Delaware, USA` | terms §19 |
| `{{MAILING_ADDRESS}}` | A postal address for legal/privacy notices. If you don't want to publish one, replace with your country + "contact us by email for a mailing address" | privacy §17, terms §22 |
| `{{APP_STORE_URL}}` | Your App Store listing URL once it exists. Until then, point it at `support.html` or `#` | index hero |
| `{{SUPPORT_RESPONSE_TIME}}` | Your realistic turnaround, e.g. `3 business days` | support |
| `{{MIN_IOS_VERSION}}` | Minimum iOS version, matches your Expo/EAS build target, e.g. `iOS 16` | support |

The app name "PristineAI" is written directly into the text (not a placeholder).
If the name changes, do a find-and-replace for `PristineAI`.

---

## 2. Deploy

Pick one host. All of these serve a plain folder and give you HTTPS.

### GitHub Pages (zero cost, no account beyond GitHub)

Pages can only serve from the repo root or a folder named `docs/` on the default
branch.

- **Simplest:** rename this folder from `website/` to `docs/`, commit, then in the
  repo's **Settings → Pages** choose "Deploy from a branch", branch = your default
  branch, folder = `/docs`. URL will be
  `https://<user>.github.io/<repo>/privacy.html`.
- Or keep `website/` and deploy it with a GitHub Actions workflow that uploads
  `website/` as the Pages artifact.
- To use a custom domain, add it under Settings → Pages and create a `CNAME` file
  in the served folder containing just the domain.

### Netlify / Cloudflare Pages / Vercel

- Connect the repo.
- Set **build command** to empty / none.
- Set **publish directory** (Netlify) / **output directory** (Vercel) / **build
  output directory** (Cloudflare) to `website`.
- Add your custom domain in the host's dashboard.

### Any other static host / S3 / your existing server

Upload the contents of `website/` to the web root (or a subpath). Make sure
`404.html` is wired up as the not-found document if the host supports it.

---

## 3. After deploy — checklist

- [ ] Visit `/`, `/privacy.html`, `/terms.html`, `/support.html` — all load over
      `https://`, no console errors, no `{{placeholder}}` visible.
- [ ] The support email link opens a compose window to the right address.
- [ ] Test on a phone-width screen and in dark mode.
- [ ] Put the URLs into **App Store Connect**:
  - App Information → **Privacy Policy URL** → `https://.../privacy.html`
  - App Information → **Support URL** → `https://.../support.html`
  - Version → **Marketing URL** (optional) → `https://.../` or `https://.../index.html`
- [ ] Keep the `{{EFFECTIVE_DATE}}` current whenever you change the policy or terms,
      and tell users about material changes (in-app or by email), as both documents
      promise.

---

## 4. Important: get the legal text reviewed

`privacy.html` and `terms.html` are drafted from how the PristineAI app actually
handles data (Supabase for storage/auth/sync, an API server that relays photos to
Anthropic without storing them, PostHog for analytics and crash reporting, on-device
photo retention, the username-to-email lookup, and the in-app deletion paths). They
are a solid starting point, **not a substitute for legal advice.**

Have a lawyer review before you rely on them, especially:

- the governing-law, liability-cap, and indemnification clauses in the Terms;
- the GDPR/UK legal bases and the CCPA/CPRA and other US-state disclosures in the
  Privacy Policy;
- how you describe processing of **health-related data** and **facial images**,
  which are sensitive categories in most jurisdictions and may require specific
  consent language or a Data Processing Addendum with your providers;
- whether you need an EU/UK representative or a Data Protection Officer;
- your retention periods with Anthropic and PostHog, which should match your
  contracts with them.

Also confirm these facts match reality before publishing:

- The production build ships PostHog analytics + crash reporting. If that changes,
  update Privacy Policy §3.2, §7.1, §8 and §12, and re-check your App Store privacy
  answers.
- Your API server really does hold images in memory only and never logs or stores
  them.
- "Delete all my data" and "Delete account" behave as described in Privacy Policy
  §11 and Support.
