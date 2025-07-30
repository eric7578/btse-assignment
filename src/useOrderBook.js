import useQuotes from './useQuotes';
import { useEffect } from 'react';

export default function useOrderBook(market, numQuotes, wsOrderBook) {
  const [sells, sellsSnapshot, sellsDelta] = useQuotes(true, numQuotes);
  const [buys, buysSnapshot, buysDelta] = useQuotes(false, numQuotes);

  useEffect(() => {
    const ws = new WebSocket(wsOrderBook);
    const channel = `update:${market}`;

    ws.onopen = () => {
      ws.send(JSON.stringify({ op: 'subscribe', args: [channel] }));
    };

    ws.onmessage = e => {
      const recv = JSON.parse(e.data).data;

      if (recv?.type === 'snapshot') {
        sellsSnapshot(recv.asks);
        buysSnapshot(recv.bids);
      }

      if (recv?.type === 'delta') {
        sellsDelta(recv.asks);
        buysDelta(recv.bids);
      }
    };

    return () => {
      ws.onopen = ws.onmessage = null;
      ws.close();
    };
  }, [wsOrderBook, market, sellsSnapshot, sellsDelta, buysSnapshot, buysDelta]);

  return {
    sells,
    buys,
  };
}
