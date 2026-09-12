/**
 * The four counts, read from the product rather than copied by hand.
 *
 * .env.example says of this endpoint: "There is deliberately no live fetch
 * today — the numbers are copied from it by hand, so the site cannot render a
 * wrong number because a request failed, and cannot render a spinner where a
 * number should be."
 *
 * Both of those risks are real and both are avoided here, but hand-copying had
 * already produced the thing it was protecting against: /about shipped "20
 * jobs" while 8 were open and 12 were closed, and src/lib/site.ts claimed
 * "1,200+ live opportunities" — 150 times the truth, on the page whose whole
 * argument is that this platform prints small real numbers instead of large
 * invented ones. A number that is stale is a number that is wrong; copying it
 * by hand only moves the moment of being wrong to whenever the database next
 * changes, with nobody watching.
 *
 * So: fetched on the SERVER, at build time and then once an hour. The browser
 * makes no request, which means no CORS to arrange and no spinner to render —
 * the HTML arrives with the numbers already in it. If the API is down or slow,
 * `FALLBACK` renders instead, which is precisely the hand-copied behaviour the
 * env note asked for. The page never waits and never shows a blank.
 */

export type PlatformStats = {
  /** Opportunities a woman can apply to today. Closed ones are not counted. */
  jobs: number;
  /** Courses running or upcoming. Finished and archived ones are not counted. */
  courses: number;
  /** Members whose account is active. Pending and rejected are not counted. */
  members: number;
  /** Savings and support circles currently running. */
  circles: number;
};

/*
  Verified against the database on 2026-09-12. These are the live counts, not
  the totals — 28 courses exist and 10 have finished or been archived; 20
  opportunities have been posted and 12 are closed; 37 members have signed up
  and 9 are pending review, inactive or rejected.
*/
export const FALLBACK: PlatformStats = {
  jobs: 8,
  courses: 18,
  members: 28,
  circles: 45,
};

const API =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://api.womsakhi.com/api/v1";

export async function getPlatformStats(): Promise<PlatformStats> {
  try {
    const res = await fetch(`${API}/public/stats`, {
      // Rebuilt into the page at most once an hour. These move slowly, and the
      // endpoint is unauthenticated — it should not be hit on every visit.
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return FALLBACK;
    const raw: unknown = await res.json();
    if (typeof raw !== "object" || raw === null) return FALLBACK;
    const n = (key: keyof PlatformStats) => {
      const v = (raw as Record<string, unknown>)[key];
      // A missing key must not become 0 — "0 circles running" printed because a
      // field was renamed is a worse lie than a stale one.
      return typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : FALLBACK[key];
    };
    return { jobs: n("jobs"), courses: n("courses"), members: n("members"), circles: n("circles") };
  } catch {
    return FALLBACK;
  }
}
