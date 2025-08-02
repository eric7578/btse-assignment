import useNumberFormat from './useFormatCurrency';
import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('useNumberFormat', () => {
  it('正確格式化數字,保留一位小數,並補上逗點', () => {
    const { result } = renderHook(() => useNumberFormat(1234.5, 1));
    expect(result.current).toBe('1,234.5');
  });

  it('正確格式化數字,不預留小數點後數字', () => {
    const { result } = renderHook(() => useNumberFormat(1000, 0));
    expect(result.current).toBe('1,000');
  });

  it('正確格式化數字,預留小數點後數字', () => {
    const { result } = renderHook(() => useNumberFormat(1000, 1));
    expect(result.current).toBe('1,000.0');
  });
});
