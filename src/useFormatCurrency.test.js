import useNumberFormat from './useFormatCurrency';
import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('useNumberFormat', () => {
  it('should correctly format numbers, keeping one decimal place and insert commas', () => {
    const { result } = renderHook(() => useNumberFormat(1234.5, 1));
    expect(result.current).toBe('1,234.5');
  });

  it('should correctly format numbers without decimal places', () => {
    const { result } = renderHook(() => useNumberFormat(1000, 0));
    expect(result.current).toBe('1,000');
  });

  it('should correctly format numbers, and keep at least 1 decimal places', () => {
    const { result } = renderHook(() => useNumberFormat(1000, 1));
    expect(result.current).toBe('1,000.0');
  });
});
