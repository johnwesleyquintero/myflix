import { run } from '../src/index.js';

describe('Core Module Tests', () => {
  test('Should initialize without errors', () => {
    expect(() => run()).not.toThrow();
  });
});
