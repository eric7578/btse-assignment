import { useEffect, useState } from 'react';

export default function useLastPrice(market, wsLastPrice) {
  const [lastPrice, setLastPrice] = useState();

  useEffect(() => {
    const ws = new WebSocket(wsLastPrice);
    const channel = `tradeHistoryApi:${market}`;

    ws.onopen = () => {
      ws.send(JSON.stringify({ op: 'subscribe', args: [channel] }));
    };

    ws.onmessage = e => {
      const recv = JSON.parse(e.data).data;
      setLastPrice(recv?.[0]);
    };

    return () => {
      ws.onopen = ws.onmessage = null;
      ws.close();
    };
  }, [wsLastPrice, market]);

  return lastPrice;
}
