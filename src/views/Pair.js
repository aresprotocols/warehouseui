import { useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useState } from "react/cjs/react.development";
import { Chart, Lines, Layer, Ticks } from "rumble-charts";
import ResourceLabel from "../components/ResourceLabel";
import Global from "../Global";
import God from "../God";

let timer = null;

const Pair = props => {
	const params = useParams();
	const data = props.data[params.id];
	const [updatedWight, setUpdatedWeight] = useState(0);
	const [heartbeat, setHeartbeat] = useState("0:0:0");
	const [series, setSeries] = useState([{ data: [0, 1, 2] }]);
	const [xTicks, setXTicks] = useState([]);
	const [currentTab, setCurrentTab] = useState(0);

	const countUpdateWeight = () => {
		const tempArray = data.weight.filter(item => {
			return item.price > 0;
		});
		setUpdatedWeight(tempArray.length);
	};

	const countHeartBeat = () => {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}

		timer = setInterval(() => {
			const now = new Date().getTime();
			const formated = Global.formatCountDown(now / 1000 - data.timeStamp);
			setHeartbeat(formated.h + ":" + formated.m + ":" + formated.s);
		}, 1000);
	};

	const formatHistory = () => {
		const tempArray = [];
		const tempTicks = []
		const step = Math.round(data.history.length / 5);
		data.history.reverse().map((item, index) => {
			if (item.price_info && item.price_info.price && item.price_info.timestamp) {
				tempArray.push(Number(item.price_info.price.toFixed(3)));

				if (index === 0 || index === data.history.length - 1 || index % step === 0) {
					const theTime = new Date(item.price_info.timestamp * 1000);
					tempTicks.push({
						label: theTime.getHours() + ":" + theTime.getMinutes(),
						x: index
					});
				}
			}
		});
		setSeries([{ data: tempArray }]);
		setXTicks(tempTicks)
		// console.log("tempArray =", tempArray);
	};

	useEffect(() => {
		God.fetchDataWithSymbol(params.id, updated => {
			if (updated) {
				countUpdateWeight();
				countHeartBeat();
				formatHistory();
			}
		})
	}, []);

	const handleSwitchTab = event => {
		setCurrentTab(parseInt(event.target.id));
	};

	return (<div className="pairLayout">
		<Link to="/" className="back">❮ Back to date</Link>

		<div className="infoPanel">
			<div className="infoTitleBar">
				<div className="tokenTitle">
					<img src={data.logo} />
					<span>{data.title}/USDT</span>
				</div>

				<div className="gettingError">
					<img src="/images/info.png" />
					<span>Get Http Error info</span>
				</div>
			</div>

			<div className="infoContent">
				<div className="bigPriceLabel">
					<div className="title">latest confirmed value</div>

					<div className="bigPrice">${data.price.toLocaleString()}</div>
				</div>

				<div className="labels">
					<div className="labelAndValue">
						<div>response</div>
						<div>{updatedWight}/{data.weight.length}</div>
					</div>

					<div className="labelAndValue">
						<div>Heartbeat</div>
						<div>{heartbeat}</div>
					</div>
				</div>
			</div>
		</div>

		<div className="infoPanelBelow">
			<div className="infoTitleBar">
				<div>Resources ({data.weight.length})</div>

				<button className="bottonWithBorder">Set weight</button>
			</div>

			<div className="infoContent">
				{data.weight.map(item => {
					return (<ResourceLabel data={item} />)
				})}
			</div>
		</div>

		{data.history && data.history.length > 1 && (<div className="historyPanel">
			<div className="infoTitleBar">Price history</div>

			<Chart
				viewBox='0 0 1000 300'
				series={series}
				minY={Math.min(...(series[0].data))}
				scaleX={{
					paddingEnd: 0,
					paddingStart: 0
				}}
				scaleY={{
					paddingTop: 10
				}}>
				<Layer height="70%" width="85%">
					<Lines />

					<Ticks
						axis="x"
						labelAttributes={{
							fontFamily: 'sans-serif',
							x: 20,
							y: 30
						}}
						labelStyle={{
							dominantBaseline: 'middle',
							textAnchor: 'end',
							fontFamily: "hzgb",
							fontSize: "0.8em",
							fill: 'gray',
						}}
						lineStyle={{
							stroke: 'rgba(255,255,255,0.3)'
						}}
						lineLength="100%"
						ticks={xTicks} />

					<Ticks
						axis="y"
						labelAttributes={{
							fontFamily: 'sans-serif',
							x: -10
						}}
						labelStyle={{
							dominantBaseline: 'middle',
							textAnchor: 'end',
							fontFamily: "hzgb",
							fontSize: "0.8em",
							fill: 'gray',
						}}
						lineStyle={{
							stroke: 'rgba(255,255,255,0.3)'
						}}
						lineLength="100%"
					/>
				</Layer>
			</Chart>
		</div>)}

		{data.history && (<div className="tables">
			<div className="title">Oracles data on <span style={{ color: "#1195F1", textTransform: "uppercase" }}>{data.title}/USD</span></div>

			<div className="tabBar">
				<div id={0} className={currentTab === 0 ? "selected" : "unselected"} onClick={handleSwitchTab}>Date Aggregation</div>
				<div id={1} className={currentTab === 1 ? "selected" : "unselected"} onClick={handleSwitchTab}>Date Request</div>
			</div>

			{currentTab === 0 && (<>
				<table>
					<thead>
						<tr>
							<th>date</th>
							<th>price</th>
							<th>resource</th>
							<th>ip</th>
							<th />
						</tr>
					</thead>

					<tbody>
						{data.history.map((item, indexOfHistory) => (<tr key={indexOfHistory}>
							<td>{new Date(item.price_info.timestamp * 1000).toLocaleString()}</td>

							<td>${item.price_info.price.toLocaleString()}</td>

							<td>
								<div>
									{item.price_infos.map(resource => (<img key={resource.exchange} src="/images/eth.png" height="16px" />))}

									<span style={{ color: "#7779AC" }}>&nbsp;+{item.price_infos.length}</span>
								</div>
							</td>

							<td>{item.client.ip}</td>

							<td><button id={indexOfHistory} className="buttonWithoutBorder">▾</button></td>
						</tr>))}
					</tbody>
				</table>

				<div className="page"></div>
			</>)}
		</div>)}
	</div >);
};

export default Pair;