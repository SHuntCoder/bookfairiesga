# Book Fairies Error Code Reference

All errors shown on the site follow the format **BF-XXX** (Book Fairies).  
If a visitor or dev sees a code, look it up below to understand the cause and fix.

---

## BF-1xx — Authentication

| Code | Meaning | What to check | Fix |
|------|---------|--------------|-----|
| **BF-101** | Incorrect password entered in the Developer Login | Founder typed the wrong password | Remind them the password is `BookFairiesGA123` |

---

## BF-2xx — Photo Gallery

| Code | Meaning | What to check | Fix |
|------|---------|--------------|-----|
| **BF-201** | Gallery photos failed to load on page open | GitHub API down, or `gallery.json` is malformed | Check `artifacts/book-fairies/src/gallery.json` in the repo is valid JSON. Check [githubstatus.com](https://githubstatus.com) |
| **BF-202** | Photo file could not be uploaded to GitHub | Token expired, repo permission issue, or file too large | Check the GitHub token is still valid in the Replit `VITE_GITHUB_TOKEN` secret. Images over ~25 MB will fail |
| **BF-203** | Photo could not be removed — `gallery.json` update failed | GitHub API conflict or token issue | Wait 30 seconds and try again. If it persists, check the token in Replit secrets |
| **BF-204** | `gallery.json` update failed during an upload or delete | Rare race condition after multiple rapid writes | Wait a minute and retry. If repeated, open `gallery.json` in the GitHub repo and verify it is valid JSON |

---

## BF-3xx — Book Counter

| Code | Meaning | What to check | Fix |
|------|---------|--------------|-----|
| **BF-301** | Book count could not be loaded from GitHub | `book-count.json` missing or GitHub unreachable | Check `artifacts/book-fairies/src/book-count.json` exists in the repo. Page will show default 4,000 |
| **BF-302** | New book count could not be saved to GitHub | Token expired or file conflict | Check the `VITE_GITHUB_TOKEN` secret in Replit is still valid and has `repo` write scope |

---

## BF-4xx — GitHub API / Network

| Code | Meaning | What to check | Fix |
|------|---------|--------------|-----|
| **BF-401** | GitHub returned an unexpected API error | Inspect the detail shown alongside the code for GitHub's own message | Usually transient — wait a moment and retry. If it says "Bad credentials", the token needs to be renewed in Replit secrets |
| **BF-402** | SHA conflict — the file was modified by another process and all automatic retries (3×) were exhausted | Two people using the dev panel at the same time, or a very rapid sequence of edits | Wait 30 seconds and try again. Only one person should use the dev panel at a time |
| **BF-403** | Network request failed entirely | No internet connection on the device | Check the device's internet connection and retry |

---

## Quick reference card

```
BF-101  Wrong password
BF-201  Gallery won't load
BF-202  Upload failed
BF-203  Delete failed
BF-204  Gallery list update failed
BF-301  Book count won't load
BF-302  Book count save failed
BF-401  GitHub API error (see detail)
BF-402  Conflict — retry later
BF-403  No network
```

---

_Last updated: 2026-07-26_
