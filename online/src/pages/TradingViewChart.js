import React, { useEffect } from 'react';

const TradingViewChart = () => {
  useEffect(() => {
    // Initialize the TradingView widget
    new window.TradingView.widget({
      width: "100%",
      height: 500,
      symbol: "BINANCE:BTCUSDT", // Bitcoin pair (BTC to USDT on Binance)
      interval: "1", // Interval for the chart (1 minute)
      container_id: "tradingview_chart", // ID of the container to render the chart
      datafeed: new window.Datafeeds.UDFCompatibleDatafeed("https://demo_feed.tradingview.com"), // Demo datafeed (you can replace it with a live feed)
      library_path: "https://s3.tradingview.com/tv.js", // Path to TradingView's library
      locale: "en", // Language for the widget
    });
  }, []);

  return <div id="tradingview_chart" style={{ height: '500px' }} />;
};

export default TradingViewChart;
