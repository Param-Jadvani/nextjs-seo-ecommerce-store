# NextJs SEO E-Commerce Store

A Next.js 15 e-commerce project with product browsing, category landing pages, cart, checkout, user auth, orders, and production-oriented SEO.

## Tech Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- MongoDB
- Razorpay
- Zustand
- Sonner

## Key Features

- Product catalog with category-specific landing pages
- Product detail pages with `Product` and `BreadcrumbList` JSON-LD
- SEO metadata for public pages
- Canonical URLs, Open Graph, Twitter cards, robots, and sitemap
- Cart, checkout, profile, orders, login, and signup flows
- Responsive storefront UI

## SEO Notes

- Public pages use stable metadata in the App Router
- Private pages are marked `noindex`
- `robots.txt` excludes auth and account routes
- `sitemap.xml` includes:
  - homepage
  - `/products`
  - category pages
  - product detail pages

## Routes

- `/` - storefront home
- `/products` - all products
- `/categories/[category]` - SEO-friendly category pages
- `/products/[id]` - product detail
- `/cart` - shopping cart
- `/checkout` - checkout
- `/login` - sign in
- `/signup` - sign up
- `/profile` - account profile
- `/orders` - order history
- `/orders/[id]` - order detail

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values.

Required variables:

- `NEXT_PUBLIC_SITE_URL`
- `DATABASE_URL` or `DATABASE_URL_DIRECT`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `AUTH_TOKEN`
- `JWT_SECRET`
- `NODE_ENV`

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Notes

- Product data is sourced from `fakestoreapi.com`.
- Category pages are generated from the product catalog and use clean SEO URLs.
- The storefront UI is tuned for desktop and mobile browsing.
