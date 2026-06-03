<!-- This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details. -->


# AccessX Live Dashboard

AccessX is a Next.js based live access control dashboard used for monitoring event access data, gate activity, category counts, device information, and recent access records.

## Tech Stack

* Next.js (App Router)
* React
* Tailwind CSS
* JavaScript
* Local Fonts (Chillax, Poppins, VCR)

## Project Setup

Clone repository:

```bash
git clone <repo-url>
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open dashboard:

```text
http://localhost:3000/accessx/?e=MTcwNg==
```

## Project Structure

```text
app/
 ├ accessx/
 │ ├ components/
 │ ├ page.js
 │ └ layout.js

public/
 └ fonts/
    ├ chillax/
    ├ poppins/
    └ vcr/
```

## Fonts Setup

* Added Chillax font
* Added Poppins font
* Added VCR font
* Configured fonts using Next.js localFont

## Global Styling

* Added global color variables
* Configured global typography
* Added default Poppins font
* Added reusable brand colors

## UI Improvements

* Updated Header UI
* Updated Category Count UI
* Updated Gate Count UI
* Updated Device Data UI
* Updated Last Twenty Records UI
* Updated dashboard card styling
* Improved component spacing and typography

## Important Notes

* Live graph logic should not be modified
* Dashboard uses encoded query parameters
* Uses AccessData context for shared state
* Project uses trailingSlash configuration for deployment
* Most UI changes should be done using Tailwind CSS inside components

## Build Commands

Build project:

```bash
npm run build
```

Run production build:

```bash
npm start
```
