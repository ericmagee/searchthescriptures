# Search the Scriptures

The **TRUTH Bible Study App** and landing site for [searchthescriptures.org](https://searchthescriptures.org).

> "For precept must be upon precept, precept upon precept; line upon line, line upon line; here a little, and there a little." — Isaiah 28:10 (KJV)

Vanilla HTML / CSS / JS. No frameworks. Deployed on Vercel.

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | Landing page — hero, the four-layer method, forthcoming books. |
| `study.html` | The TRUTH study app — dark-theme chat, answers tagged by layer (L1–L4). |
| `styles.css` | Landing-page styles (scholarly light theme). |
| `api/chat.js` | Vercel serverless function. Proxies to the Anthropic Claude API. |
| `vercel.json` | Routes `/api/chat` to the function. |
| `package.json` | Project metadata + Vercel scripts. |

The Claude API key is **never** exposed to the browser. The study app calls
`/api/chat`, and only the serverless function reads `ANTHROPIC_API_KEY`.

## The four-layer method

- **L1 — Text:** King James Version, quoted verbatim with book/chapter/verse.
- **L2 — Language:** Hebrew / Greek roots, transliteration, Strong's numbers.
- **L3 — Cross-Reference:** Scripture laid beside scripture.
- **L4 — Flagged Inference:** Reasoned conclusions, clearly set apart from text.

## Deploy

1. Install the [Vercel CLI](https://vercel.com/cli): `npm i -g vercel`
2. Set the API key in your Vercel project:
   ```sh
   vercel env add ANTHROPIC_API_KEY
   ```
   (Add it to Production, Preview, and Development.)
3. Deploy:
   ```sh
   vercel --prod
   ```

### Local development

```sh
vercel dev
```

This serves the static pages and runs `api/chat.js` locally. Create a
`.env.local` with `ANTHROPIC_API_KEY=sk-ant-...` for local testing.

---

Search the Scriptures Press · Victor King
