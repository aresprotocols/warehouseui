import Config from "./Config";

const God = {
	data: [],

	fetchData: async function (allDoneCallback) {
		let result = await (await fetch(Config.rootAPIURL + Config.getReqConfig)).json();
		Object.entries(result.data).map((item, index) => {
			this.data.push({
				id: index,
				title: item[0].replace("-usdt", ""),
				weight: item[1],
				logo: "/images/eth.png"
			});
		});

		const argSymbols = this.data.map(item => item.title).join("_");
		result = await (await fetch(Config.rootAPIURL + Config.getBulkCurrencyPrices + "?symbol=" + argSymbols + "&currency=usdt")).json();
		const now = new Date().getTime();
		this.data.forEach(element => {
			const theSingleResult = result.data[element.title + "usdt"]
			element.price = theSingleResult.price;
			element.timeStamp = theSingleResult.timestamp;
			element.isActived = (now - element.timeStamp) < 3600000;
		});

		return allDoneCallback(this.data);
	},

	fetchDataWithSymbol: async function (id, allDone) {
		const theData = this.data[id];

		if (!theData) {
			if (allDone) {
				return allDone(false);
			}

			return;
		}

		let result = await (await fetch(Config.rootAPIURL + Config.getPartyPrice + "/" + theData.title + "usdt")).json();
		if (result && result.data) {
			theData.price = result.data.price;
			theData.timeStamp = result.data.timestamp;

			const infos = result.data.infos;
			theData.weight.map(item => {
				const info = infos.find(singleInfo => (singleInfo.exchangeName.toLowerCase() === item.exchange.toLowerCase()));
				if (info) {
					item.price = info.price;
					item.weight = info.weight;
				} else {
					item.price = null;
					item.weight = null;
				}
			});
		}

		result = await (await fetch(Config.rootAPIURL + Config.getRequestInfoBySymbol + "?index=0&symbol=" + theData.title + "usdt")).json();
		if (result && result.data && result.data.getPartyPrice) {
			theData.history = result.data.getPartyPrice;
		}

		if (allDone) {
			return allDone(true);
		}
	}
};

export default God;