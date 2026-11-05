import test from 'node:test';
import assert from 'node:assert/strict';
import { validBirthDate, vaccineSchedule, vaccineStatusLabel } from '../src/features/vaccines/schedule.ts';

test('Kemenkes 2025 routine infant doses and regional JE match the stated age groups', () => {
  const expected = {
    'Kurang dari 24 jam': ['hb0'], 'Kurang dari 1 bulan': ['bcg','opv1'],
    '2 bulan': ['dpt1','opv2','pcv1','rv1'], '3 bulan': ['dpt2','opv3','pcv2','rv2'],
    '4 bulan': ['dpt3','opv4','ipv1','rv3'], '9 bulan': ['mr1','ipv2'],
    '10 bulan': ['je'], '12 bulan': ['pcv3'], '18 bulan': ['mr2','dpt4'],
  };
  assert.deepEqual(Object.fromEntries(vaccineSchedule.map(g => [g.age, g.items.map(i => i.id)])), expected);
  assert.match(vaccineSchedule.find(g => g.age === '10 bulan').items[0].name, /endemis/);
  const ids = vaccineSchedule.flatMap(g => g.items.map(i => i.id));
  assert.equal(new Set(ids).size, ids.length);
});
test('unanswered and missing record are distinct from vaccination status', () => {
  assert.equal(vaccineStatusLabel(undefined), 'Belum diisi');
  assert.equal(vaccineStatusLabel('not-recorded'), 'Tidak ditemukan di catatan');
  assert.equal(vaccineStatusLabel('unsure'), 'Belum yakin');
});
test('birth date is optional, real, and not in the future', () => {
  assert.equal(validBirthDate('', '2026-11-05'), true);
  assert.equal(validBirthDate('2024-02-29', '2026-11-05'), true);
  assert.equal(validBirthDate('2025-02-29', '2026-11-05'), false);
  assert.equal(validBirthDate('2026-11-06', '2026-11-05'), false);
});
