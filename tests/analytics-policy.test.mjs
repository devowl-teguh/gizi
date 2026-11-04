import test from 'node:test';
import assert from 'node:assert/strict';
import { filterAnalyticsEvent } from '../src/features/analytics/analytics-policy.ts';

test('homepage page views omit query parameters and fragments', () => {
  assert.deepEqual(filterAnalyticsEvent({ type: 'pageview', url: 'https://example.com/?name=private#child' }), { type: 'pageview', url: 'https://example.com/' });
});

test('drops events and unreviewed routes that could contain personal data', () => {
  assert.equal(filterAnalyticsEvent({ type: 'event', url: 'https://example.com/' }), null);
  assert.equal(filterAnalyticsEvent({ type: 'pageview', url: 'https://example.com/child/private' }), null);
  assert.equal(filterAnalyticsEvent({ type: 'pageview', url: 'javascript:alert(1)' }), null);
  assert.equal(filterAnalyticsEvent({ type: 'pageview', url: 'not-a-url' }), null);
});
