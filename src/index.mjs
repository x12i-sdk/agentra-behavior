import assert from 'node:assert/strict';
import { InMemoryEventStore, saveEvent } from '@x12i/agentra-events';
const scope = { tenantId: 'fixture-tenant', accountId: 'fixture-account', environment: 'dev' };
const events = [1, 2].map(index => ({ scope, event: { id: 'event-' + index, type: 'report.generated', createdAt: new Date().toISOString() },
  actor: { id: 'fixture-user', type: 'user' }, product: { app: 'example', feature: 'reports' }, classification: { status: 'success' },
}));
const store = new InMemoryEventStore();
for (const event of events) await saveEvent(store, event);
import { AgentraBehaviorEngine } from '@x12i/agentra-behavior';
const behavior = new AgentraBehaviorEngine({ store });
const profile = await behavior.getUserProfile(scope, 'fixture-user');
assert.equal(profile.totalEvents, 2);
assert.deepEqual(profile.topFeatures[0], { feature: 'reports', count: 2 });
assert.equal((await behavior.getUserProfile(scope, 'unknown-user')).totalEvents, 0);
console.log(profile);
