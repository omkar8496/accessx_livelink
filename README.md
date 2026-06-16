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

A responsive event access monitoring dashboard built with Next.js for tracking live event activity, gate access statistics, category-wise counts, device information, and recent access records.

## Features

* Live event monitoring dashboard
* Real-time access analytics
* Gate-wise access tracking
* Category distribution visualization
* Device activity monitoring
* Recent access records table
* Mobile responsive design
* Recharts Pie Chart integration
* Context API state management
* Brand-based UI styling

## Tech Stack

**Frontend**

* Next.js
* React
* Tailwind CSS
* Recharts

**State Management**

* React Context API

**Fonts**

* Chillax
* Poppins
* VCR OSD Mono


---

## Installation

Clone the repository:

```bash
git clone <https://github.com/omkar8496/accessx_livelink.git>
```

Navigate to the project:

```bash
cd accessx-dashboard
```

Install dependencies:

```bash
npm install
yarn install
npx shadcn@latest add chart
npm install recharts
```

Start the development server:

```bash
npm run dev
```

---

## Running the Project

Open:

```text
http://localhost:3000/accessx/?e=MTcwNg==
```

---

## Project Structure

```text
app/
├── accessx/
│   ├── components/
│   │   ├── AccessDataContext.js
│   │   ├── AccessxShell.js
│   │   ├── CateUniqueCount.js
│   │   ├── Device_Data.js
│   │   ├── GateUniqueCount.js
│   │   ├── Header.js
│   │   ├── HorizontalGraph.js
│   │   ├── LastTwentyRecords.js
│   │   ├── LiveAccessGraph.js
│   │   └── api.js
│   ├── layout.js
│   └── page.js
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

## Components

### Header

* Event information
* Venue details
* Live date and time
* Responsive layout

### HorizontalGraph

* Category distribution
* Gate filtering
* IN / OUT filtering
* NFC / QR filtering
* Recharts Pie Chart

### Gate Count

* Gate-wise statistics
* Unique count tracking
* Total count tracking

### Category Count

* Category-based access statistics
* Unique vs total comparison

### Device Data

* Device activity information
* Responsive card layout

### Last Twenty Records

* Recent access logs
* Mobile-friendly design

### Live Access Graph

* Real-time access activity visualization

---

## UI/UX Enhancements

- Improved Event Header responsiveness
- Integrated Recharts Pie Chart
- Standardized typography across components
- Optimized card sizing and spacing
- Improved mobile responsiveness
- Reduced excessive shadows and border radius
- Applied brand-aligned color system
- Enhanced table readability and consistency

---

## Environment Requirements

* Node.js 18+
* npm 9+

---

## Available Scripts

Start development server:

```bash
npm run dev
```

Create production build:

```bash
npm run build
```

Run production build:

```bash
npm start
```

Run linting:

```bash
npm run lint
```

---

## Design Guidelines

### Primary Colors

```css
Primary Orange: #E04420
Electric Blue: #00A9F2
Purple: #341CD6
Black: #1C1C1C
Egg White: #EBEBEB
```

### Typography

| Font    | Usage              |
| ------- | ------------------ |
| Chillax | Headings           |
| Poppins | Body Text          |
| VCR     | Counters & Metrics |

---

## Architecture Notes

- Existing API integrations are preserved.
- Existing Context API state management is     preserved.
- UI improvements were implemented without modifying business logic.
- Dashboard components consume data through the existing AccessDataContext.

---

## Future Enhancements

* Advanced dashboard filters
* Additional chart visualizations
* Enhanced mobile experience
* Dark mode support
* Improved analytics views

---

## Maintainer

AtomX Internship Project
