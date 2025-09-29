import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Setup server con handlers
export const server = setupServer(...handlers);
