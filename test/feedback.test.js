import test from 'node:test'
import assert from 'node:assert/strict'
import { FEEDBACK_DURATION, normalizeFeedback } from '../src/lib/feedback.js'

test('normalizeFeedback applies semantic defaults', () => {
  const result = normalizeFeedback({ kind: 'success', title: 'Treino salvo' })
  assert.equal(result.kind, 'success')
  assert.equal(result.duration, FEEDBACK_DURATION.success)
})

test('normalizeFeedback falls back to info for unknown kinds', () => {
  const result = normalizeFeedback({ kind: 'unknown', title: 'Atualizado' })
  assert.equal(result.kind, 'info')
})

test('normalizeFeedback supports persistent acknowledgement', () => {
  const result = normalizeFeedback({ kind: 'warning', title: 'Atenção', duration: 0 })
  assert.equal(result.duration, 0)
})

test('normalizeFeedback requires a useful title', () => {
  assert.throws(() => normalizeFeedback({ kind: 'success' }), /título/)
})
