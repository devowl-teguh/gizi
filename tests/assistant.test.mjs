import test from 'node:test';
import assert from 'node:assert/strict';
import { assistantInputSchema, parseSources, parseAnswer, trustedUrl } from '../src/lib/ai/contracts.ts';
import { runAssistant } from '../src/lib/ai/nararouter.ts';
import { reserve } from '../src/lib/ai/limits.ts';

const input = { kind: 'stimulation', query: 'ide bermain', consent: true };
const source = { id: 1, title: 'Play', url: 'https://www.unicef.org/parenting', snippet: 'Play with a soft ball.' };
const answer = { summary: 'Ide bermain bersama.', ideas: [{ title: 'Bermain bola', materials: 'Bola lembut', steps: ['Gulirkan bola bersama.'], sourceIds: [1] }], cautions: ['Dampingi anak.'] };
process.env.NARAROUTER_API_KEY = 'test-not-a-real-key';
process.env.NARAROUTER_MODEL = 'test-model';
process.env.NARAROUTER_BASE_URL = 'https://router.bynara.id/v1';

test('requires explicit consent and rejects identity fields', () => {
  assert.equal(assistantInputSchema.safeParse({ ...input, consent: false }).success, false);
  assert.equal(assistantInputSchema.safeParse({ ...input, nickname: 'private' }).success, false);
  assert.equal(assistantInputSchema.safeParse({ ...input, birthDate: '2021-01-01' }).success, false);
  assert.equal(assistantInputSchema.safeParse({ ...input, ageMonths: -1 }).success, false);
});
test('filters untrusted, duplicate, and unsafe source URLs', () => {
  for (const url of ['http://unicef.org/a','https://unicef.org.evil.test/a','javascript:alert(1)','https://user:pass@unicef.org/a']) assert.equal(trustedUrl(url), null);
  assert.equal(parseSources({ results: [source, source, { ...source, url: 'https://evil.test' }] }).length, 1);
});
test('rejects fabricated citations and generated links', () => {
  assert.throws(() => parseAnswer(JSON.stringify({ ...answer, ideas: [{ ...answer.ideas[0], sourceIds: [99] }] }), [source]));
  assert.throws(() => parseAnswer(JSON.stringify({ ...answer, summary: 'https://evil.test' }), [source]));
  assert.deepEqual(parseAnswer(JSON.stringify(answer), [source]), answer);
});
test('empty search does not spend a model call', async () => {
  let calls = 0;
  const result = await runAssistant(assistantInputSchema.parse(input), new AbortController().signal, async () => {
    calls++; return Response.json({ result: { content: [{ type: 'text', text: '{"results":[]}' }] } });
  });
  assert.equal(result.status, 'empty'); assert.equal(calls, 1);
});
test('runs one search and one completion; only retrieved sources escape', async () => {
  const calls = [];
  const result = await runAssistant(assistantInputSchema.parse(input), new AbortController().signal, async (url, init) => {
    calls.push({ url, init });
    return calls.length === 1 ? Response.json({ result: { content: [{ type: 'text', text: JSON.stringify({ results: [source] }) }] } }) : Response.json({ choices: [{ finish_reason: 'stop', message: { content: JSON.stringify(answer) } }] });
  });
  assert.equal(calls.length, 2); assert.equal(result.status, 'ok'); assert.equal(result.sources[0].url, source.url);
  assert.equal('snippet' in result.sources[0], false);
  assert.equal(calls[0].init.cache, 'no-store'); assert.equal(calls[1].init.cache, 'no-store');
  assert.equal(JSON.parse(calls[1].init.body).max_tokens, 2200);
});
test('provider failures are sanitized and cancellation propagates', async () => {
  await assert.rejects(runAssistant(assistantInputSchema.parse(input), new AbortController().signal, async () => new Response('secret provider detail', { status: 401 })), error => error.status === 502 && !error.message.includes('secret'));
  const controller = new AbortController(); controller.abort();
  await assert.rejects(runAssistant(assistantInputSchema.parse(input), controller.signal, async (_url, init) => { init.signal.throwIfAborted(); }));
});
test('limits concurrent work and counts hourly attempts', () => {
  const now = Date.now(); const a=reserve(now), b=reserve(now);
  assert.ok(a); assert.ok(b); assert.equal(reserve(now),null);
  a(); a(); b();
  for(let i=0;i<10;i++){const release=reserve(now);assert.ok(release);release();}
  assert.equal(reserve(now),null); assert.ok(reserve(now+3600001));
});
test('recipes require age and do not search for babies below product age range', async () => {
  for(const ageMonths of [undefined, 4]) {
    let calls = 0;
    const result = await runAssistant(assistantInputSchema.parse({ ...input, kind: 'recipes', ageMonths }), new AbortController().signal, async () => { calls++; });
    assert.equal(result.status,'empty'); assert.equal(calls,0);
  }
});
