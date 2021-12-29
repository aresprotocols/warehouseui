import Config from "./Config";

const God = {
  data: [],
  aresData: null,

  fetchAresData: async function (doneCallback) {
    const result = await (
      await fetch(Config.rootAPIURL + Config.getAresAll, {
        method: "GET",
        mode: "cors",
        headers: {
          source: "datafeed",
        },
      })
    ).json();
    if (result && result.data) {
      this.aresData = result.data;

      if (doneCallback) {
        return doneCallback(this.aresData);
      }
    }
  },

  fetchData: async function (allDoneCallback) {
    this.data = [];
    let result = await (
      await fetch(Config.rootAPIURL + Config.getReqConfig, {
        method: "GET",
        mode: "cors",
        headers: {
          source: "datafeed",
        },
      })
    ).json();
    // eslint-disable-next-line array-callback-return
    Object.entries(result.data).map((item, index) => {
      const title = item[0].replace("-usdt", "");
      this.data.push({
        id: index,
        title: title,
        weight: item[1],
        logo: "/images/icons/" + title + ".svg",
      });
    });

    this.data.sort((item1, item2) => {
      return item2.weight.length - item1.weight.length;
    });

    const argSymbols = this.data.map((item) => item.title).join("_");
    result = await (
      await fetch(
        Config.rootAPIURL +
          Config.getBulkCurrencyPrices +
          "?symbol=" +
          argSymbols +
          "&currency=usdt",
        {
          method: "GET",
          mode: "cors",
          headers: {
            source: "datafeed",
          },
        }
      )
    ).json();

    const actives = await (
      await fetch(
        Config.rootAPIURL +
          Config.getBulkSymbolsState +
          "?symbol=" +
          argSymbols +
          "&currency=usdt",
        {
          method: "GET",
          mode: "cors",
          headers: {
            source: "datafeed",
          },
        }
      )
    ).json();

    const now = new Date().getTime();
    this.data.forEach((element) => {
      const theSingleResult = result.data[element.title + "usdt"];
      element.price = theSingleResult.price;
      element.timeStamp = theSingleResult.timestamp;
      element.isActived =
        actives.data[element.title + "usdt"] ??
        now - element.timeStamp < 3600000;
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

    let result = await (
      await fetch(
        Config.rootAPIURL + Config.getPartyPrice + "/" + theData.title + "usdt",
        {
          method: "GET",
          mode: "cors",
          headers: {
            source: "datafeed",
          },
        }
      )
    ).json();
    if (result && result.data) {
      theData.price = result.data.price;
      theData.timeStamp = result.data.timestamp;

      const infos = result.data.infos;
      // eslint-disable-next-line array-callback-return
      theData.weight.map((item) => {
        const info = infos.find(
          (singleInfo) =>
            singleInfo.exchangeName.toLowerCase() ===
            item.exchange.toLowerCase()
        );
        if (info) {
          item.price = info.price;
          item.weight = info.weight;
        } else {
          item.price = null;
          item.weight = null;
        }
      });
    }

    if (allDone) {
      return allDone(true);
    }
  },
};

export default God;
