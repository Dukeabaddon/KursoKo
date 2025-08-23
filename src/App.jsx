import { useState } from 'react'
import Navbar from './components/Navbar'
import HomePage from './components/HomePage'
import Questionnaire from './components/Questionnaire'
import Results from './components/Results'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [responses, setResponses] = useState([])
  const [questionnaireProgress, setQuestionnaireProgress] = useState({ current: 0, total: 0 })
  const [results, setResults] = useState(null)

  const navigateTo = (page) => {
    setCurrentPage(page)
  }

  const startQuestionnaire = () => {
    setResponses([])
    setResults(null)
    setCurrentPage('questionnaire')
  }

  const completeQuestionnaire = (questionnaireResponses) => {
    setResponses(questionnaireResponses)
    // Calculate results here (will implement in next step)
    setCurrentPage('results')
  }

  const goHome = () => {
    setCurrentPage('home')
    setResponses([])
    setResults(null)
  }

  return (
    <div className="min-h-screen flex flex-col safe-area-padding">
      <Navbar
        onHomeClick={goHome}
        currentQuestion={questionnaireProgress.current}
        totalQuestions={questionnaireProgress.total}
        showProgress={currentPage === 'questionnaire'}
      />

      <main className="flex-1 mobile-spacing" style={{ marginTop: '75px' }}>
        <div className="mobile-spacing">
          {currentPage === 'home' && (
            <HomePage onStartQuestionnaire={startQuestionnaire} />
          )}

          {currentPage === 'questionnaire' && (
            <Questionnaire
              onComplete={completeQuestionnaire}
              onBack={goHome}
              onProgressUpdate={setQuestionnaireProgress}
            />
          )}

          {currentPage === 'results' && (
            <Results
              responses={responses}
              onRetake={startQuestionnaire}
              onHome={goHome}
            />
          )}
        </div>
      </main>

      <footer className="bg-gradient-to-r from-primary-800 via-secondary-800 to-primary-800 text-white py-8 mt-16 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-5 animate-shimmer"></div>

        <div className="container-youth relative z-10">
          <div className="grid-mobile-stack text-center lg:text-left">
            <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <h3 className="font-heading font-bold text-accent-yellow-200 mb-3 text-lg">KursoKo Assessment 🎓</h3>
              <p className="text-primary-100 text-sm font-primary leading-relaxed">
                Helping Filipino students discover their ideal career path through scientifically-designed RIASEC personality assessment
              </p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <h3 className="font-heading font-bold text-accent-yellow-200 mb-3 text-lg">About RIASEC 📊</h3>
              <p className="text-primary-100 text-sm font-primary leading-relaxed">
                Based on Holland's theory of career choice and personality types, validated for Filipino students
              </p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
              <h3 className="font-heading font-bold text-accent-yellow-200 mb-3 text-lg">Get Started 🚀</h3>
              <p className="text-primary-100 text-sm font-primary leading-relaxed">
                Take our free 30-question assessment and discover your perfect career match with scholarship opportunities
              </p>
            </div>
          </div>
          <div className="border-t border-primary-700 mt-8 pt-6 text-center">
            <p className="text-primary-200 text-sm font-primary">
              © 2024 KursoKo Career Assessment System. Made with ❤️ for Filipino Youth. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
