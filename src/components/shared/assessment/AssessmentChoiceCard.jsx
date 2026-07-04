import { ClickSpark } from '../ui'
import { SPARK_BY_RATING } from './assessmentClasses'

export const RATING_LABELS = {
  1: 'Just Okay',
  2: 'Great!',
  3: 'Love It!'
}

export const RATING_EMOJI = {
  1: '😐',
  2: '🙂',
  3: '😍'
}

const RATINGS = [1, 2, 3]

/**
 * Single A/B choice column for the assessment.
 * Motion classes live on the parent `.assessment-choices-grid`.
 */
const AssessmentChoiceCard = ({
  optionKey,
  title,
  imageSrc,
  isSelected,
  isDimmed,
  selectedRating,
  onRate,
  disabled = false
}) => (
  <div
    className={`questionnaire-card min-h-0 min-w-0 ${isDimmed ? 'opacity-50 saturate-50' : ''} ${
      isSelected ? 'selected' : ''
    }`}
  >
    <div className="questionnaire-image-frame">
      {imageSrc ? (
        <img src={imageSrc} alt="" className="questionnaire-asset-image" />
      ) : (
        <div className="questionnaire-placeholder" aria-hidden="true" />
      )}
    </div>

    <div className="questionnaire-card-footer">
      <h3 className="questionnaire-title line-clamp-2">{title}</h3>
      <div className="questionnaire-ratings">
        {RATINGS.map((rating) => {
          const isRatingSelected = isSelected && selectedRating === rating
          return (
            <ClickSpark
              key={`${optionKey}-${rating}`}
              {...SPARK_BY_RATING[rating]}
              className="assessment-rating-spark min-w-0 flex-1"
            >
              <button
                type="button"
                disabled={disabled}
                onClick={() => onRate(rating)}
                className={`questionnaire-rating-option w-full ${isRatingSelected ? 'selected' : ''}`}
                aria-pressed={isRatingSelected}
                aria-label={`${title}: ${RATING_LABELS[rating]}`}
              >
                <span className="questionnaire-rating-emoji" aria-hidden="true">
                  {RATING_EMOJI[rating]}
                </span>
                <span className="questionnaire-rating-text text-landing-muted">
                  {RATING_LABELS[rating]}
                </span>
              </button>
            </ClickSpark>
          )
        })}
      </div>
    </div>
  </div>
)

export default AssessmentChoiceCard
