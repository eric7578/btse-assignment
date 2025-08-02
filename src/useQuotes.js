import { produce } from 'immer';
import { useCallback, useMemo, useReducer } from 'react';

export default function useQuotes(numQuotes, isSell) {
  const [state, dispatch] = useReducer(quotesReducer, {
    // Map<price, { price, isNewPrice, size, sizeDelta }>
    quotes: new Map(),
    totalSize: 0,
  });

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

  const slicedQuotes = useMemo(() => {
    return sliceQuotes(state.quotes, numQuotes, isSell);
  }, [state.quotes, isSell, numQuotes]);

  return [slicedQuotes, state.totalSize, snapshot, delta];
}

export function quotesReducer(state, action) {
  switch (action.type) {
    // Snapshot: directly update price-size
    case 'snapshot': {
      return action.quotes.reduce(
        (nextState, [sPrice, sSize]) => {
          const price = Number(sPrice);
          const size = Number(sSize);

          nextState.totalSize += size;
          nextState.quotes.set(price, {
            price,
            isNewPrice: false,
            size,
            sizeDelta: 0,
          });

          return nextState;
        },
        {
          quotes: new Map(),
          totalSize: 0,
        },
      );
    }

    // Delta update: update price-size
    case 'delta': {
      return produce(state, draft => {
        draft.totalSize = 0;
        action.quotes.forEach(([sPrice, sSize]) => {
          const price = Number(sPrice);
          const size = Number(sSize);

          if (size === 0) {
            // If size is 0, delete the quote
            draft.quotes.delete(price);
          } else if (draft.quotes.has(price)) {
            // Update existing quote
            const existingQuote = draft.quotes.get(price);
            existingQuote.sizeDelta = existingQuote.size - size;
            existingQuote.size = size;
            existingQuote.isNewPrice = false;
            draft.totalSize += size;
          } else {
            // If it's a new quote, add it
            draft.quotes.set(price, {
              price,
              isNewPrice: true,
              size,
              sizeDelta: 0,
            });
            draft.totalSize += size;
          }
        });
      });
    }

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

export function sliceQuotes(allQuotes, numQuotes, isSell) {
  const quotes = [...allQuotes.values()].slice(0, numQuotes);
  return produce(quotes, draft => {
    let currentTotalSize = 0;
    if (isSell) {
      const len = Math.min(quotes.length, numQuotes);
      for (let i = len - 1; i >= 0; i--) {
        const q = draft[i];
        currentTotalSize += q.size;
        q.currentTotalSize = currentTotalSize;
      }
    } else {
      draft.forEach(q => {
        currentTotalSize += q.size;
        q.currentTotalSize = currentTotalSize;
      });
    }
  });
}
