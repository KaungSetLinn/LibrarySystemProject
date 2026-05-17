# Static review report: comments and bug countermeasures

Scope:
- Commented source files outside `library-backend`.
- `library-backend` was intentionally left unchanged for the comment pass.
- Bug review included frontend, `library-backend`, and `library-Tbackend`.
- This review is static. No server/database runtime reproduction was executed in this environment.

## Comment pass

Inserted a file-level readable-code review note into all commentable source files outside `library-backend`:

- JS, HTML, CSS, SQL, and BAS files: 79 files
- JSON/package files: not commented because comments would make JSON invalid
- `library-backend`: not modified
- `node_modules` and `.git`: not modified

See `COMMENTED_FILES_MANIFEST.txt` for the exact file list.

Syntax check:
- `node --check` passed for project JS files outside `node_modules` after the comment pass.

## Bug 1: advanced search by category returns no results

Primary finding:
- The advanced-search dropdown uses these category labels:
  - `frontend/js/screens/screen-advanced-search.js`: `文学`, `科学`, `技術`, `歴史`, `その他`
- Seed/backend data categories are different:
  - `文芸`, `情報科学`, `生活`, `法律`, `学術`, `福祉`
- Every implementation reviewed performs exact category matching:
  - `frontend/js/datasource/excel-adapter.js`: exact comparison against `b.category`
  - `frontend/js/datasource/sqlite-adapter.js`: SQL `category = ?`
  - `library-backend/controllers/bookController.js`: exact Sequelize category condition
  - `library-Tbackend/controllers/bookController.js`: exact Sequelize category condition

Countermeasures:
1. Replace the hardcoded category options in the advanced-search screen with real category values from the data source.
2. Prefer a category master source or endpoint, for example `GET /api/v1/books/categories`, then render options dynamically.
3. If legacy display labels are required, separate `option.value` from display text. The value must be the database/search value.
4. Add tests that select each category value and assert that at least known seeded books are returned.
5. Keep exact matching if the UI is driven by controlled values; do not use fuzzy matching as the primary fix.

## Bug 2: reserve button in search results cannot be clicked

Primary findings:
- The button is disabled unless `b.canReserve` is truthy:
  - `frontend/js/screens/screen-search-results.js`
- The SQLite repository returns `actionState` and `actionLabel`, but it does not return `canReserve`:
  - `frontend/js/datasource/sqlite-adapter.js`
- Because the default config uses SQLite, this is the most direct frontend cause when the app runs in local SQLite mode.
- Both backend search controllers also return `actionState` and `actionLabel`, but they do not return `canReserve`:
  - `library-backend/controllers/bookController.js`
  - `library-Tbackend/controllers/bookController.js`
- In API mode, `frontend/js/datasource/api-adapter.js` returns backend books without adding a normalized `canReserve` field.
- `ApiAdapter.reserveBook()` is a stub that always returns an error even though `library-backend` provides `POST /api/v1/reservations`.
- `library-Tbackend/server.js` mounts only `/api/users` and `/api/books`, not reservation routes.
- The service/screen code is synchronous, while `ApiAdapter` methods are asynchronous. If `ApiAdapter` is selected, `Service.searchBooks()` and `Service.reserveBook()` can receive Promises instead of data.

Countermeasures:
1. Add a normalized `canReserve` field to every search result row.
   - Immediate SQLite fix: include `canReserve: actionState === "AVAILABLE"` in `frontend/js/datasource/sqlite-adapter.js` result mapping.
   - Backend-side option: include `canReserve` in both backend search responses.
   - Frontend-side API option: normalize in `ApiAdapter.searchBooks()` from `actionState`.
2. Align the business rule for loaned books:
   - If loaned books are reservable as a waiting reservation, treat `ON_LOAN` as `canReserve: true`.
   - If loaned books are not reservable, keep `ON_LOAN` disabled and adjust labels consistently.
3. Implement `ApiAdapter.reserveBook()` for the active backend.
   - MAIN backend: call `POST /api/v1/reservations` with `{ bookId }`.
   - TEST backend: add and mount reservation routes, or explicitly disable API reservation in TEST mode with a visible message.
4. Align API paths by backend mode.
   - MAIN backend uses `/api/v1/auth`, `/api/v1/books`, and `/api/v1/reservations`.
   - TEST backend currently uses `/api/users` and `/api/books`.
5. Make Service and the search-results screen async if `ApiAdapter` remains a possible repository implementation.
   - `await _repo().searchBooks(...)`
   - `await _repo().reserveBook(...)`
   - Update screen handlers to `async` and await service calls.
6. Fix backend switching in `start.js`.
   - `frontend/library-system-config.txt` uses `backendMode=MAIN`, but `start.js` currently parses comma-separated lines.
   - Accept `key=value` and optionally comma format for backward compatibility.
7. Improve `ApiAdapter.ping()`.
   - Use real health endpoints per mode and avoid treating unrelated 404 responses as a valid compatible API.

## High-priority patch order

1. Category options: align UI values with data categories.
2. Search result normalization: ensure every book row has `canReserve`, starting with `sqlite-adapter.js`.
3. API paths: align `ApiAdapter` with MAIN and TEST endpoints.
4. Reservation API: implement `ApiAdapter.reserveBook()` and mount TEST reservation route if TEST mode must support reservations.
5. Async contract: make service/screen code robust when repository methods return Promises.
6. Config parser: fix `start.js` to parse `backendMode=...`.
