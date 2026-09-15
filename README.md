# CURTIFY

A small Next.js image editor that takes an uploaded target image plus the built-in
Curtis reference photo and asks OpenAI's image-edit model to blend Curtis's
recognizable face into the target.

## AI configuration

This app calls OpenAI's `images/edits` endpoint directly (Vercel AI Gateway does not
reliably route the image-edit endpoint), so it needs a real OpenAI API key.

Set `OPENAI_API_KEY` as a project environment variable. Get one at
https://platform.openai.com/api-keys (billing must be enabled on the account).

The key is only ever read server-side in `app/api/curtify/route.ts` and is never
exposed to the browser.

## Develop

```bash
npm install
npm run dev
```

The Curtis reference image lives at `public/curtis.jpg`.
