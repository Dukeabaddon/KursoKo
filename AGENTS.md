# KursoKo Agent Contract

Use this order when available:
1. `graphify-out/` or `graphify`
2. `gatemcp`: `gate_init` -> `gate_graph_query` / `gate_compress_file`
3. `context-mode`: `ctx_search` / `ctx_batch_execute` for broad search
4. Targeted file reads only after compressed search/context

Rules:
- If a preferred tool is unavailable, say so once and fall back.
- Be concise, but use normal English. Do not use caveman phrasing in this repo unless the user explicitly asks for it.
- Prefer the right VoltAgent specialist before broad exploration.
- Refresh `graphify-out/` after structural code changes.
- Use ponytail logic before adding new dependencies or abstractions.
- End every user-facing response with:
  - `Tools used: ...`
  - `Savings: ...`
- Report measured savings only. If unavailable, write `n/a`.
