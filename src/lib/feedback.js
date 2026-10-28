export const FEEDBACK_KINDS = Object.freeze(['success', 'error', 'info', 'warning'])

export const FEEDBACK_DURATION = Object.freeze({
  success: 3200,
  info: 3200,
  warning: 4600,
  error: 5600,
})

export function normalizeFeedback(input = {}) {
  const kind = FEEDBACK_KINDS.includes(input.kind) ? input.kind : 'info'
  const title = String(input.title || '').trim()
  if (!title) throw new Error('Feedback precisa de um título.')

  return {
    kind,
    title,
    message: String(input.message || '').trim(),
    key: input.key ? String(input.key) : '',
    duration: input.duration === 0
      ? 0
      : Math.max(1200, Number(input.duration) || FEEDBACK_DURATION[kind]),
  }
}
