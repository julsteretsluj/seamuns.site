# Fonts (DaFont / self-hosted)

This folder holds **self-hosted web fonts** used by the site. The CSS loads them via `@font-face` so no external font CDN (e.g. Google Fonts) is required.

## Adding fonts from DaFont

1. **Download** your chosen font from [DaFont](https://www.dafont.com/). Prefer fonts marked *100% Free* or *GPL/OFL* if you need commercial use.
2. **Convert** the font to web formats (WOFF2 and WOFF) if you only have .ttf/.otf. You can use:
   - [Transfonter](https://transfonter.org/) (upload → select WOFF2, WOFF → Convert)
   - [CloudConvert](https://cloudconvert.com/ttf-to-woff2)
3. **Rename and place** the files in this folder:
   - `SiteSans-Regular.woff2` (and optionally `SiteSans-Regular.woff`) — normal text
   - `SiteSans-SemiBold.woff2` (and optionally `SiteSans-SemiBold.woff`) — headings
4. If you use different filenames, update the `@font-face` rules in `css/styles.css` to match.

## Suggested DaFont fonts (free for commercial use)

- **Modern Sans** — clean sans-serif, Public Domain/GPL/OFL
- **Lexend** / **Oswald** — also on Google Fonts; you can download and self-host from DaFont or Google Fonts GitHub

If no font files are present, the site falls back to system fonts (e.g. system-ui, Segoe UI, Arial).
