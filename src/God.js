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
	}
};

export default God;