# KursoKo Agent Contract

Primary workflow contract for this repo. Overrides global defaults where noted.

## Output

- **Language:** normal English (not caveman) unless the user asks for caveman / `stop caveman` off.
- **Start replies:** `Role: <VoltAgent> | File: <path-to-agent.md>`
- **End replies:**
  - `Tools used: ...` — list tools actually invoked; include `stack: full | narrow | skipped (<reason>)`
  - `Savings: ...` — measured only; if none, `n/a`
- **Aaron access:** agent runs terminal, git, installs, edits. User has severe hand pain — do not ask them to type commands.
- **Mentor:** always on — one weakness + one fix when a plan is weak; no rubber-stamping.

## Architecture (quick)

- Vite + React SPA — client-side RIASEC scoring; **no backend** today.
- Runtime data: `src/data/*.json`
- Staging / sync: `docs/plans/kursoko-data*`, `scripts/sync-kursoko-data*.py`
- Tests: `npm run test` (Vitest), `npm run test:e2e` (Playwright)
- Docs index: `docs/00-index.md`
- No commits unless the user asks.

---

## Token stack — mandatory

**Goal:** map → compress/search → read. Do not flood context with raw `Read` / `Grep` first.

| Layer | Tool | Required when |
|-------|------|----------------|
| Map | **graphify** | Task is **Broad** (below) OR first touch of repo this session OR structural edit planned |
| Input | **gatemcp** | Every session: `gate_init` once; then compress/query before large reads |
| Search | **context-mode** | **Broad** multi-file / “where is X” / pipeline exploration |
| Deps | **ponytail** | Before new packages or abstractions |
| Agent | **VoltAgent** | Announce role; read agent `.md` before coding; `Task` subagent if large |

If a layer is unavailable, say **`Stack note: <layer> unavailable`** once, then fall back. Still report `stack: skipped (reason)` in `Tools used`.

### Classify every task (one line)

| Tier | Signals | Stack |
|------|---------|--------|
| **Broad** | “explore”, “how does X work”, pipeline, architecture, multi-folder, unknown location, data layer across matchers + JSON | **Full stack** (all rows above) |
| **Narrow** | User `@`-paths a file/folder; validate/transform one artifact; run a named script; single-file edit with path given | **Mini stack** (below) |
| **Structural** | New components/routes/data shape; refactor touching imports | Full stack + **`graphify update .`** after edits |

### Full stack (Broad + Structural planning)

Run in order before `Read` / wide `Grep`:

1. **graphify** — read `graphify-out/GRAPH_REPORT.md` if present; if missing or stale (`gate_init` warns), run `graphify update .` in repo root.
2. **gate_init** — once per session/repo (skip if already done this session unless new repo root).
3. **gate_graph_query** — when locating symbols, modules, or “what calls X”.
4. **gate_compress_file** — before reading any file **>400 lines** or any JSON **>800 lines** (structure/summary depth first).
5. **ctx_search** or **ctx_batch_execute** — before searching 3+ files or open-ended codebase questions.
6. **Targeted Read / Grep** — only on paths the stack surfaced; smallest slice needed.

### Mini stack (Narrow exception)

Allowed when the user pins a path **and** the task is validate / transform / run / edit that scope only:

1. **gate_init** — if not yet this session.
2. **gate_compress_file** — on each target file **>400 lines** before full read.
3. Direct Read / Shell / Grep **within the pinned scope only**.

**Still required:** do not `Read` entire multi-thousand-line JSON when a script or compress suffices.

**Not narrow** (must use full stack): “check pipeline”, “how we handle data”, “find duplicates across”, “explore project”, matcher + catalog cross-checks.

### Anti-patterns (do not)

- Open with 5+ full file reads before map/compress/search.
- `Grep` the whole repo for Broad tasks when `ctx_search` is available.
- Skip stack silently — always declare `stack: full | narrow | skipped (...)` in `Tools used`.
- Invent `Savings` numbers.

### After structural code changes

Run `graphify update .` and refresh `graphify-out/`.

---

## VoltAgent routing

1. Classify task (one line) + tier (Broad / Narrow / Structural).
2. Announce `Role: ... | File: ...`
3. Read that agent `.md` before edits.
4. Large work → Cursor `Task` subagent with this contract pasted in the prompt.

Catalog: `~/.cursor/voltagent/AGENT-INDEX.md`

---

## MCP inventory (quick)

**gatemcp:** `gate_init`, `gate_graph_query`, `gate_compress_file`, `gate_session_stats`, `gate_help`

**graphify:** `graphify update .`, `graphify-out/GRAPH_REPORT.md`

**context-mode:** `ctx_search`, `ctx_batch_execute`, `ctx_execute`, `ctx_index`

Full list: `.cursor/rules/kursoko.mdc`

---

## Conventions

- Components: `src/components/<Feature>/` + colocated `index.js`
- Landing / Questionnaire / Results CSS: see `kursoko.mdc`
- `npm run knip` before adding deps or components
