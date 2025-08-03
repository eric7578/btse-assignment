import { cleanup } from '@testing-library/react';
import { enableMapSet } from 'immer';
import { afterEach, beforeAll } from 'vitest';

beforeAll(() => {
  enableMapSet();
});

afterEach(() => {
  cleanup();
});
