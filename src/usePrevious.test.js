import usePrevious from './usePrevious';
import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('usePrevious', () => {
  it('should return undefined on first render', () => {
    const { result } = renderHook(() => usePrevious(10));
    expect(result.current).toBeUndefined();
  });

  it('should return previous value after update', () => {
    let value = 10;
    const { result, rerender } = renderHook(() => usePrevious(value));
    expect(result.current).toBeUndefined();

    value = 20;
    rerender();
    expect(result.current).toBe(10);

    value = 30;
    rerender();
    expect(result.current).toBe(20);
  });
});
