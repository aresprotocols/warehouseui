import {Axis, Chart, LineAdvance} from "bizcharts";

const PriceHistoryChart = (props) => {
    const dateArr = new Array([]);
    const data = props.data
        // .reverse()
        // .filter((item) => item.type !== "getHistoryPrice")
        .map((item) =>
        {
            let temp = {};
            temp.date = new Date(item.timestamp * 1000);
            temp.price = Number(item.price.toFixed(3));
            return temp;
        })
        // eslint-disable-next-line array-callback-return
        .filter((item) =>
        {
            if (!dateArr.includes(item.date))
            {
                dateArr.push(item.date);
                return item;
            }
        });

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
            type: 'timeCat',
            nice: false,
            mask: 'MM-DD HH:mm:ss',
        }
    }

    return (
        <div>
            <Chart padding={[10, 60, 50, 100]} autoFit height={400} data={data} scale={scale}>
                <Axis
                    name="price"
                    grid={data.length < 20 ? true : null}
                    label={xLabel}
                    line={line}
                />
                <Axis name="date" line={line}/>
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
