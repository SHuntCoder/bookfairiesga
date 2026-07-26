// ── Book Fairies Error Code System ────────────────────────────────────────────
// Format: BF-XXX  (BF = Book Fairies)
//   1xx  Authentication
//   2xx  Photo gallery
//   3xx  Book counter
//   4xx  GitHub API / network
//
// See ERROR_CODES.md at the project root for admin reference.

export type BFCode =
  | 'BF-101'                              // Wrong password
  | 'BF-201' | 'BF-202' | 'BF-203'       // Gallery load / upload / delete
  | 'BF-204'                              // Gallery JSON update failed
  | 'BF-301' | 'BF-302'                  // Book counter load / save
  | 'BF-401' | 'BF-402' | 'BF-403';     // GitHub API / network / retries exhausted

const MESSAGES: Record<BFCode, string> = {
  'BF-101': 'Incorrect password',
  'BF-201': 'Could not load gallery photos',
  'BF-202': 'Photo upload failed',
  'BF-203': 'Photo removal failed',
  'BF-204': 'Gallery list update failed',
  'BF-301': 'Could not load book count',
  'BF-302': 'Book count save failed',
  'BF-401': 'GitHub API error',
  'BF-402': 'Conflict — max retries reached',
  'BF-403': 'Network error — check your connection',
};

export class BFError extends Error {
  constructor(public readonly code: BFCode, detail?: string) {
    super(detail ? `${MESSAGES[code]} (${detail})` : MESSAGES[code]);
    this.name = code;
  }
  /** Short label shown in the UI, e.g. "BF-203 · Photo removal failed" */
  get label() { return `${this.code} · ${MESSAGES[this.code]}`; }
}

/** Wrap an unknown caught value into a displayable string with the BF code prefix. */
export function formatBFError(err: unknown, fallback: BFCode): string {
  if (err instanceof BFError) return err.label;
  const detail = err instanceof Error ? err.message : undefined;
  return new BFError(fallback, detail).label;
}
