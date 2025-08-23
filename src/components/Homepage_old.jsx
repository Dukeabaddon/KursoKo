import IllustrationCard from './IllustrationCard'

function HomePage({ onStartQuestionnaire }) {
  return (
    <div className="container-youth text-center animate-fade-in">
      {/* Hero Section */}
      <div className="card-youth mb-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-pink-50 opacity-50"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent-yellow-200 to-transparent rounded-full opacity-30 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent-green-200 to-transparent rounded-full opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10">
          <h1 className="text-hero font-heading text-gradient-primary mb-4 animate-bounce-in">
            Welcome to KursoKo! 🎓
          </h1>
          <p className="text-subtitle text-neutral-600 mb-6 font-primary animate-slide-in-left">
            Career Assessment & Guidance System for Filipino Youth
          </p>
          <p className="text-base sm:text-lg text-neutral-700 mb-8 leading-relaxed max-w-3xl mx-auto font-primary animate-slide-in-right">
            Discover your ideal career path through our scientifically-designed RIASEC assessment.
            Answer 30 questions to uncover your personality type and get personalized course recommendations
            plus scholarship opportunities for your college journey! 🚀
          </p>
        </div>
      </div>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-blue-50 p-4 sm:p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-md">
            <div className="text-2xl sm:text-3xl mb-2">⚡</div>
            <h3 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">Quick & Easy</h3>
            <p className="text-blue-600 text-sm">Complete in under 15 minutes</p>
          </div>
          <div className="bg-green-50 p-4 sm:p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-md">
            <div className="text-2xl sm:text-3xl mb-2">🎯</div>
            <h3 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">Personalized</h3>
            <p className="text-green-600 text-sm">Get tailored course recommendations</p>
          </div>
          <div className="bg-purple-50 p-4 sm:p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-md sm:col-span-2 md:col-span-1">
            <div className="text-2xl sm:text-3xl mb-2">🔒</div>
            <h3 className="font-semibold text-purple-800 mb-2 text-sm sm:text-base">Anonymous</h3>
            <p className="text-purple-600 text-sm">No account required</p>
          </div>
        </div>
        
        <button
          onClick={onStartQuestionnaire}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 animate-pulse hover:animate-none min-h-[48px]"
        >
          <span className="flex items-center gap-2">
            🚀 Start Assessment
          </span>
        </button>
      </div>
      
      <div className="bg-gray-100 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          What is RIASEC?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
          <div className="bg-white p-4 rounded">
            <h4 className="font-semibold text-red-600">Realistic (R)</h4>
            <p className="text-sm text-gray-600">Hands-on, practical work</p>
          </div>
          <div className="bg-white p-4 rounded">
            <h4 className="font-semibold text-blue-600">Investigative (I)</h4>
            <p className="text-sm text-gray-600">Research and analysis</p>
          </div>
          <div className="bg-white p-4 rounded">
            <h4 className="font-semibold text-purple-600">Artistic (A)</h4>
            <p className="text-sm text-gray-600">Creative expression</p>
          </div>
          <div className="bg-white p-4 rounded">
            <h4 className="font-semibold text-green-600">Social (S)</h4>
            <p className="text-sm text-gray-600">Helping and teaching</p>
          </div>
          <div className="bg-white p-4 rounded">
            <h4 className="font-semibold text-orange-600">Enterprising (E)</h4>
            <p className="text-sm text-gray-600">Leadership and business</p>
          </div>
          <div className="bg-white p-4 rounded">
            <h4 className="font-semibold text-gray-600">Conventional (C)</h4>
            <p className="text-sm text-gray-600">Organization and data</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
