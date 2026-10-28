import test from 'node:test'
import assert from 'node:assert/strict'
import { currentPrescription, prescriptionCandidates, workoutPrescriptions } from '../src/lib/prescriptions.js'

test('workoutPrescriptions preserves multiple prescriptions', () => {
  const items = workoutPrescriptions({ prescriptions: [{ id: 'a' }, { id: 'b' }] })
  assert.equal(items.length, 2)
})

test('workoutPrescriptions keeps legacy workouts compatible', () => {
  const items = workoutPrescriptions({ exercises: [{ id: 'x' }], scheduledDays: [1] })
  assert.equal(items.length, 1)
  assert.equal(items[0].exercises.length, 1)
})

test('currentPrescription prefers today pending prescription', () => {
  const workout = {
    id: 'w',
    prescriptions: [
      { id: 'a', scheduledDays: [1], status: 'Pendente' },
      { id: 'b', scheduledDays: [2], status: 'Pendente' },
    ],
  }
  const result = currentPrescription([workout], 2)
  assert.equal(result.prescription.id, 'b')
  assert.equal(prescriptionCandidates([workout]).length, 2)
})
