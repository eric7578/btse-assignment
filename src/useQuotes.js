import { useCallback, useMemo, useReducer, useRef } from 'react';

export default function useQuotes(descTotal, numQuotes) {
  const [priceSizes, dispatch] = useReducer(quotesReducer, new Map());

  const snapshot = useCallback(
    quotes => {
      dispatch({
        type: 'snapshot',
        quotes,
      });
    },
    [dispatch],
  );

  const delta = useCallback(
    quotes => {
      dispatch({
        type: 'delta',
        quotes,
      });
    },
    [dispatch],
  );

  const currentPrices = useRef(new Set());
  const quotes = useMemo(() => {
    const totalSizes = Array.from(priceSizes.values()).reduce((a, b) => a + b, 0);
    const quotes = Array.from(priceSizes.entries())
      .slice(0, numQuotes)
      .map(([price, size]) => ({
        price,
        size,
        isNew: currentPrices.current.size > 0 ? !currentPrices.current.has(price) : false,
      }));

    // Calculate total for quotes
    if (descTotal) {
      const last = quotes.length - 1;
      for (let i = last; i >= 0; i--) {
        const q = quotes[i];
        q.total = i === last ? q.size : quotes[i + 1].total + q.size;
        q.totalPercent = q.total / totalSizes;
      }
    } else {
      quotes.forEach((q, i) => {
        q.total = i > 0 ? quotes[i - 1].total + q.size : q.size;
        q.totalPercent = q.total / totalSizes;
      });
    }

    // Update currentPrices to reflect the latest prices
    currentPrices.current = new Set(priceSizes.keys());

    return quotes;
  }, [priceSizes, numQuotes, descTotal]);

  return [quotes, snapshot, delta];
}

function quotesReducer(priceSizes, action) {
  switch (action.type) {
    case 'snapshot': {
      const quoteKvPairs = action.quotes.map(([sPrice, sSize]) => [Number(sPrice), Number(sSize)]);
      return new Map(quoteKvPairs);
    }

    case 'delta': {
      priceSizes = new Map(priceSizes);
      action.quotes.forEach(([sPrice, sSize]) => {
        const price = Number(sPrice);
        const size = Number(sSize);
        if (size === 0) {
          priceSizes.delete(price);
        } else {
          priceSizes.set(price, size);
        }
      });
      return priceSizes;
    }

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}
