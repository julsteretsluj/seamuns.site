# MUN Simulation Game (munsimulation.seamuns.site)

Single-player MUN procedure simulator for [SEAMUNs](https://seamuns.site). This folder contains the app that runs at **munsimulation.seamuns.site**.

## Contents

- **index.html** — Delegate simulation: committee room, placard, motions, notes, event log.
- **chairs.html** — Chair’s Role: procedure practice (run the committee, scenario questions).
- **script.js** — Delegate simulation logic.
- **chairs.js** — Chair simulation logic.
- **styles.css** — Shared layout and styles.
- **chairs.css** — Chair-specific styles.
- **logo.png** — Site logo.

## Run locally

Open `index.html` in a browser or serve this folder with a static server. Entry point: `index.html` (Delegate Sim). Use the “Chair’s Role” link for the chair practice.

## Deploy

Point the subdomain **munsimulation.seamuns.site** at this folder (or build output) so the main site’s “MUN Simulation” links work.
