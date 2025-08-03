import { useMemo } from 'react';

// Format number with commas as thousands separators.
export default function useNumberFormat(value, fractionDigits) {
  return useMemo(() => {
    if (typeof value !== 'number' || isNaN(value)) {
      return '';
    }
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(value);
  }, [value, fractionDigits]);
}
