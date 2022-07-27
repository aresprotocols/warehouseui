import { Axis, Chart, LineAdvance } from "bizcharts";
import { isSciNumber } from "../../utils/number";
import { useEffect, useState } from "react";
import Config from "../../Config";

const PriceHistoryChart = (props) => {
  const dateArr = new Array([]);
  const [chartData, setChardData] = useState([]);

  console.log("history symbol: ", props.symbol);

  useEffect(() => {
    fetch(
      Config.rootAPIURL + Config.historyChart + "?symbol=" + props.symbol
    ).then(async (res) => {
      const result = await res.json();
      const history = result.data
        .map((item) => {
          let temp = {};
          temp.date = new Date(item.timestamp * 1000);
          const price = Number(item.price);
          if (isSciNumber(price)) {
            temp.price = price.toFixed(10);
          } else {
            temp.price = price.toFixed(3);
          }
          return temp;
        })
        // eslint-disable-next-line array-callback-return
        .filter((item) => {
          if (!dateArr.includes(item.date)) {
            dateArr.push(item.date);
            return item;
          }
        });
      setChardData(history);
    });
  }, []);

  const xLabel = {
    style: {
      fill: "#7779AC",
      fontSize: 12,
      fontWeight: "bold",
    },
  };

  const line = {
    style: {
      stroke: "#E1E8EB",
      fill: "#E1E8EB",
      lineDash: [2, 2, 3],
      lineWidth: 1,
    },
  };

  const scale = {
    date: {
      type: "timeCat",
      nice: false,
      mask: "MM-DD HH:mm:ss",
    },
  };

  return (
    <div>
      <Chart
        padding={[10, 60, 50, 60]}
        autoFit
        height={400}
        data={chartData}
        scale={scale}
      >
        <Axis
          name="price"
          grid={chartData.length < 20 ? true : null}
          label={xLabel}
          line={line}
        />
        <Axis name="date" line={line} />
        <LineAdvance
          shape="smooth"
          area
          position="date*price"
          // color="price"
        />
      </Chart>
    </div>
  );
};

export default PriceHistoryChart;
