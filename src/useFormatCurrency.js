import { useMemo } from 'react';

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
