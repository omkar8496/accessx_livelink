"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { fetchAccessCategory, fetchAccessGate } from "./api";
import { getAuthSession } from "@livelink/lib/authStorage";

const AccessDataContext = createContext(null);

export function AccessDataProvider({ children }) {
  const [catData, setCatData] = useState([]);
  const [gateData, setGateData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fetchedRef = useRef(false);

  useEffect(() => {
    const session = getAuthSession();
    const token = session?.token;
    if (!token) {
      queueMicrotask(() => {
        setError("Missing token. Please log in again.");
        setLoading(false);
      });
      return;
    }

    if (fetchedRef.current) return;
    fetchedRef.current = true;

    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [cats, gates] = await Promise.all([
          fetchAccessCategory({ token }),
          fetchAccessGate({ token })
        ]);
        if (!cancelled) {
          setCatData(Array.isArray(cats) ? cats : []);
          setGateData(Array.isArray(gates) ? gates : []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Unable to load access data.");
      } finally {
        if (cancelled) {
          fetchedRef.current = false;
        } else {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
      fetchedRef.current = false;
    };
  }, []);

  return (
    <AccessDataContext.Provider value={{ catData, gateData, loading, error }}>
      {children}
    </AccessDataContext.Provider>
  );
}

export function useAccessData() {
  const ctx = useContext(AccessDataContext);
  if (!ctx) {
    throw new Error("useAccessData must be used within AccessDataProvider");
  }
  return ctx;
}
