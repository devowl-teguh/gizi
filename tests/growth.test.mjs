import test from 'node:test';
import assert from 'node:assert/strict';
import { ageInDays, valueAtZ, weightZScore, zDescription } from '../src/features/growth/calculations.ts';

const near = (actual, expected, tolerance = 0.001) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);

test('age is counted in UTC days and rejects invalid or out-of-range dates', () => {
  assert.equal(ageInDays('2024-02-28', '2024-03-01'), 2);
  assert.equal(ageInDays('2024-01-01', '2023-12-31'), null);
  assert.equal(ageInDays('2024-02-30', '2024-03-01'), null);
  assert.equal(ageInDays('2020-01-01', '2025-02-01'), null);
  assert.equal(ageInDays('2020-01-01', '2025-01-30'), 1856);
});

test('daily parameters reproduce independently published WHO reference values', () => {
  near(valueAtZ(0, 'female', 0), 3.2322, .00001);
  near(valueAtZ(0, 'male', -2), 2.459, .001);
  near(valueAtZ(365, 'female', -2), 7.041, .001);
  near(valueAtZ(365, 'male', 2), 11.983, .001);
  near(valueAtZ(1856, 'female', 3), 29.903, .001);
  near(weightZScore(365, 'male', 9.646), 0, .00001);
});

test('restricted LMS correction applies beyond 3 SD and labels use unrounded scores', () => {
  for (const sex of ['male', 'female']) {
    const lo2 = valueAtZ(365, sex, -2), lo3 = valueAtZ(365, sex, -3);
    const hi2 = valueAtZ(365, sex, 2), hi3 = valueAtZ(365, sex, 3);
    near(weightZScore(365, sex, lo3 - (lo2 - lo3)), -4, .000001);
    near(weightZScore(365, sex, hi3 + (hi3 - hi2)), 4, .000001);
  }
  assert.equal(zDescription(-3), 'Di antara garis -3 dan -2 SD');
  assert.equal(zDescription(-2), 'Di antara garis -2 dan +2 SD');
  assert.equal(zDescription(2), 'Di antara garis -2 dan +2 SD');
  assert.equal(zDescription(2.01), 'Di atas garis +2 SD');
  assert.throws(() => weightZScore(1857, 'male', 10));
  assert.throws(() => weightZScore(0, 'male', 0));
});

test('WHO daily length/height tables and position conversion match reference boundaries', async () => {
  const { adjustedHeight, heightValueAtZ, heightZScore } = await import('../src/features/growth/calculations.ts');
  near(heightValueAtZ(0, 'female', 0), 49.1477, .00001);
  near(heightValueAtZ(365, 'male', -2), 70.987, .001);
  near(heightValueAtZ(730, 'female', 0), 86.4008, .00001);
  near(heightValueAtZ(731, 'female', 0), 85.7299, .00001);
  near(heightValueAtZ(1856, 'male', 2), 119.836, .001);
  near(heightZScore(365, 'female', 74.0049), 0, .00001);
  near(adjustedHeight(730, 80, 'standing'), 80.7, .00001);
  near(adjustedHeight(730, 80, 'lying'), 80, .00001);
  near(adjustedHeight(731, 80, 'lying'), 79.3, .00001);
  near(adjustedHeight(731, 80, 'standing'), 80, .00001);
  assert.throws(() => adjustedHeight(1857, 80, 'standing'));
});
