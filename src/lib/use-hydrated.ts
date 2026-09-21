"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * `false` while server-rendering and during the hydration render, `true`
 * afterwards.
 *
 * Use this instead of a `useState(false)` + `useEffect(() => setState(true))`
 * pair for anything that depends on browser-only state (localStorage, a
 * persisted store). It gives the same hydration-safe result without the extra
 * render that a setState-in-effect causes.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
