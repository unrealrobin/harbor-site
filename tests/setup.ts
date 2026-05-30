import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './mocks/server';

// Start the MSW mock server once, reset handlers between tests so per-test
// overrides don't leak, and tear it down at the end. `error` on unhandled
// requests catches any accidental real network call in a test.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
