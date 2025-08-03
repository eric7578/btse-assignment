import { produce } from 'immer';
import { useCallback, useMemo, useReducer } from 'react';

type RawQuote = [string, string]; // [price, size]

export type QuoteObject = {
  price: number;
  isNewPrice: boolean;
  size: number;
  sizeDelta: number;
  currentTotalSize: number;
};

type QuotesAction = { type: 'snapshot'; quotes: RawQuote[] } | { type: 'delta'; quotes: RawQuote[] };

const initialState = {
  quotes: new Map<number, QuoteObject>(),
  totalSize: 0,
};

type SnapshotFn = (quotes: RawQuote[]) => void;
type DeltaFn = (quotes: RawQuote[]) => void;

export default function useQuotes(numQuotes: number, isSell: boolean): [QuoteObject[], number, SnapshotFn, DeltaFn] {
  const [state, dispatch] = useReducer(quotesReducer, initialState);

  const snapshot = useCallback(
    (quotes: RawQuote[]) => {
      dispatch({
        type: 'snapshot',
        quotes,
      });
    },
    [dispatch],
  );

  const delta = useCallback(
    (quotes: RawQuote[]) => {
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

export function quotesReducer(state: typeof initialState, action: QuotesAction): typeof initialState {
  switch (action.type) {
    // Snapshot: directly update price-size
    case 'snapshot': {
      return action.quotes.reduce((nextState, [sPrice, sSize]) => {
        const price = Number(sPrice);
        const size = Number(sSize);

        nextState.totalSize += size;
        nextState.quotes.set(price, {
          price,
          isNewPrice: false,
          size,
          sizeDelta: 0,
          currentTotalSize: 0,
        });

        return nextState;
      }, initialState);
    }

    // Delta update: update price-size
    case 'delta': {
      return produce(state, draft => {
        draft.totalSize = 0;
        action.quotes.forEach(([sPrice, sSize]) => {
          const price = Number(sPrice);
          const size = Number(sSize);
          const existingQuote = draft.quotes.get(price);

          if (size === 0) {
            // If size is 0, delete the quote
            draft.quotes.delete(price);
          } else if (existingQuote) {
            // Update existing quote
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
              currentTotalSize: 0, // This will be calculated later in sliceQuotes
            });
            draft.totalSize += size;
          }
        });
      });
    }

    default: {
      console.log(`Unknown action type: ${action}`);
      return state;
    }
  }
}

// Show max 8 quotes, and calculate currentTotalSize
export function sliceQuotes(allQuotes: Map<number, QuoteObject>, numQuotes: number, isSell: boolean) {
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
