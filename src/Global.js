const Global = {
	// 	0: Object { exchange: "huobi", weight: 1 }
	// 1: Object { exchange: "ok", weight: 1 }
	// 2: Object { exchange: "binance", weight: 1 }
	// 3: Object { exchange: "coinbase", weight: 1 }
	// 4: Object { exchange: "bitstamp", weight: 1 }
	// 5: Object { exchange: "bitfinex", weight: 1 
	Resources: {
		uniswap: 0
	},

	getResourceTitle: function (resourceID) {
		// 
	},

	formatCountDown: function (seconds) {
		const h = parseInt(seconds / 3600);
		const m = parseInt((seconds - (h * 3600)) / 60);
		const s = parseInt(seconds - h * 3600 - m * 60);
		return { h, m, s }
	}
};

export default Global;