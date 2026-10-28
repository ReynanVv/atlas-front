import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { normalizeFeedback } from '../lib/feedback.js'

const FeedbackContext = createContext(null)

function feedbackId() {
  return globalThis.crypto?.randomUUID?.() || `feedback-${Date.now()}-${Math.random()}`
}

function FeedbackItem({ item, onDismiss }) {
  useEffect(() => {
    if (!item.duration) return undefined
    const timer = window.setTimeout(() => onDismiss(item.id), item.duration)
    return () => window.clearTimeout(timer)
  }, [item.id, item.duration, onDismiss])

  return <div
    className={`system-feedback system-feedback-${item.kind}`}
    role={item.kind === 'error' ? 'alert' : 'status'}
    aria-live={item.kind === 'error' ? 'assertive' : 'polite'}
  >
    <span className="system-feedback-mark" aria-hidden="true">
      {item.kind === 'success' ? '✓' : item.kind === 'info' ? 'i' : '!'}
    </span>
    <div className="system-feedback-copy">
      <strong>{item.title}</strong>
      {item.message && <span>{item.message}</span>}
    </div>
    <button className="system-feedback-close" onClick={() => onDismiss(item.id)} aria-label="Fechar aviso">×</button>
  </div>
}

export function FeedbackProvider({ children }) {
  const [items, setItems] = useState([])

  const dismiss = useCallback((id) => {
    setItems(current => current.filter(item => item.id !== id))
  }, [])

  const notify = useCallback((input) => {
    const normalized = normalizeFeedback(input)
    const item = { ...normalized, id: feedbackId(), createdAt: Date.now() }

    setItems(current => {
      const withoutDuplicate = normalized.key
        ? current.filter(existing => existing.key !== normalized.key)
        : current
      return [...withoutDuplicate, item].slice(-3)
    })

    return item.id
  }, [])

  const value = useMemo(() => ({
    notify,
    dismiss,
    success: (title, message = '', options = {}) => notify({ ...options, kind: 'success', title, message }),
    error: (title, message = '', options = {}) => notify({ ...options, kind: 'error', title, message }),
    info: (title, message = '', options = {}) => notify({ ...options, kind: 'info', title, message }),
    warning: (title, message = '', options = {}) => notify({ ...options, kind: 'warning', title, message }),
  }), [notify, dismiss])

  return <FeedbackContext.Provider value={value}>
    {children}
    <div className="system-feedback-viewport" aria-label="Status do sistema">
      {items.map(item => <FeedbackItem key={item.id} item={item} onDismiss={dismiss}/>)}
    </div>
  </FeedbackContext.Provider>
}

export function useFeedback() {
  const value = useContext(FeedbackContext)
  if (!value) throw new Error('useFeedback deve ser usado dentro de FeedbackProvider.')
  return value
}
