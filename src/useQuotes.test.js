import { quotesReducer, sliceQuotes } from './useQuotes';
import { describe, expect, it } from 'vitest';

describe('sliceQuotes', () => {
  function makeQuotesMap(arr) {
    // arr: [[price, size], ...]
    const map = new Map();
    arr.forEach(([price, size]) => {
      map.set(price, { price, size });
    });
    return map;
  }

  it('should return empty array when no quotes', () => {
    const quotes = new Map();
    const result = sliceQuotes(quotes, 5, true);
    expect(result).toEqual([]);
  });

  it('should calculate currentTotalSize for sell orders', () => {
    const quotes = makeQuotesMap([
      [102, 10],
      [101, 20],
      [100, 30],
    ]);

    const result = sliceQuotes(quotes, 3, true);
    expect(result[0].currentTotalSize).toBe(60);
    expect(result[1].currentTotalSize).toBe(50);
    expect(result[2].currentTotalSize).toBe(30);
  });

  it('should calculate currentTotalSize for buy orders', () => {
    const quotes = makeQuotesMap([
      [102, 10],
      [101, 20],
      [100, 30],
    ]);

    const result = sliceQuotes(quotes, 3, false);
    expect(result[0].currentTotalSize).toBe(10);
    expect(result[1].currentTotalSize).toBe(30);
    expect(result[2].currentTotalSize).toBe(60);
  });
});

describe('quotesReducer', () => {
  it('should handle snapshot: set quotes and total size', () => {
    const action = {
      type: 'snapshot',
      quotes: [
        ['100', '10'],
        ['101', '20'],
      ],
    };
    const initialState = {
      quotes: new Map(),
      totalSize: 0,
    };
    const nextState = quotesReducer(initialState, action);
    expect([...nextState.quotes.values()]).toEqual([
      { price: 100, isNewPrice: false, size: 10, sizeDelta: 0 },
      { price: 101, isNewPrice: false, size: 20, sizeDelta: 0 },
    ]);
    expect(nextState.totalSize).toBe(30);
  });

  it('should handle delta updates: update existing quote size and size delta', () => {
    const initialState = {
      quotes: new Map([
        [100, { price: 100, isNewPrice: false, size: 10, sizeDelta: 0 }],
        [101, { price: 101, isNewPrice: false, size: 20, sizeDelta: 0 }],
      ]),
      totalSize: 30,
    };
    const action = {
      type: 'delta',
      quotes: [
        ['100', '15'], // update
        ['101', '0'], // remove
        ['102', '5'], // add new
      ],
    };
    const nextState = quotesReducer(initialState, action);
    expect([...nextState.quotes.values()]).toEqual([
      { price: 100, isNewPrice: false, size: 15, sizeDelta: -5 },
      { price: 102, isNewPrice: true, size: 5, sizeDelta: 0 },
    ]);
    expect(nextState.totalSize).toBe(20);
  });
});
