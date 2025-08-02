import usePrevious from './usePrevious';
import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('usePrevious', () => {
  it('初次render時應返回undefined', () => {
    const { result } = renderHook(() => usePrevious(10));
    expect(result.current).toBeUndefined();
  });

  it('更新後應返回前一個值', () => {
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
