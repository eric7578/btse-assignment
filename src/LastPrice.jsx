import useNumberFormat from './useFormatCurrency';
import cx from 'clsx';
import { memo } from 'react';

function LastPrice({ lastPrice }) {
  const lastPriceText = useNumberFormat(lastPrice.price, 1);

  return (
    <tr>
      <td
        colSpan={3}
        className={cx('text-center text-lg font-bold transition-colors py-1', {
          'text-(--buy-price-color) bg-(--buy-bar-color)': lastPrice.priceDelta > 0,
          'text-(--sell-price-color) bg-(--sell-bar-color)': lastPrice.priceDelta < 0,
          'text-(--text-color) bg-(--last-price-same-bg)': lastPrice.priceDelta === 0,
        })}
      >
        {lastPriceText}
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          role='presentation'
          fill='none'
          fillRule='nonzero'
          stroke='currentColor'
          strokeWidth='4'
          strokeLinecap='round'
          strokeLinejoin='round'
          className={cx('ml-1 w-4 h-4', {
            'inline-block rotate-180': lastPrice.priceDelta > 0,
            'inline-block': lastPrice.priceDelta < 0,
            hidden: lastPrice.priceDelta === 0,
          })}
        >
          <line x1='12' y1='5' x2='12' y2='19'></line>
          <polyline points='19 12 12 19 5 12'></polyline>
        </svg>
      </td>
    </tr>
  );
}

export default memo(LastPrice);
