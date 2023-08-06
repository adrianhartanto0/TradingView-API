const zmq = require('zeromq');

const TradingView = require('../main');

const client = new TradingView.Client(); // Creates a websocket client
const chart = new client.Session.Chart(); // Init a Chart session

if (process.argv.length < 4) {
  process.exit();
}

const sock = zmq.socket('push');
sock.connect(process.argv[3]);

chart.setMarket(process.argv[2], { // Set the market
  timeframe: 'D',
});

chart.onError((...err) => { // Listen for errors (can avoid crash)
  console.error('Chart error:', ...err);
  // Do something...
});

chart.onSymbolLoaded(() => { // When the symbol is successfully loaded
  console.log(`Market "${chart.infos.description}" loaded !`);
});

chart.onUpdate(() => { // When price changes
  if (!chart.periods[0]) return;
  console.log(`[${chart.infos.description}]: ${chart.periods[0].close} ${chart.infos.currency_id}`);

  const [exchange, symbol] = process.argv[2].split(':');

  const data = {
    time: Date.now(),
    exchange,
    symbol,
    ticker_period: 60,
    ticker_open: chart.periods[0].close,
    ticker_high: chart.periods[0].close,
    ticker_low: chart.periods[0].close,
    ticker_close: chart.periods[0].close,
  };

  console.log(data);

  sock.send(JSON.stringify(data));
});
