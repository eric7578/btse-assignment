import useBlink from './useBlink';
import usePrevious from './usePrevious';
import cx from 'clsx';
import { memo } from 'react';

const Quote = memo(({ price, size, total, isNew, totalPercent, isSell }) => {
  const sizeBarWidth = totalPercent * 100;

  // 若價錢改變 且size異動 才需要閃爍
  const prevSize = usePrevious(size);
  const blinkGreenOnSize = useBlink(!isNew && size > prevSize);
  const blinkRedOnSize = useBlink(!isNew && size < prevSize);

  // 若是新報價 則閃爍
  const blinkRow = useBlink(isNew);

  return (
    <tr
      className='font-bold transition-colors hover:bg-(--quote-hover-color)'
      style={{
        animation: blinkRow ? (isSell ? 'blink-red 500ms ease' : 'blink-green 500ms ease') : 'none',
      }}
    >
      <td className={cx('py-1 px-2', isSell ? 'text-(--sell-price-color)' : 'text-(--buy-price-color)')}>
        {price.toLocaleString('en-US')}
      </td>
      <td
        className='py-1 px-2 text-right'
        style={{
          animation: blinkGreenOnSize ? 'blink-green 500ms ease' : blinkRedOnSize ? 'blink-red 500ms ease' : 'none',
        }}
      >
        {size.toLocaleString('en-US')}
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
        {total.toLocaleString('en-US')}
      </td>
    </tr>
  );
});

export default Quote;
