import LastPrice from './LastPrice';
import Quote from './Quote';
import useLastPrice from './useLastPrice';
import useOrderBook from './useOrderBook';

export default function OrderBook({ market, wsOrderBook, wsLastPrice, numQuotes }) {
  const [sells, buys] = useOrderBook(market, numQuotes, wsOrderBook, wsLastPrice);
  const lastPrice = useLastPrice(market, wsLastPrice);

  return (
    <div className='w-[400px] bg-(--bg-color) text-sm text-(--text-color)'>
      <h2 className='m-0 py-1 px-2 text-lg font-bold border-b border-[#333]'>Order Book</h2>
      <table className='w-full border-0'>
        <thead>
          <tr className='text-(--th-text-color)'>
            <th className='w-[30%] py-1 px-2 text-left'>Price (USD)</th>
            <th className='w-[30%] py-1 px-2 text-right'>Size</th>
            <th className='w-[30%] py-1 px-2 text-right'>Total</th>
          </tr>
        </thead>
        <tbody>
          {sells.map(sell => (
            <Quote key={sell.price} isSell {...sell} />
          ))}
          {Boolean(lastPrice) && <LastPrice lastPrice={lastPrice} />}
          {buys.map(buy => (
            <Quote key={buy.price} {...buy} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
