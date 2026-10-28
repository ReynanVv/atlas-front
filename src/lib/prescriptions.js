export function workoutPrescriptions(workout) {
  if (Array.isArray(workout?.prescriptions) && workout.prescriptions.length) return workout.prescriptions
  if (!workout) return []
  return [{
    id: '',
    name: 'Prescrição 1',
    notes: workout.notes || '',
    estimatedMinutes: workout.estimatedMinutes || 0,
    scheduledDays: workout.scheduledDays || [],
    exercises: workout.exercises || [],
    latestSession: workout.latestSession || null,
    status: workout.status || 'Pendente',
  }]
}

export function prescriptionCandidates(workouts = []) {
  return workouts.flatMap((workout) =>
    workoutPrescriptions(workout).map((prescription) => ({ workout, prescription }))
  )
}

export function currentPrescription(workouts = [], day = new Date().getDay()) {
  const all = prescriptionCandidates(workouts)
  return all.find(({ prescription }) =>
    (prescription.scheduledDays || []).includes(day) && prescription.status !== 'Realizado'
  ) || all.find(({ prescription }) => prescription.status === 'Pendente')
    || all[0]
    || null
}
