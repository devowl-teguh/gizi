import test from 'node:test';
import assert from 'node:assert/strict';
import { milestones, responseLabel, setForAge } from '../src/features/development/milestones.ts';

test('between milestone ages use the younger CDC checklist', () => {
  assert.equal(setForAge(2)?.age, 2);
  assert.equal(setForAge(20)?.age, 18);
  assert.equal(setForAge(24)?.age, 24);
  assert.equal(setForAge(71)?.age, 60);
  for (const age of [-1, 0, 1, 72, 2.5, NaN]) assert.equal(setForAge(age), null);
});
test('each supported stage has four examples and an authoritative age-specific source', () => {
  assert.deepEqual(milestones.map(s => s.age), [2,4,6,9,12,15,18,24,30,36,48,60]);
  assert.ok(milestones.every(s => s.questions.length === 4 && s.questions.every(Boolean) && s.slug));
});
test('answer labels do not turn uncertain and unanswered into negative results', () => {
  assert.equal(responseLabel('yes'), 'Sudah terlihat');
  assert.equal(responseLabel('not-yet'), 'Belum terlihat');
  assert.equal(responseLabel('unsure'), 'Belum yakin');
  assert.equal(responseLabel(undefined), 'Belum dijawab');
});
