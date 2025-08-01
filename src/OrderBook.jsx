import Quote from './Quote';
import useLastPrice from './useLastPrice';
import useOrderBook from './useOrderBook';

export default function OrderBook({ market, wsOrderBook, wsLastPrice, numQuotes }) {
  const [sells, buys] = useOrderBook(market, numQuotes, wsOrderBook, wsLastPrice);
  const lastPrice = useLastPrice(market, wsLastPrice);

  return (
    <div className='w-full h-full bg-(--bg-color) text-sm text-(--text-color)'>
      <h2 className='m-0 p-2 text-lg font-bold'>Order Book</h2>
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
          <tr>
            <td colSpan={3} className='text-center text-lg font-bold '>
              {lastPrice?.price}
            </td>
          </tr>
          {buys.map(buy => (
            <Quote key={buy.price} {...buy} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
