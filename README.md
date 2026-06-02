# 𐕣 METAL FORGE 𐕣

*A [Synthetic Faction](https://syntheticfaction.com) production.*

> **Status:** Active • Production Live via Vercel + Google Play (Closed Beta)
> **Live:** [forge.syntheticfaction.com](https://forge.syntheticfaction.com)
> **Target Audio Engines:** Universal Multi-Model Support (Suno, Udio, Stable Audio)

Welcome to **Metal Forge** — a feature-rich, multi-genre AI music prompt suite designed to forge hyper-optimized style modifiers, lyrical themes, structural parameters, and AI-generated album artwork for any AI music engine.

---

## ⚡ Core Features

* **Multi-Genre Prompt Engine:** Full support across Metal & Rock, Pop & Mainstream, Hip-Hop & Urban, Electronic & Dance, Cinematic & Ambient, and Specialty genres — not just metal.
* **Style Modifiers Matrix:** Collapsible panels covering Core Metal, Rock & Alternative, Atmospheric, Hip-Hop & Urban, Electronic & Dance, and Pop & R&B sonic chips to stack into your blueprint.
* **20 Vocal Style Presets:** Grouped by genre — Metal & Rock, Pop & Mainstream, Hip-Hop & Urban, Electronic & Dance, Cinematic & Ambient, and Specialty — feeding directly into the AI prompt.
* **Theme Alchemy Presets:** Six collapsible theme panels — Visual & Cinematic, Lyrical Foundations, Alternative & Ambient, Love & Emotion, Urban & Street, and Uplifting & Anthemic.
* **Structural Depth Control:** Quick Hit, Standard, and Epic format options shaping song length and complexity.
* **AI Album Artwork Generation:** Automatically generates a unique, downloadable album cover after every forge using Gemini image generation — driven by the track title, style, and theme.
* **Per-Section Lock & Clear:** Lock individual output sections (Style Prompt or Lyrics) to preserve them across reforges. Clear any section independently without wiping the full workspace.
* **AI Lyric Co-Pilot:** Multi-turn chat refinement to edit, extend, or reshape generated lyrics after forging.
* **Track Archive:** Session-based history of forged tracks for quick reload and comparison.
* **4 UI Themes:** Forge (dark metal), Studio (light professional), Neon (cyberpunk), and Matrix (hacker green) — persisted via localStorage.
* **Visceral Vision:** Upload an image to extract visual style modifiers and themes automatically.

---

## 🛠️ Architecture & Tech Stack

* **Frontend:** Pure Semantic HTML5 & Modern JavaScript (ES6+)
* **Styling:** Tailwind CSS (CDN) with full CSS variable-based theme system
* **Backend:** Two serverless Vercel Edge Functions:
  * `api/forge.js` — routes prompt packages to Gemini 2.5 Flash for text generation
  * `api/artwork.js` — routes image generation requests to Gemini image model
* **AI Provider:** Google Gemini API (secured via Vercel environment variables)
* **Deployment:** Automated production pipeline via Vercel GitHub webhooks
* **Mobile:** Android app via Capacitor + Android Studio, distributed on Google Play

---

## 𐕣 How to Wield the Forge

1. **Configure Parameters:** Enter a song title, style/genre/band influence, and lyrical theme.
2. **Select Vocal Style & Structure:** Choose from 20 vocal presets and three structural depth options.
3. **Stack Modifiers:** Toggle Style Matrix chips and Theme Alchemy presets to shape the sonic blueprint.
4. **Ignite Generation:** Hit **FORGE THE TRACK** — lyrics, style tags, and album artwork generate automatically.
5. **Refine & Lock:** Review outputs. Lock sections you want to preserve, then reforge to regenerate the rest.
6. **Download:** Copy style tags and lyrics directly into Suno or Udio. Download your album artwork.

---

## 🎨 UI Themes

| Theme | Style |
|---|---|
| 🔴 Forge | Dark metal, red accent (default) |
| ⚪ Studio | Clean light/white professional |
| 🔵 Neon | Deep navy cyberpunk, cyan accent |
| 🟢 Matrix | Near-black hacker green |

---

## 🏭 About Synthetic Faction

Metal Forge is the flagship product of **[Synthetic Faction](https://syntheticfaction.com)** — an AI-powered creative studio for independent bands and labels. Alongside Metal Forge, the studio offers Electronic Press Kits, AI-generated artwork and promotional assets, and prompt engineering services for AI music platforms.

*Forging Digital Grit.*

---

*Built for production content creation. Any genre. Any mood. Forge your sound.*
