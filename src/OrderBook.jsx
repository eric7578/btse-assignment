import useLastPrice from './useLastPrice';
import useOrderBook from './useOrderBook';

export default function OrderBook({ market, wsOrderBook, wsLastPrice, numQuotes }) {
  const { sells, buys } = useOrderBook(market, numQuotes, wsOrderBook, wsLastPrice);
  const lastPrice = useLastPrice(market, wsLastPrice);

  return null;
}
