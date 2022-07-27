const Config = {
  apis: ["https://api.aresprotocol.io"],
  rootAPIURL: "https://api.aresprotocol.io",
  auth: "/api/auth",
  setWeight: "/api/setWeight",
  getAresAll: "/api/getAresAll",
  getPartyPrice: "/api/getPartyPrice", //btcusdt
  getBulkCurrencyPrices: "/api/getBulkCurrencyPrices", // symbol=btc_eth_dot_link&currency=usdt
  getReqConfig: "/api/getReqConfig",
  getRequestInfoBySymbol: "/api/getRequestInfoBySymbol", // index=0&symbol=axsusdt
  getHistoryPrices: "/api/getUpdatePriceHistory",
  getPriceAll: "/api/getPriceAll",
  getUpdatePriceHeartbeat: "/api/getUpdatePriceHeartbeat",
  getHttpErrorInfo: "/api/getHttpErrorInfo",
  getBulkSymbolsState: "/api/getBulkSymbolsState",
  setInterval: "/api/setInterval",
  historyChart: "/api/getUpdatePriceHistoryForChart",
};

export default Config;
