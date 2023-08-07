const zmq = require('zeromq');

const TradingView = require('../main');

const sock = zmq.socket('req');
sock.connect(process.argv[3]);

/* eslint-disable */
(async function() {
  // const user = await TradingView.loginUser('adrianasdfs@protonmail.com', 'AbeXLq12*', false);
  
  if (process.argv.length < 6) {
    process.exit();
  }

  const client = new TradingView.Client({
    token: process.argv[4],
    signature: process.argv[5]
  });

  const chart = new client.Session.Chart(); // Init a Chart session

  chart.setMarket(process.argv[2], { // Set the market
    timeframe: 'D',
  });

  chart.onError((...err) => { // Listen for errors (can avoid crash)
    console.error('Chart error:', ...err);
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

    sock.send(JSON.stringify(data));
  });

})();
