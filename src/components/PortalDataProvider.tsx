"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  fetchPortalData,
  PortalDataError,
  type PortalData,
} from "@/lib/portalData";
import { EmptyState, ErrorState, LoadingState } from "./ui";

type Status = "loading" | "ready" | "error";

interface PortalDataState {
  status: Status;
  data: PortalData | null;
  error: string | null;
  /** True while a refresh runs over already-loaded data. */
  refreshing: boolean;
  refresh: () => void;
}

const PortalDataContext = createContext<PortalDataState | null>(null);

export function PortalDataProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>("loading");
  const [data, setData] = useState<PortalData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const controllerRef = useRef<AbortController | null>(null);
  const hasData = data !== null;

  const load = useCallback(
    async (isRefresh: boolean) => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      if (isRefresh) setRefreshing(true);
      else setStatus("loading");

      try {
        const next = await fetchPortalData(controller.signal);
        if (controller.signal.aborted) return;
        setData(next);
        setError(null);
        setStatus("ready");
      } catch (cause) {
        if (controller.signal.aborted) return;
        if (cause instanceof DOMException && cause.name === "AbortError") return;
        setError(
          cause instanceof PortalDataError
            ? cause.message
            : "An unexpected error occurred while loading live data.",
        );
        setStatus("error");
      } finally {
        if (!controller.signal.aborted) setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    void load(false);
    return () => controllerRef.current?.abort();
  }, [load]);

  const refresh = useCallback(() => {
    void load(hasData);
  }, [load, hasData]);

  return (
    <PortalDataContext.Provider
      value={{ status, data, error, refreshing, refresh }}
    >
      {children}
    </PortalDataContext.Provider>
  );
}

export function usePortalData(): PortalDataState {
  const context = useContext(PortalDataContext);
  if (!context) {
    throw new Error("usePortalData must be used inside a PortalDataProvider.");
  }
  return context;
}

/**
 * Renders loading / error states around live data so every page handles them
 * identically. `isEmpty` lets a page declare that the API returned no rows for
 * its section.
 */
export function DataBoundary<T>({
  select,
  isEmpty,
  emptyTitle,
  emptyDescription,
  children,
}: {
  select: (data: PortalData) => T;
  isEmpty?: (value: T) => boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  children: (value: T, data: PortalData) => React.ReactNode;
}) {
  const { status, data, error, refresh } = usePortalData();

  if (status === "loading") {
    return <LoadingState label="Loading live data from the KitchenFlow API…" />;
  }

  if (status === "error" || data === null) {
    return (
      <ErrorState
        title="Could not load live data"
        description={error ?? undefined}
        onRetry={refresh}
      />
    );
  }

  const value = select(data);

  if (isEmpty?.(value)) {
    return (
      <EmptyState
        title={emptyTitle ?? "No records returned"}
        description={
          emptyDescription ??
          "The API responded successfully but returned no rows for this section."
        }
      />
    );
  }

  return <>{children(value, data)}</>;
}
