import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Node-side MSW server used across the test suite (started in tests/setup.ts).
export const server = setupServer(...handlers);
