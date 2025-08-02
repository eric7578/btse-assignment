import useQuotes from './useQuotes';
import { useEffect } from 'react';

export default function useOrderBook(market, numQuotes, wsOrderBook) {
  const [sells, sellsTotalSize, sellsSnapshot, sellsDelta] = useQuotes(numQuotes, true);
  const [buys, buysTotalSize, buysSnapshot, buysDelta] = useQuotes(numQuotes, false);

  useEffect(() => {
    const ws = new WebSocket(wsOrderBook);
    const channel = `update:${market}`;
    let seqNum = 0;

    const subscribe = () => {
      console.log(`Subscribing to ${channel}`);
      ws.send(JSON.stringify({ op: 'subscribe', args: [channel] }));
    };

    const unsubscribe = () => {
      console.log(`Unsubscribing from ${channel}`);
      ws.send(JSON.stringify({ op: 'unsubscribe', args: [channel] }));
    };

    ws.onopen = subscribe;

    ws.onmessage = e => {
      const recv = JSON.parse(e.data).data;

      if (recv?.type === 'snapshot') {
        sellsSnapshot(recv.asks, true);
        buysSnapshot(recv.bids, false);
        seqNum = recv.seqNum;
      }

      if (seqNum > 0 && recv?.type === 'delta') {
        if (seqNum === recv.prevSeqNum) {
          seqNum = recv.seqNum;
          sellsDelta(recv.asks, true);
          buysDelta(recv.bids, false);
        } else {
          seqNum = 0;
          unsubscribe();
          subscribe();
        }
      }
    };

    return () => {
      ws.onopen = ws.onmessage = null;
      ws.close();
    };
  }, [wsOrderBook, market, sellsSnapshot, sellsDelta, buysSnapshot, buysDelta]);

  return [sells, sellsTotalSize, buys, buysTotalSize];
}
