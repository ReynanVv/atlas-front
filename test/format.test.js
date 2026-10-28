import test from 'node:test'
import assert from 'node:assert/strict'
import { initialsOf } from '../src/lib/format.js'

test('initialsOf handles empty names', () => {
  assert.equal(initialsOf(''), '?')
  assert.equal(initialsOf('   '), '?')
})

test('initialsOf uses up to two letters for one name', () => {
  assert.equal(initialsOf('Ana'), 'AN')
})

test('initialsOf uses first and last names', () => {
  assert.equal(initialsOf('Reynan Vieira Tavares'), 'RT')
})
