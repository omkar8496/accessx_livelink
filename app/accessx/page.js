"use client";

import { HorizontalGraph } from "./components/HorizontalGraph";
import { LiveAccessGraph } from "./components/LiveAccessGraph";
import { CateUniqueCount } from "./components/CateUniqueCount";
import { GateUniqueCount } from "./components/GateUniqueCount";
import { LastTwentyRecords } from "./components/LastTwentyRecords";
import { Device_Data } from "./components/Device_Data";
import { AccessDataProvider } from "./components/AccessDataContext";

export default function AccessxPage() {
  return (
    <AccessDataProvider>
      <div className="space-y-4 md:space-y-6">
        {/* Top charts - Equal width or stack on mobile */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
          <LiveAccessGraph />
          <HorizontalGraph />
        </div>

        {/* Middle stats - Stack on mobile, 2-col on tablet+ */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
          <CateUniqueCount />
          <GateUniqueCount />
        </div>

        {/* Devices table - Full width, scrollable on mobile */}
        <Device_Data />

        {/* Records table - Full width, scrollable on mobile */}
        <LastTwentyRecords />
      </div>
    </AccessDataProvider>
  );
}
