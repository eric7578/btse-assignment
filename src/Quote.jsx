import useBlink from './useBlink';
import useNumberFormat from './useFormatCurrency';
import cx from 'clsx';
import { memo } from 'react';

function Quote({ quote, totalSize, isSell }) {
  const sizeBarWidth = (quote.currentTotalSize / totalSize) * 100;

  // 若價錢改變 且size異動 才需要閃爍
  const blinkGreenOnSize = useBlink(quote.sizeDelta > 0);
  const blinkRedOnSize = useBlink(quote.sizeDelta < 0);

  // 若是新報價 則閃爍
  const blinkRow = useBlink(quote.isNewPrice);

  const priceText = useNumberFormat(quote.price, 1);
  const sizeText = useNumberFormat(quote.size, 0);
  const totalText = useNumberFormat(quote.currentTotalSize, 0);

  return (
    <tr
      className='font-bold transition-colors hover:bg-(--quote-hover-color)'
      style={{
        animation: blinkRow ? (isSell ? 'blink-red 500ms ease' : 'blink-green 500ms ease') : 'none',
      }}
    >
      <td className={cx('py-1 px-2', isSell ? 'text-(--sell-price-color)' : 'text-(--buy-price-color)')}>
        {priceText}
      </td>
      <td
        className='py-1 px-2 text-right'
        style={{
          animation: blinkGreenOnSize ? 'blink-green 500ms ease' : blinkRedOnSize ? 'blink-red 500ms ease' : 'none',
        }}
      >
        {sizeText}
      </td>
      <td
        className='py-1 px-2 text-right bg-right bg-no-repeat'
        style={{
          backgroundSize: `${sizeBarWidth}% 85%`,
          backgroundImage: `linear-gradient(
            to left,
            ${isSell ? 'var(--sell-bar-color)' : 'var(--buy-bar-color)'} 100%,
            transparent 0%
          )`,
        }}
      >
        {totalText}
      </td>
    </tr>
  );
}

export default memo(Quote);
