## Purpose
Convert `scholarship_categories.json` research-stage category records into runtime-safe records for `src/data/scholarships.json` without changing app code.

Current runtime expects one flat scholarship object with:
- `id`
- `provider`
- `category`
- `name`
- `benefits[]`
- `coverage[]`
- `requirements[]`
- `riasecTags[]`
- `careerTags[]`
- `applicationLink`
- `verificationDate`
- `verificationSource`

The current Results UI only renders:
- `provider`
- `name`
- `benefits[0]`
- first 3 `requirements`
- `applicationLink`
- `verificationDate`

So flattening should prioritize:
1. clear scholarship title
2. exact money benefit in `benefits[0]`
3. short actionable requirements
4. stable scoring tags

## Runtime Strategy
Use a hybrid model:

### Keep umbrella records
Keep umbrella records in runtime when:
- amounts vary too much by subcategory
- official page is the real discovery surface
- the program is broad and category details may change often

Examples:
- TESDA umbrella programs
- broad LGU umbrella pages if no stable exact amount grid exists

### Split category records into runtime rows
Create separate runtime rows when:
- exact tuition/stipend amounts are stable and category-specific
- the category is meaningful to end users
- the category has distinct eligibility

Examples:
- QCYDO category records
- DLSU Archer Achiever vs St. La Salle Grant
- CIIT Interweave vs Future CIITzen vs Financial Aid

## Flattening Rules

### 1. Runtime `id`
- Use category record `id` directly when category-specific row is created.
- Keep existing umbrella `id` when preserving umbrella record.

### 2. Runtime `name`
Format:
- `<Program> — <Subcategory>`

Examples:
- `Quezon City Scholarship Program — QC Excel Scholarship`
- `CIIT Scholarship Programs — Interweave Scholarship Program`
- `De La Salle University — Archer Achiever Scholarship`

Avoid generic names like only `Financial Aid Grants`.

### 3. Runtime `category`
Normalize to current runtime-safe buckets:
- `government`
- `private`
- `university`

Map staging categories:
- LGU / Provincial / National government -> `government`
- private-foundation / corporate -> `private`
- school-administered aid -> `university`

Do not introduce new runtime category enums yet.

### 4. Runtime `benefits[]`
`benefits[0]` must carry the clearest money summary.

Priority:
1. tuition + stipend exact amount
2. exact discount tier
3. exact one-time grant
4. if variable, say so clearly

Examples:
- `Up to PHP 110,000 tuition grant + PHP 50,000 stipend per school year`
- `100% tuition and fee waiver`
- `25% / 50% / 75% / 100% tuition and fees discount depending on award`
- `PHP 4,000 per semester educational assistance`

Additional lines can go in `benefits[1..]`.

### 5. Runtime `coverage[]`
Use short support types only:
- `Tuition grant`
- `Stipend`
- `Book allowance`
- `Transport allowance`
- `Dormitory assistance`
- `Assessment fee`
- `Training cost`
- `Toolkit`
- `One-time grant`

### 6. Runtime `requirements[]`
Use the first 3-5 strongest qualifiers only.

Priority:
1. residency
2. level / enrollment
3. merit or income rule
4. portal/account requirement

Keep concise because the current UI only shows 3.

### 7. Runtime `level[]`
Map to current simple values:
- `shs`
- `college`
- `graduate`
- `tvet`
- `continuing-education`

For runtime v1, prefer records with:
- `college`
- `graduate`
- `tvet`

SHS can be kept but may be less relevant if result audience is mixed.

### 8. Runtime `riasecTags[]`
Use:
- all six letters for broad financial aid
- targeted tags only when category clearly maps to a field

Examples:
- QCYDO Economic / Academic / Youth Leaders -> all six
- NCCA arts -> `["A"]`
- DOST S&T -> `["I","R"]`
- CIIT Interweave -> `["A","I"]`

### 9. Runtime `careerTags[]`
Only use current runtime career ids.

Good:
- `software-engineer`
- `teacher`
- `nurse`
- `accountant`

Avoid prose labels like:
- `Engineer`
- `Scientist`
- `Business Manager`

These must be mapped to existing ids or left empty.

### 10. Runtime `institutionTags[]`
Keep lowercase slugs only.
Examples:
- `qcydo`
- `up-system`
- `pup-system`
- `partner-heis`
- `tesda`

### 11. Runtime `applicationLink`
Use the real application portal if one exists.
Otherwise use official scholarship page.

Examples:
- QCSP -> `https://qceservices.quezoncity.gov.ph/`
- UP SLAS -> `https://slasonline.up.edu.ph/`

### 12. Runtime `deadlineNotes`
Prefer:
- exact window if known
- otherwise a short cycle note

Examples:
- `Annual application cycle; check QCYDO announcements`
- `Per semester via OSFA`
- `Rolling or slot-based by TESDA regional release`

## Priority Flatten Order

### Phase 1 — safest high-value
1. QCYDO category rows
2. Ateneo rows
3. DLSU rows
4. CIIT rows
5. UP rows
6. PUP rows
7. Miriam rows

Reason:
- strongest verified amounts / tiers
- best user-visible value
- most likely to improve summary report quickly

### Phase 2 — selective LGU / province
Only flatten rows with stable exact figures:
- Pasig PAG-ASA
- Rizal Full Scholar
- Rizal Student Assistance
- Pampanga EFAP College
- Pampanga EFAP SHS
- Bulacan Tulong Pang-Edukasyon (with explicit amount strings)

Keep more variable province entries as umbrella records until confirmed.

### Phase 3 — TESDA
Do not flatten qualification-level runtime rows yet.
Keep TESDA as umbrella records in runtime until there is:
- allocation-by-qualification data
- region-specific slot info
- assessment/toolkit detail normalization

## Review Checklist

Before any row moves into runtime:
- exact money string visible in `benefits[0]`
- `category` normalized to runtime enum
- `careerTags` use only existing runtime ids
- `applicationLink` is official and live
- `requirements` reduced to top 3-5
- no empty `benefits`
- no empty `requirements`
- no raw research-only fields leaking in

## Runtime Example

```json
{
  "id": "qcsp-tertiary-qc-excel",
  "provider": "Quezon City Government (through QCYDO)",
  "category": "government",
  "name": "Quezon City Scholarship Program - QC Excel Scholarship",
  "status": "active",
  "eligibility": [
    "Quezon City resident",
    "Verified QCitizen ID",
    "Recognized tertiary institution"
  ],
  "benefits": [
    "Up to PHP 110,000 tuition grant + PHP 50,000 stipend per school year",
    "Renewed per term or semester under current QC guide rules"
  ],
  "coverage": [
    "Tuition grant",
    "Stipend"
  ],
  "requirements": [
    "Quezon City residency",
    "QCitizen ID",
    "Academic merit"
  ],
  "location": [
    "NCR"
  ],
  "level": [
    "college"
  ],
  "riasecTags": ["R", "I", "A", "S", "E", "C"],
  "careerTags": [],
  "institutionTags": ["qcydo", "qcitizen", "any-hei"],
  "applicationLink": "https://qceservices.quezoncity.gov.ph/",
  "deadlineNotes": "Annual application cycle; check QCYDO announcements",
  "verificationDate": "2026-07-02",
  "verificationSource": "https://quezoncity.gov.ph/qcitizen-guides/qc-scholars-guide/"
}
```

## Recommendation
Do not flatten all 44 records at once.

Best next step:
- flatten Phase 1 only
- review output
- then decide whether to add selected LGU/province rows
