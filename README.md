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
yarn install
npx shadcn@latest add chart
npm install recharts
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

## UI Enhancements Completed

### Global Styling

* Configured custom brand color variables.
* Added global design tokens for colors, spacing, shadows, and typography.
* Integrated custom fonts:

  * Chillax
  * Poppins
  * VCR

### Header Component

* Redesigned header layout.
* Improved logo sizing and alignment.
* Added responsive date and time display.
* Optimized spacing for desktop and mobile views.
* Applied brand-based styling following AtomX guidelines.

### HorizontalGraph Component

* Improved filter section styling.
* Redesigned category distribution visualization.
* Replaced custom SVG implementation with Recharts Pie Chart.
* Preserved existing API and filtering logic.
* Updated chart colors according to brand palette.
* Improved legend and card presentation.

### Category Count & Gate Count

* Updated typography hierarchy.
* Applied brand colors for labels and metrics.
* Improved card appearance and spacing.
* Maintained existing data calculations and logic.

### Device Data Component

* Reviewed card-based layout.
* Improved responsiveness and visual consistency.
* Evaluated modern dashboard card patterns.

### Last Twenty Records

* Improved table styling.
* Enhanced readability and spacing.
* Applied consistent design language across dashboard components.

---

## Research & Learning

During development, research was conducted on:

### UI Libraries

* Tremor
* Recharts
* Victory
* ApexCharts
* Shadcn UI

### Next.js Concepts

* Component structure
* Data flow
* Props
* Context API
* Responsive UI development

### Dashboard Design

* SaaS dashboard patterns
* Analytics dashboard layouts
* Mobile-first responsive design
* Brand-consistent component design

---

## Current Focus

* Further UI refinement component-by-component.
* Mobile responsiveness improvements.
* Consistent application of AtomX brand guidelines.
* Exploring improved dashboard layouts using modern design patterns.

---

## Notes

* No API logic has been modified.
* No Context API functionality has been changed.
* Existing business logic and data calculations remain intact.
* All changes are currently focused on UI/UX improvements only.
