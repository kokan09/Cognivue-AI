import React, { useState } from 'react'

function ModuleMcqQuiz({ questions }) {
  const [userAnswers, setUserAnswers] = useState({})
  const [submitted, setSubmitted] = useState({})

  const handleSelectOption = (questionId, optionIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }))
  }

  const handleSubmitQuestion = (questionId) => {
    setSubmitted(prev => ({
      ...prev,
      [questionId]: true
    }))
  }

  if (!questions || questions.length === 0) return null

  return (
    <div className="mcq-quiz-container">
      <div className="mcq-quiz-header">
        <h4>Knowledge Check & Concept Assessment</h4>
        <span className="mcq-quiz-count">{questions.length} Question{questions.length > 1 ? 's' : ''}</span>
      </div>

      <div className="mcq-questions-list">
        {questions.map((q, qIndex) => {
          const selectedOption = userAnswers[q.id]
          const isSubmitted = submitted[q.id]
          const isCorrect = isSubmitted && selectedOption === q.correctIndex

          return (
            <div key={q.id} className="mcq-question-card">
              <p className="mcq-question-text">
                <span className="mcq-q-num">Q{qIndex + 1}.</span> {q.question}
              </p>

              <div className="mcq-options-grid">
                {q.options.map((opt, optIndex) => {
                  let optionClass = 'mcq-option-btn'
                  if (selectedOption === optIndex) optionClass += ' selected'
                  if (isSubmitted) {
                    if (optIndex === q.correctIndex) optionClass += ' correct'
                    else if (selectedOption === optIndex) optionClass += ' incorrect'
                  }

                  return (
                    <button
                      key={optIndex}
                      type="button"
                      className={optionClass}
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(q.id, optIndex)}
                    >
                      <span className="opt-letter">
                        {String.fromCharCode(65 + optIndex)}
                      </span>
                      <span className="opt-text">{opt}</span>
                      {isSubmitted && optIndex === q.correctIndex && (
                        <span className="opt-status-icon">✓</span>
                      )}
                      {isSubmitted && selectedOption === optIndex && optIndex !== q.correctIndex && (
                        <span className="opt-status-icon">✕</span>
                      )}
                    </button>
                  )
                })}
              </div>

              {!isSubmitted && selectedOption !== undefined && (
                <button
                  type="button"
                  className="button button-small mcq-check-btn"
                  onClick={() => handleSubmitQuestion(q.id)}
                >
                  Check Answer
                </button>
              )}

              {isSubmitted && (
                <div className={`mcq-feedback-box ${isCorrect ? 'correct-feedback' : 'incorrect-feedback'}`}>
                  <strong>{isCorrect ? '🎉 Correct!' : '❌ Incorrect'}</strong>
                  <p>{q.explanation}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ModuleMcqQuiz
