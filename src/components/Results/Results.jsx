import { useRef, useState } from 'react'
import { getPersonalityProfile } from '../../utils/riasecScoring'
import { getCourseRecommendations, getMatchStrengthColor } from '../../utils/courseRecommendations'
import { getArchetypeForProfile } from '../../utils/archetypes'
import { getCareerMatches } from '../../utils/careerMatcher'
import { getScholarshipMatches, getScholarshipsMetadata } from '../../utils/scholarshipMatcher'
import { exportElementAsPng } from '../../utils/shareExport'
import CharacterCard from '../CharacterCard'
import ShareCard from './ShareCard'

function Results({ responses, onRetake, onHome }) {
  const profile = getPersonalityProfile(responses)
  const { scores, primaryDimension, secondaryDimension, allDimensions } = profile
  const archetype = getArchetypeForProfile(profile)
  const careerMatches = getCareerMatches(profile, 4)
  const scholarships = getScholarshipMatches(profile, careerMatches, 5)
  const scholarshipMeta = getScholarshipsMetadata()
  const courseRecommendations = getCourseRecommendations(profile.combination)
  const [shareMessage, setShareMessage] = useState('')
  const shareCardRef = useRef(null)

  const getColorClass = (color) => {
    const colorMap = {
      red: 'bg-red-50 text-red-800 border-red-200',
      blue: 'bg-blue-50 text-blue-800 border-blue-200',
      purple: 'bg-purple-50 text-purple-800 border-purple-200',
      green: 'bg-green-50 text-green-800 border-green-200',
      orange: 'bg-orange-50 text-orange-800 border-orange-200',
      gray: 'bg-gray-50 text-gray-800 border-gray-200',
    }
    return colorMap[color] || 'bg-gray-50 text-gray-800 border-gray-200'
  }

  const buildShareText = () => {
    const top = careerMatches[0]
    const careerLine = top ? `${top.title} — ${top.matchPercent}% match` : 'Explore careers on KursoKo'
    return `${archetype.name} — ${archetype.tagline}\n\n${archetype.summary}\n\nTop fit: ${careerLine}`
  }

  const handleShare = async () => {
    const text = buildShareText()
    try {
      if (navigator.share) {
        await navigator.share({
          title: `My KursoKo result: ${archetype.name}`,
          text,
        })
        setShareMessage('Shared!')
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        setShareMessage('Copied to clipboard!')
      } else {
        setShareMessage('Copy not supported on this browser.')
      }
    } catch {
      setShareMessage('Share cancelled.')
    }
    setTimeout(() => setShareMessage(''), 3000)
  }

  const handleDownloadCard = async () => {
    try {
      await exportElementAsPng(shareCardRef.current, `kursoko-${archetype.id}.png`)
      setShareMessage('Share card downloaded!')
    } catch {
      setShareMessage('Could not export image.')
    }
    setTimeout(() => setShareMessage(''), 3000)
  }

  return (
    <div className="results-editorial min-h-screen bg-stone-100 py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4">
        <header className="text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500 mb-2">
            Your archetype
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-stone-900 mb-3">
            {archetype.name}
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">{archetype.tagline}</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <section className="bg-white rounded-2xl shadow-md p-6 border border-stone-200">
            <div className="flex flex-col items-center space-y-6">
              <CharacterCard
                riasecCode={primaryDimension.code || 'R'}
                cardLabel={archetype.cardLabel}
                cardMultiLine={archetype.cardMultiLine}
                portraitAlt={`${archetype.name} portrait`}
              />

              <div className="w-full max-w-md text-center">
                <p className="text-stone-700 leading-relaxed mb-4">{archetype.summary}</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center justify-center rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-stone-800 transition-colors duration-normal"
                  >
                    Share text
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadCard}
                    className="inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-50 transition-colors duration-normal"
                  >
                    Download card
                  </button>
                </div>
                {shareMessage && (
                  <p className="mt-2 text-sm text-emerald-700" role="status">
                    {shareMessage}
                  </p>
                )}
              </div>

              <div className="fixed -left-[9999px] top-0 w-[360px] pointer-events-none" aria-hidden="true">
                <ShareCard
                  cardRef={shareCardRef}
                  archetype={archetype}
                  topCareer={careerMatches[0]}
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-md p-6 border border-stone-200">
            <h2 className="font-display text-2xl font-bold text-stone-900 mb-6">Top career matches</h2>

            <div className="space-y-3 mb-8">
              {careerMatches.map((career, index) => (
                <details
                  key={career.id}
                  className="rounded-xl border border-stone-200 bg-stone-50 open:bg-white open:shadow-sm transition-shadow duration-normal"
                  open={index === 0}
                >
                  <summary className="cursor-pointer list-none px-4 py-3 flex justify-between items-center gap-3">
                    <span className="font-semibold text-stone-900">
                      {career.title}
                    </span>
                    <span className="text-lg font-bold text-amber-700 tabular-nums shrink-0">
                      {career.matchPercent}%
                    </span>
                  </summary>
                  <div className="px-4 pb-4 text-sm text-stone-600 space-y-2 border-t border-stone-100 pt-3">
                    <p>
                      <span className="font-medium text-stone-800">Why matched: </span>
                      {career.whyMatched.join(' · ')}
                    </p>
                    <p>
                      <span className="font-medium text-stone-800">Strengths used: </span>
                      {career.strengthsUsed.join(', ')}
                    </p>
                    <p>
                      <span className="font-medium text-stone-800">Skills: </span>
                      {career.skills.join(', ')}
                    </p>
                    <p>
                      <span className="font-medium text-stone-800">Learning path: </span>
                      {career.learningPath}
                    </p>
                  </div>
                </details>
              ))}
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-stone-900 mb-4">Interest profile</h3>
              <div className="space-y-3">
                {allDimensions
                  .sort((a, b) => b.score - a.score)
                  .map((dimension) => (
                    <div key={dimension.code} className="flex items-center gap-3">
                      <div className="w-24 text-sm font-medium text-stone-700 shrink-0">
                        {dimension.info.name}
                      </div>
                      <div className="flex-1 bg-stone-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-3 rounded-full bg-stone-800 transition-all duration-500"
                          style={{
                            width: `${(dimension.score / Math.max(...Object.values(scores), 1)) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="w-8 text-sm font-medium text-stone-700">{dimension.score}</div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="rounded-xl bg-stone-50 p-5 border border-stone-200">
              <h3 className="text-lg font-semibold text-stone-900 mb-3">Recommended programs</h3>
              {courseRecommendations ? (
                <div className="space-y-3">
                  <p className="text-sm text-stone-600">{courseRecommendations.description}</p>
                  {courseRecommendations.courses.slice(0, 3).map((course, index) => (
                    <details key={index} className="bg-white rounded-lg border border-stone-200 p-3">
                      <summary className="cursor-pointer font-medium text-stone-800 list-none flex justify-between items-center">
                        <span>{course.title}</span>
                        <span
                          className={`px-2 py-1 rounded text-xs border ${getMatchStrengthColor(course.matchStrength)}`}
                        >
                          {course.matchStrength}
                        </span>
                      </summary>
                      <p className="text-sm text-stone-600 mt-3">{course.description}</p>
                    </details>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-600">
                  Explore programs tied to {primaryDimension.info?.name} and {secondaryDimension.info?.name}.
                </p>
              )}
            </div>
          </section>
        </div>

        <section className="mt-8 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-stone-900 mb-2">Scholarships for you</h2>
          <p className="text-sm text-stone-500 mb-6">{scholarshipMeta.disclaimer}</p>
          <div className="grid md:grid-cols-2 gap-4">
            {scholarships.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-stone-200 p-4 hover:border-amber-300 transition-colors duration-normal"
              >
                <p className="text-xs uppercase tracking-wider text-stone-500">{item.provider}</p>
                <h3 className="font-semibold text-stone-900 mt-1">{item.name}</h3>
                <p className="text-sm text-stone-600 mt-2 line-clamp-2">{item.benefits[0]}</p>
                <p className="text-xs text-stone-400 mt-2">
                  Verified {item.verificationDate} · {item.category}
                </p>
                <a
                  href={item.applicationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-sm font-semibold text-amber-800 hover:text-amber-900 underline-offset-2 hover:underline"
                >
                  Official application link →
                </a>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <section className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
            <h3 className="font-bold text-stone-900 mb-3">Strengths</h3>
            <ul className="space-y-2 text-sm text-stone-700">
              {archetype.strengths.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </section>
          <section className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
            <h3 className="font-bold text-stone-900 mb-3">Growth areas</h3>
            <ul className="space-y-2 text-sm text-stone-700">
              {archetype.growthAreas.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </section>
          <section className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
            <h3 className="font-bold text-stone-900 mb-3">Learning style</h3>
            <p className="text-sm text-stone-700">{archetype.learningStyle}</p>
          </section>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <button
            type="button"
            onClick={onRetake}
            className="px-6 py-3 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors duration-normal"
          >
            Retake assessment
          </button>
          <button
            type="button"
            onClick={onHome}
            className="px-6 py-3 bg-stone-200 text-stone-800 rounded-xl hover:bg-stone-300 transition-colors duration-normal"
          >
            Back to home
          </button>
        </div>
      </div>
    </div>
  )
}

export default Results
