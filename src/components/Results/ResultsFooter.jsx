import { Home, RotateCcw, Share2 } from 'lucide-react'
import { ClickSpark } from '../shared/ui'
import { SPARK_ACCENT, SPARK_PURPLE } from '../shared/assessment/assessmentClasses'
import { resultsGhostBtn, resultsPrimaryBtn } from './resultsClasses'

const ResultsFooter = ({ onHome, onRetake, onShareResult }) => (
  <footer className="results-footer mt-8 flex flex-col items-stretch gap-3 border-t border-landing-ink/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
    <ClickSpark {...SPARK_ACCENT} className="inline-flex">
      <button type="button" onClick={onHome} className={resultsGhostBtn}>
        <Home className="h-4 w-4" aria-hidden="true" />
        Back to home
      </button>
    </ClickSpark>

    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <ClickSpark {...SPARK_ACCENT} className="inline-flex">
        <button type="button" onClick={onShareResult} className={resultsGhostBtn}>
          <Share2 className="h-4 w-4" aria-hidden="true" />
          Share result
        </button>
      </ClickSpark>
      <ClickSpark {...SPARK_PURPLE} className="inline-flex">
        <button type="button" onClick={onRetake} className={resultsPrimaryBtn}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Retake assessment
        </button>
      </ClickSpark>
    </div>
  </footer>
)

export default ResultsFooter
