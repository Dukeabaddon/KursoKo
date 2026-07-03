import careersData from '../data/careers.json'

const RIASEC_CODES = ['R', 'I', 'A', 'S', 'E', 'C']
const CAREER_NARRATIVES = {
  'software-engineer':
    'You like figuring out how things work behind the screen — and making tools that actually help people. You probably enjoy puzzles, building small projects, and fixing problems until they finally click. This path rewards patience, curiosity, and the satisfaction of turning an idea into something real.',
  'mechanical-engineer':
    'You think in parts, motion, and how systems fit together. You may enjoy taking things apart, improving how they run, or designing solutions that work in the real world. This career fits students who want hands-on impact at a large scale.',
  architect:
    'You imagine spaces before they exist — how light, flow, and layout change how people feel. You blend creativity with structure, which makes architecture exciting if you want design that people live inside every day.',
  teacher:
    'You light up when someone finally understands something because of you. You care about people, not just grades, and you probably explain ideas in ways your classmates actually get. Teaching is a path for patient guides who want lasting impact.',
  psychologist:
    'You pay attention to what people feel, not just what they say. You are curious about behavior and motivated to help others understand themselves. Psychology suits empathetic thinkers who want depth, research, and human connection.',
  nurse:
    'You stay calm when others panic and show up when care matters most. You combine skill with heart — the kind of person friends trust in stressful moments. Nursing is for students who want a clear, meaningful healthcare path.',
  'graphic-designer':
    'You think in color, layout, and mood. You enjoy making ideas visible — posters, brands, stories people remember at a glance. Design is a strong fit if you express yourself visually and love creative problem-solving.',
  entrepreneur:
    'You see gaps and want to fill them yourself. You like leading, selling ideas, and learning by trying. Entrepreneurship fits students who would rather build something than wait for permission.',
  accountant:
    'You trust numbers when people get emotional. You like things neat, correct, and fair — especially when money or records are involved. Accountancy rewards detail, discipline, and clear thinking.',
  'civil-engineer':
    'You care about what communities stand on — roads, bridges, buildings that last. You want practical work with visible community impact. Civil engineering suits builders who think big and plan carefully.',
  'research-scientist':
    'You ask "why?" and will not stop until the evidence makes sense. You enjoy experiments, data, and discoveries that change what people believe. Research science is for patient investigators who love the chase.',
  'social-worker':
    'You notice who is struggling and want to stand beside them. Community, dignity, and support matter to you more than status. Social work fits students drawn to service and real-world problem-solving with people.',
  electrician:
    'You like fixing what is broken and making systems work safely. Hands-on skill and quick troubleshooting energize you. This trade path leads directly to employability with clear, practical mastery.',
  'marketing-manager':
    'You read people and trends — what they want, what catches attention, what makes them act. You enjoy persuasion, storytelling, and strategy. Marketing fits students who connect ideas with audiences.',
  'data-analyst':
    'You notice patterns other people miss — who bought what, which team is winning, which habit actually works. You enjoy organizing information and using it to make smarter choices. This path suits students who like logic and evidence.',
  chef:
    'You express care through food — timing, taste, and craft under pressure. You enjoy creating experiences people feel immediately. Culinary work fits makers who blend creativity with discipline.',
  lawyer:
    'You argue with purpose, not just to win. You care about rules, fairness, and speaking clearly under pressure. Law suits students who enjoy reading closely and defending a point with structure.',
  'hr-specialist':
    'You see teams as people first, systems second. You like helping groups communicate, grow, and stay organized. HR fits students who balance empathy with structure.',
  'content-creator':
    'You turn thoughts into videos, posts, or stories that connect. You experiment, learn in public, and enjoy audience feedback. Content creation fits expressive students who like media and momentum.',
  pharmacist:
    'You combine science with trust — medicine, dosage, and patient safety. You like precision and helping people stay healthy. Pharmacy suits detail-oriented students drawn to healthcare and chemistry.',
}

function weightedScore(scores, weights) {
  let total = 0
  let weightSum = 0

  RIASEC_CODES.forEach((code) => {
    const w = weights[code] ?? 0
    total += (scores[code] ?? 0) * w
    weightSum += w
  })

  if (weightSum === 0) return 0
  return total / weightSum
}

function toPercent(rawScore, maxScore) {
  if (maxScore <= 0) return 0
  const ratio = rawScore / maxScore
  return Math.min(99, Math.max(55, Math.round(ratio * 100)))
}

/**
 * Rank careers by RIASEC-weighted fit. Preserves scoring engine — presentation only.
 */
export function getCareerMatches(profile, limit = 10) {
  const scores = profile.scores ?? {}
  const maxScore = Math.max(...Object.values(scores), 1)
  const primaryCode = profile.primaryDimension?.code
  const secondaryCode = profile.secondaryDimension?.code

  const ranked = careersData.careers
    .map((career) => {
      const raw = weightedScore(scores, career.riasecWeights)
      const matchPercent = toPercent(raw, maxScore)
      const reasons = []

      if (primaryCode && (career.riasecWeights[primaryCode] ?? 0) >= 0.7) {
        reasons.push(`Strong fit with your ${profile.primaryDimension.info.name} strength`)
      }
      if (secondaryCode && (career.riasecWeights[secondaryCode] ?? 0) >= 0.6) {
        reasons.push(`Aligns with your ${profile.secondaryDimension.info.name} side`)
      }
      if (reasons.length === 0) {
        reasons.push('Matches your overall interest pattern')
      }

      return {
        ...career,
        matchPercent,
        whyMatched: reasons,
        strengthsUsed: career.skills.slice(0, 2),
        narrative:
          CAREER_NARRATIVES[career.id] ??
          `This path aligns with your ${profile.primaryDimension?.info?.name?.toLowerCase() ?? 'top'} strengths and rewards the kinds of tasks you naturally lean toward.`,
      }
    })
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, limit)

  return ranked
}
