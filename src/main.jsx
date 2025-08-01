import OrderBook from './OrderBook.jsx';
import './main.css';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')).render(
  <OrderBook
    market='BTCPFC'
    wsOrderBook='wss://ws.btse.com/ws/oss/futures'
    wsLastPrice='wss://ws.btse.com/ws/futures'
    numQuotes={8}
  />,
);
