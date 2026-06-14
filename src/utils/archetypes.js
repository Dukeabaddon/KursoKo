/**
 * RIASEC → KursoKo archetype presentation layer.
 * Scoring stays in riasecScoring.js — this file is display-only.
 */

export const ARCHETYPES = {
  R: {
    id: 'builder',
    name: 'The Builder',
    tagline: 'You turn ideas into real things.',
    summary:
      'You learn best by doing. You like tools, systems, and work you can see and touch. Careers in engineering, trades, and applied technology often fit you well.',
    cardLabel: 'THE\nBUILDER',
    cardMultiLine: true,
    strengths: ['Hands-on problem solving', 'Practical focus', 'Reliability under pressure'],
    growthAreas: ['Planning before acting', 'Collaborating on abstract ideas'],
    learningStyle: 'Learn by building, fixing, and practicing in real situations.',
  },
  I: {
    id: 'pathfinder',
    name: 'The Pathfinder',
    tagline: 'You follow questions until the truth shows up.',
    summary:
      'You enjoy research, analysis, and deep thinking. You notice patterns others miss. Science, medicine, data, and research paths often match your style.',
    cardLabel: 'THE\nPATHFINDER',
    cardMultiLine: true,
    strengths: ['Analytical thinking', 'Curiosity', 'Independent study'],
    growthAreas: ['Sharing findings simply', 'Deciding when analysis is enough'],
    learningStyle: 'Learn through reading, experiments, and structured inquiry.',
  },
  A: {
    id: 'creator',
    name: 'The Creator',
    tagline: 'You express what others cannot yet imagine.',
    summary:
      'You value originality, design, and self-expression. You often thrive in arts, media, design, and any field that rewards fresh ideas.',
    cardLabel: 'THE\nCREATOR',
    cardMultiLine: true,
    strengths: ['Imagination', 'Visual and narrative sense', 'Flexible thinking'],
    growthAreas: ['Finishing projects', 'Working within constraints'],
    learningStyle: 'Learn through making, iterating, and creative exploration.',
  },
  S: {
    id: 'guardian',
    name: 'The Guardian',
    tagline: 'You lift people up and keep communities strong.',
    summary:
      'You care about people and community. Teaching, healthcare, counseling, and service roles often align with how you work best.',
    cardLabel: 'THE GUARDIAN',
    cardMultiLine: false,
    strengths: ['Empathy', 'Communication', 'Team support'],
    growthAreas: ['Setting boundaries', 'Handling conflict directly'],
    learningStyle: 'Learn through discussion, mentoring, and group work.',
  },
  E: {
    id: 'visionary',
    name: 'The Visionary',
    tagline: 'You see opportunity and move others to act.',
    summary:
      'You are energized by leadership, persuasion, and big goals. Business, entrepreneurship, politics, and sales paths often suit your drive.',
    cardLabel: 'THE\nVISIONARY',
    cardMultiLine: true,
    strengths: ['Leadership', 'Confidence', 'Strategic thinking'],
    growthAreas: ['Listening before deciding', 'Long-term follow-through'],
    learningStyle: 'Learn through projects, debate, and real-world challenges.',
  },
  C: {
    id: 'strategist',
    name: 'The Strategist',
    tagline: 'You bring order to complexity.',
    summary:
      'You excel at structure, detail, and dependable systems. Finance, administration, law, and operations often match your strengths.',
    cardLabel: 'THE\nSTRATEGIST',
    cardMultiLine: true,
    strengths: ['Organization', 'Accuracy', 'Process thinking'],
    growthAreas: ['Adapting when plans change', 'Taking creative risks'],
    learningStyle: 'Learn through clear steps, checklists, and consistent practice.',
  },
}

export function getArchetype(riasecCode) {
  return ARCHETYPES[riasecCode] ?? ARCHETYPES.R
}

export function getArchetypeForProfile(profile) {
  const code = profile?.primaryDimension?.code ?? 'R'
  return getArchetype(code)
}
