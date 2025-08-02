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

  it('當沒有報價時返回空陣列', () => {
    const quotes = new Map();
    const result = sliceQuotes(quotes, 5, true);
    expect(result).toEqual([]);
  });

  it('計算賣單的currentTotalSize', () => {
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

  it('計算買單的currentTotalSize', () => {
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
  it('處理快照：設定報價和總大小', () => {
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

  it('處理差異更新：更新現有報價大小和大小變化', () => {
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
