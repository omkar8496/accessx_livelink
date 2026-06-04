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

## Overview

AccessX is a Next.js-based live access control dashboard used for monitoring event access data, gate activity, category-wise statistics, device information, and recent access records.

The dashboard receives live event data and displays it through various visual components such as graphs, category counts, gate counts, device data tables, and access logs.

---

## Tech Stack

* Next.js (App Router)
* React
* Tailwind CSS
* JavaScript
* Context API
* Local Fonts (Chillax, Poppins, VCR)

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate to the project:

```bash
cd accessx_livelink
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```bash
http://localhost:3000/accessx/?e=MTcwNg==
```

---

## Project Structure

```text
app/
│
├── accessx/
│   ├── components/
│   │   ├── Header.js
│   │   ├── HorizontalGraph.js
│   │   ├── LiveAccessGraph.js
│   │   ├── CateUniqueCount.js
│   │   ├── GateUniqueCount.js
│   │   ├── Device_Data.js
│   │   ├── LastTwentyRecords.js
│   │   └── AccessDataContext.js
│   │
│   ├── page.js
│   └── layout.js
│
├── globals.css
└── layout.tsx

public/
└── fonts/
    ├── chillax/
    ├── poppins/
    └── vcr/
```

---

## Fonts Configuration

The project uses local fonts loaded through Next.js localFont:

### Chillax

Used primarily for headings and branding.

### Poppins

Used as the primary dashboard font.

### VCR

Available for specific dashboard elements where required.

Fonts are stored under:

```text
public/fonts/
```

---

## Global Styling

Implemented global styling using:

* Brand color variables
* Global typography setup
* Dashboard background styling
* Font configuration
* Reusable design tokens

Brand Colors:

```css
--primary-orange: #E04420;
--black: #1C1C1C;
--electric-blue: #341CD6;
--light-blue: #00A9F2;
--purple: #D5B7FF;
--egg-white: #EBEBEB;
```

---

## UI Improvements Completed

### Header Component

* Added AtomX-inspired gradient styling
* Improved typography hierarchy
* Improved event title visibility
* Styled venue information
* Improved timestamp visibility
* Added modern card appearance

### Category Count Component

* Improved card layout
* Added visual hierarchy
* Improved count presentation
* Added styled progress indicators
* Improved spacing and readability

### Gate Count Component

* Improved visual layout
* Enhanced progress indicators
* Better typography and spacing
* Improved count visualization

### Dashboard Styling

* Improved card appearance
* Improved spacing and alignment
* Better visual grouping of sections
* Applied consistent design language across components

---

## Important Development Notes

### Live Graph

Do not modify:

* Live graph logic
* Data refresh mechanism
* Graph data calculations

Only UI styling around the graph should be modified when required.

### Query Parameters

Dashboard uses encoded query parameters:

```text
/accessx/?e=<encoded-value>
```

### Shared State

Dashboard data is managed using:

```text
AccessDataContext
```

which provides:

* Category data
* Gate data
* Device data
* Access records
* Graph data

---

## Deployment Notes

Ensure:

```js
trailingSlash: true
```

is configured inside:

```text
next.config.mjs
```

to support deployment routing requirements.

---

## Future UI Improvements

Planned enhancements:

* Additional dashboard UI refinements
* Improved table styling
* Improved card system
* Better responsive behavior
* UI library evaluation and integration research
* Chart and visualization design improvements while preserving existing data logic

---

## Available Scripts

Start development server:

```bash
npm run dev
```

Build production version:

```bash
npm run build
```

Start production server:

```bash
npm start
```

---

## Author Notes

Current development focuses on:

* UI modernization
* Tailwind CSS styling
* Brand guideline implementation
* Component-level UI improvements

while preserving all existing dashboard functionality and business logic.
