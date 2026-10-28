# YMC Network — Concept Website

A responsive, high-fidelity conceptual website for Yuaan Musk Coin (YMC), an independent Layer-1 network idea. The visual system uses Obsidian Black (`#0B0B0D`) and Metallic Gold (`#D4AF62`), with Space Grotesk, Inter, and DM Mono.

## Contents

- `index.html` — page structure and content
- `styles.css` — responsive design system and components
- `script.js` — mobile navigation, copy-sample interaction, and subtle reveal transitions

## Preview

Open `index.html` in a browser, or enable GitHub Pages for the repository to publish a static preview.

## Important status and accuracy notes

This is a conceptual front-end prototype, not a functioning blockchain product. No live chain, testnet, deployed token contract, consensus implementation, or benchmark data is included.

The following are design assumptions requested for the concept and must not be represented as measured results:
- Proposed consensus: Delegated Proof-of-Stake with IBFT 2.0 finality
- Target block interval: approximately 1.2 seconds
- Illustrative throughput target: up to 3,500 TPS
- EVM-oriented compatibility target
- Proposed total supply: 1,000,000,000 YMC
- Proposed allocation: 40% public ecosystem/liquidity; 20% staking/network rewards; 20% core team/engineering; 10% strategic reserve/treasury; 10% partner grants/developer ecosystem

The 3,500 TPS and 1.2-second figures are not testnet results. Do not remove the on-page caveats until reproducible benchmarks exist. Token allocation and vesting are draft economics, not deployed contracts or audited financial design.

## Technical implementation notes

The page is plain HTML, CSS, and JavaScript with no build step or framework dependency. Google Fonts are loaded remotely; system fallbacks are provided. For production, confirm licensing and availability, add a formal privacy/accessibility review, test performance across target devices, and replace concept claims with reviewed documentation as implementation advances.

## Disclaimer

YMC is a conceptual blueprint and pre-build infrastructure project. Protocol parameters, tokenomics, milestones, and other statements are subject to engineering feasibility review, legal review, independent security audits where applicable, and eventual governance approval. Nothing on the site is investment advice or a promise of returns.