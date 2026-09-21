/**
 * Budget for any single storefront database query.
 *
 * A try/catch alone is not enough protection: an unreachable or very slow
 * database does not reject, it hangs. Without this, a build whose database is
 * down spends its whole per-page budget waiting and then fails the deploy,
 * instead of quietly falling back. Verified by building against a dead host.
 *
 * Neon answers in tens of milliseconds, so five seconds is generous.
 */
export const QUERY_TIMEOUT_MS = 5000;

export function withTimeout<T>(work: Promise<T>, label: string): Promise<T> {
  return Promise.race([
    work,
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error(`${label} exceeded ${QUERY_TIMEOUT_MS}ms`)),
        QUERY_TIMEOUT_MS
      ).unref?.()
    ),
  ]) as Promise<T>;
}
