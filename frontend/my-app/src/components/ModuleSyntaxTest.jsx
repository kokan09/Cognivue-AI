import React, { useState } from 'react'

function ModuleSyntaxTest({ testData }) {
  const [selectedOption, setSelectedOption] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [showHints, setShowHints] = useState(false)

  if (!testData) return null

  const {
    challengeType,
    instruction,
    buggyCode,
    correctSolution,
    hints,
    quizPrompt,
    quizOptions,
    correctOptionIndex,
    quizExplanation
  } = testData

  const handleOptionSelect = (idx) => {
    setSelectedOption(idx)
    setIsSubmitted(true)
  }

  const isCorrect = isSubmitted && selectedOption === correctOptionIndex

  return (
    <div className="syntax-test-container">
      <div className="syntax-test-header">
        <span className="test-badge">Technical Assessment</span>
        <h4>{challengeType || 'Syntax Verification & Logic Test'}</h4>
      </div>

      {instruction && (
        <div className="test-instruction-box">
          <span className="instruction-icon" aria-hidden="true">💡</span>
          <p>{instruction}</p>
        </div>
      )}

      {buggyCode && (
        <div className="test-code-comparison">
          <div className="test-code-block buggy">
            <div className="code-block-header">
              <span>Inspect Code Snippet</span>
              <span className="code-status-pill warning">Challenge</span>
            </div>
            <pre><code>{buggyCode}</code></pre>
          </div>

          {showSolution && correctSolution && (
            <div className="test-code-block solved">
              <div className="code-block-header">
                <span>Verified Correct Solution</span>
                <span className="code-status-pill success">Verified</span>
              </div>
              <pre><code>{correctSolution}</code></pre>
            </div>
          )}
        </div>
      )}

      {/* Action Controls for Hints & Solution */}
      <div className="test-actions-row">
        {hints && hints.length > 0 && (
          <button
            type="button"
            className="button button-small button-secondary hint-toggle-btn"
            onClick={() => setShowHints(!showHints)}
          >
            {showHints ? 'Hide Hints' : '💡 Show Hints'}
          </button>
        )}

        {correctSolution && (
          <button
            type="button"
            className="button button-small button-secondary solution-toggle-btn"
            onClick={() => setShowSolution(!showSolution)}
          >
            {showSolution ? 'Hide Solution' : '👁️ Reveal Solution'}
          </button>
        )}
      </div>

      {showHints && hints && (
        <div className="hints-callout">
          <strong>Key Hints:</strong>
          <ul>
            {hints.map((hint, i) => (
              <li key={i}>{hint}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Verification Quiz */}
      {quizPrompt && quizOptions && (
        <div className="test-verification-section">
          <p className="verification-prompt">
            <strong>Verification Question:</strong> {quizPrompt}
          </p>

          <div className="mcq-options-grid">
            {quizOptions.map((opt, idx) => {
              let btnClass = 'mcq-option-btn'
              if (selectedOption === idx) btnClass += ' selected'
              if (isSubmitted) {
                if (idx === correctOptionIndex) btnClass += ' correct'
                else if (selectedOption === idx) btnClass += ' incorrect'
              }

              return (
                <button
                  key={idx}
                  type="button"
                  className={btnClass}
                  onClick={() => handleOptionSelect(idx)}
                >
                  <span className="opt-letter">{String.fromCharCode(65 + idx)}</span>
                  <span className="opt-text">{opt}</span>
                  {isSubmitted && idx === correctOptionIndex && (
                    <span className="opt-status-icon">✓</span>
                  )}
                  {isSubmitted && selectedOption === idx && idx !== correctOptionIndex && (
                    <span className="opt-status-icon">✕</span>
                  )}
                </button>
              )
            })}
          </div>

          {isSubmitted && (
            <div className={`mcq-feedback-box ${isCorrect ? 'correct-feedback' : 'incorrect-feedback'}`}>
              <strong>{isCorrect ? '🎉 Challenge Passed!' : '❌ Incorrect Selection'}</strong>
              <p>{quizExplanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ModuleSyntaxTest
