# LifeFrame 📷

> Moments captured. Yours to keep.

LifeFrame is a photography e-commerce platform I'm building from scratch — a place where customers can browse, favourite, and purchase downloadable photographs directly from the photographer.

🚧 **Status: Work in progress.** The core application is live and the storefront is functional, but several pieces are still being wired up before public launch. This repository is private while I clean up the code and complete the final integrations. I'll make it public once the site goes live.

---

## What it does

- 🖼️ **Gallery & detail pages** — browse photos by category, view full descriptions and camera metadata
- 🛒 **Purchase flow** — buyers can checkout and receive their downloads
- 👤 **Authentication** — separate buyer and admin accounts, powered by Supabase Auth
- 🔐 **Admin panel** — upload new photos, manage the catalogue, see sales
- 🛡️ **Image protection** — watermarks, right-click disabled, hidden EXIF metadata

## Tech stack

- **Frontend:** React, Vite
- **Backend & database:** Supabase (PostgreSQL, Auth, Storage)
- **Hosting:** Hostinger
- **Payments:** Stripe & PayPal *(in progress)*
- **Transactional email:** Resend *(in progress)*

## Roadmap

- [x] Build the React storefront
- [x] Connect categories & photos to Supabase
- [x] Set up admin photo management (upload + delete)
- [x] Configure row-level security policies
- [x] Add image protection (watermarks, EXIF hiding)
- [ ] Connect the purchase flow to Supabase 
- [ ] Integrate Stripe & PayPal payments (only sandbox for now)
- [ ] Wire up Resend for guest download emails (created, refining)
- [ ] Connect the custom domain
- [ ] Final cleanup & public launch

## About me

I'm Luca, Every photo on the platform is my own work.

---

*Code currently private — happy to share access on request.*
