import { useState } from 'react'

function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
      <button 
        type="button" 
        className="faq-question" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <span className="faq-toggle-icon">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && <div className="faq-answer"><p>{answer}</p></div>}
    </div>
  )
}

export default FaqItem