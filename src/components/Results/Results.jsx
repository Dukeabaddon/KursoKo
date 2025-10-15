import { getPersonalityProfile } from '../../utils/riasecScoring'
import { getCourseRecommendations, getMatchStrengthColor } from '../../utils/courseRecommendations'
import CharacterCard from '../CharacterCard'

function Results({ responses, onRetake, onHome }) {
  // Calculate RIASEC personality profile
  const profile = getPersonalityProfile(responses)
  const { scores, primaryDimension, secondaryDimension, allDimensions } = profile

  // Get course recommendations
  const courseRecommendations = getCourseRecommendations(profile.combination)

  const getColorClass = (color) => {
    const colorMap = {
      red: 'bg-red-50 text-red-800 border-red-200',
      blue: 'bg-blue-50 text-blue-800 border-blue-200',
      purple: 'bg-purple-50 text-purple-800 border-purple-200',
      green: 'bg-green-50 text-green-800 border-green-200',
      orange: 'bg-orange-50 text-orange-800 border-orange-200',
      gray: 'bg-gray-50 text-gray-800 border-gray-200'
    }
    return colorMap[color] || 'bg-gray-50 text-gray-800 border-gray-200'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Your RIASEC Results
          </h1>
          <div className="bg-blue-50 rounded-lg p-4 inline-block">
            <p className="text-blue-800">
              <span className="font-semibold">Assessment Complete!</span> You answered {responses.length} questions.
            </p>
            <p className="text-blue-600 text-sm mt-1">
              Your personality profile: <span className="font-medium">{profile.combination}</span>
            </p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Character Card + Description */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col items-center space-y-6">
              {/* Character Card */}
              <div className="flex justify-center">
                <CharacterCard 
                  riasecCode={primaryDimension.code || 'R'} 
                  gender={Math.random() > 0.5 ? 'female' : 'male'} 
                />
              </div>
              
              {/* Character Description */}
              <div className="w-full max-w-md text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {primaryDimension.info?.name} - {getRiasecLabel(primaryDimension.code)}
                </h2>
                <div className="text-gray-600 leading-relaxed">
                  <p className="mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                  </p>
                  <p className="mb-4">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.
                  </p>
                  <p>
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Test Results & Analysis */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Assessment Results
            </h2>

            {/* Top Dimensions */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Your Top Personality Types
              </h3>

              {/* Primary Dimension */}
              {primaryDimension.code && (
                <div className={`mb-4 p-4 rounded-lg border-2 ${getColorClass(primaryDimension.info.color)}`}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">
                      #1 {primaryDimension.info.name} ({primaryDimension.code})
                    </h4>
                    <span className="font-medium">
                      Score: {primaryDimension.score}
                    </span>
                  </div>
                  <p className="text-sm mb-2">
                    {primaryDimension.info.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {primaryDimension.info.traits.map(trait => (
                      <span key={trait} className="px-2 py-1 bg-white rounded text-xs">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Secondary Dimension */}
              {secondaryDimension.code && (
                <div className={`mb-4 p-4 rounded-lg border ${getColorClass(secondaryDimension.info.color)}`}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">
                      #2 {secondaryDimension.info.name} ({secondaryDimension.code})
                    </h4>
                    <span className="font-medium">
                      Score: {secondaryDimension.score}
                    </span>
                  </div>
                  <p className="text-sm mb-2">
                    {secondaryDimension.info.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {secondaryDimension.info.traits.map(trait => (
                      <span key={trait} className="px-2 py-1 bg-white rounded text-xs">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Complete Score Breakdown */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Complete Score Breakdown
              </h3>
              <div className="space-y-3">
                {allDimensions
                  .sort((a, b) => b.score - a.score)
                  .map((dimension) => (
                  <div key={dimension.code} className="flex items-center">
                    <div className="w-20 text-sm font-medium text-gray-700">
                      {dimension.code} - {dimension.info.name}
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-gray-200 rounded-full h-3 relative overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ease-out`}
                          style={{
                            width: `${(dimension.score / Math.max(...Object.values(scores))) * 100}%`,
                            backgroundColor: dimension.info.color === 'red' ? '#ef4444' :
                                           dimension.info.color === 'blue' ? '#3b82f6' :
                                           dimension.info.color === 'purple' ? '#8b5cf6' :
                                           dimension.info.color === 'green' ? '#10b981' :
                                           dimension.info.color === 'orange' ? '#f97316' :
                                           '#6b7280'
                          }}
                        ></div>
                        {/* Animated stripe overlay */}
                        <div
                          className="absolute inset-0 opacity-30"
                          style={{
                            width: `${(dimension.score / Math.max(...Object.values(scores))) * 100}%`,
                            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 8px)'
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-8 text-sm font-medium text-gray-700">
                      {dimension.score}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Recommendations */}
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                Recommended Course Areas
              </h3>
              <p className="text-green-700 mb-4">
                Based on your {primaryDimension.info?.name}-{secondaryDimension.info?.name} profile ({profile.combination}):
              </p>

              {courseRecommendations ? (
                <>
                  <div className="mb-4 p-3 bg-green-100 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-1">
                      {courseRecommendations.name}
                    </h4>
                    <p className="text-green-700 text-sm">
                      {courseRecommendations.description}
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {courseRecommendations.courses.map((course, index) => (
                      <div key={index} className="bg-white p-3 rounded-lg border">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold text-gray-800 text-sm">
                            {course.title}
                          </h5>
                          <span className={`px-2 py-1 rounded text-xs border ${getMatchStrengthColor(course.matchStrength)}`}>
                            {course.matchStrength}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {course.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">
                    No specific recommendations found for your combination.
                    Consider exploring courses related to your top dimensions: {primaryDimension.info?.name} and {secondaryDimension.info?.name}.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={onRetake}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Retake Assessment
          </button>
          <button
            onClick={onHome}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )

  // Helper function for RIASEC labels
  function getRiasecLabel(code) {
    const labels = {
      R: 'The Doer',
      I: 'The Thinker', 
      A: 'The Creator',
      S: 'The Helper',
      E: 'The Persuader',
      C: 'The Organizer'
    };
    return labels[code] || 'The Doer';
  }
}

export default Results
