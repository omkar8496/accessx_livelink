"use client";

import { createContext, useContext } from "react";

export const EventContext = createContext({
  eventData: null,
  loading: false,
  error: ""
});

export function useEventContext() {
  return useContext(EventContext);
}