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

      {/* Features Section */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="card-youth bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200 hover:shadow-youth-hover animate-slide-in-left" style={{ animationDelay: '200ms' }}>
          <div className="text-4xl mb-4 animate-bounce">⚡</div>
          <h3 className="font-heading font-bold text-primary-700 mb-3 text-lg">Quick & Easy</h3>
          <p className="text-primary-600 font-primary">Complete in under 15 minutes</p>
        </div>
        
        <div className="card-youth bg-gradient-to-br from-accent-green-50 to-accent-green-100 border-accent-green-200 hover:shadow-youth-hover animate-slide-in-left" style={{ animationDelay: '400ms' }}>
          <div className="text-4xl mb-4 animate-bounce" style={{ animationDelay: '200ms' }}>🎯</div>
          <h3 className="font-heading font-bold text-accent-green-700 mb-3 text-lg">Personalized</h3>
          <p className="text-accent-green-600 font-primary">Get tailored course recommendations</p>
        </div>
        
        <div className="card-youth bg-gradient-to-br from-secondary-50 to-secondary-100 border-secondary-200 hover:shadow-youth-hover animate-slide-in-left sm:col-span-2 lg:col-span-1" style={{ animationDelay: '600ms' }}>
          <div className="text-4xl mb-4 animate-bounce" style={{ animationDelay: '400ms' }}>🔒</div>
          <h3 className="font-heading font-bold text-secondary-700 mb-3 text-lg">Anonymous</h3>
          <p className="text-secondary-600 font-primary">No account required</p>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mb-12 animate-bounce-in" style={{ animationDelay: '800ms' }}>
        <button
          onClick={onStartQuestionnaire}
          className="btn-primary text-xl px-12 py-6 shadow-youth-hover animate-pulse hover:animate-none relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center gap-3">
            🚀 Start Your Journey
          </span>
          {/* Hover effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent-orange-400 to-accent-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
        <p className="text-sm text-neutral-500 mt-3 font-primary">
          Join thousands of Filipino students who found their path! 🇵🇭
        </p>
      </div>
      
      {/* RIASEC Preview Section */}
      <div className="card-youth bg-gradient-to-br from-neutral-50 to-neutral-100">
        <h2 className="text-title font-heading text-gradient-warm mb-6 animate-slide-in-right">
          Discover Your RIASEC Type! 🌟
        </h2>
        <p className="text-neutral-600 mb-8 font-primary max-w-2xl mx-auto">
          Our assessment is based on the scientifically-proven RIASEC model that matches your interests with career paths.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="text-center animate-fade-in" style={{ animationDelay: '1000ms' }}>
            <IllustrationCard
              riasecCode="R"
              optionText="Realistic"
              size="sm"
              variant="warm"
              showLabel={false}
              className="mx-auto mb-2"
            />
            <h4 className="font-heading font-semibold text-neutral-700 text-sm">Realistic</h4>
            <p className="text-xs text-neutral-500 font-primary">Hands-on work</p>
          </div>
          
          <div className="text-center animate-fade-in" style={{ animationDelay: '1100ms' }}>
            <IllustrationCard
              riasecCode="I"
              optionText="Investigative"
              size="sm"
              variant="primary"
              showLabel={false}
              className="mx-auto mb-2"
            />
            <h4 className="font-heading font-semibold text-neutral-700 text-sm">Investigative</h4>
            <p className="text-xs text-neutral-500 font-primary">Research & analysis</p>
          </div>
          
          <div className="text-center animate-fade-in" style={{ animationDelay: '1200ms' }}>
            <IllustrationCard
              riasecCode="A"
              optionText="Artistic"
              size="sm"
              variant="secondary"
              showLabel={false}
              className="mx-auto mb-2"
            />
            <h4 className="font-heading font-semibold text-neutral-700 text-sm">Artistic</h4>
            <p className="text-xs text-neutral-500 font-primary">Creative expression</p>
          </div>
          
          <div className="text-center animate-fade-in" style={{ animationDelay: '1300ms' }}>
            <IllustrationCard
              riasecCode="S"
              optionText="Social"
              size="sm"
              variant="success"
              showLabel={false}
              className="mx-auto mb-2"
            />
            <h4 className="font-heading font-semibold text-neutral-700 text-sm">Social</h4>
            <p className="text-xs text-neutral-500 font-primary">Helping others</p>
          </div>
          
          <div className="text-center animate-fade-in" style={{ animationDelay: '1400ms' }}>
            <IllustrationCard
              riasecCode="E"
              optionText="Enterprising"
              size="sm"
              variant="warm"
              showLabel={false}
              className="mx-auto mb-2"
            />
            <h4 className="font-heading font-semibold text-neutral-700 text-sm">Enterprising</h4>
            <p className="text-xs text-neutral-500 font-primary">Leadership</p>
          </div>
          
          <div className="text-center animate-fade-in" style={{ animationDelay: '1500ms' }}>
            <IllustrationCard
              riasecCode="C"
              optionText="Conventional"
              size="sm"
              variant="primary"
              showLabel={false}
              className="mx-auto mb-2"
            />
            <h4 className="font-heading font-semibold text-neutral-700 text-sm">Conventional</h4>
            <p className="text-xs text-neutral-500 font-primary">Organization</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-accent-yellow-100 to-accent-orange-100 rounded-youth p-6 border-2 border-accent-yellow-300 animate-pulse-gentle">
          <p className="text-accent-orange-700 font-primary text-sm leading-relaxed">
            <strong className="font-heading">🎓 Filipino Focus:</strong> Our recommendations include top Philippine universities, 
            scholarship programs, and career opportunities specifically relevant to the Filipino job market!
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomePage
