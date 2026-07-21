# ADR-001: Correlate Complete RIASEC Profiles

## Status

Accepted on 2026-07-17.

## Context

KursoKo previously ranked careers with 65% cosine similarity and a 35% discrete
top-two-code bonus. The bonus caused large fit changes near tied RIASEC scores,
and its fixed thresholds were not grounded in the assessment scale.

## Decision

Rank careers by Pearson correlation between the student's six RIASEC scores and
the career's six occupational-interest weights. Convert positive correlation to
the existing 0–100 exploration meter. Keep eligibility and explicit career
preferences separate from the RIASEC fit calculation.

This follows the profile-correspondence method documented in the October 2025
O*NET Interest Profiler career-returns report:

<https://www.onetcenter.org/reports/IP_Career_Returns.html>

## Alternatives

- Keep the blended scorer: rejected because the categorical bonus is discontinuous.
- Use cosine only: continuous, but it measures vector angle without centering and
  retained the sparse-tail advantage found in the reported Military Officer case.
- Manually reduce Military Officer weights: rejected because it would tune data
  toward one desired result without occupational evidence.

## Consequences

- Ranking uses the full RIASEC shape, including shared high and low interests.
- Near ties change fit continuously.
- Fit remains an exploration measure, not eligibility or outcome probability.
- Hand-authored career profiles still require provenance and calibration.
- Specialized paths can require explicit interest without distorting RIASEC math.

## Revisit Trigger

Revisit when KursoKo has occupation-specific validated profiles or anonymized
student outcome data sufficient for calibration.
