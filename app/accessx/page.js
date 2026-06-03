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
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <LiveAccessGraph />
          <HorizontalGraph />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <CateUniqueCount />
          <GateUniqueCount />
        </div>

        <Device_Data />

        <LastTwentyRecords />
      </div>
    </AccessDataProvider>
  );
}
