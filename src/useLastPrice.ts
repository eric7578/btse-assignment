import { useEffect, useState } from 'react';

export type LastPriceObject = {
  price: number;
  priceDelta: number;
};

export default function useLastPrice(market: string, wsLastPrice: string) {
  const [lastPrice, setLastPrice] = useState<LastPriceObject | undefined>();

  useEffect(() => {
    const ws = new WebSocket(wsLastPrice);
    const channel = `tradeHistoryApi:${market}`;

    ws.onopen = () => {
      ws.send(JSON.stringify({ op: 'subscribe', args: [channel] }));
    };

    ws.onmessage = e => {
      const recv = JSON.parse(e.data).data;
      const lastPrice = recv?.[0];
      if (lastPrice) {
        setLastPrice(prevLastPrice => ({
          price: lastPrice.price,
          priceDelta: prevLastPrice === undefined ? 0 : lastPrice.price - prevLastPrice.price,
        }));
      }
    };

    return () => {
      ws.onopen = ws.onmessage = null;
      ws.close();
    };
  }, [wsLastPrice, market]);

  return lastPrice;
}
