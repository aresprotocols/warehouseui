import { useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useState } from "react/cjs/react.development";
import ResourceLabel from "../components/ResourceLabel";
import Global from "../Global";
import God from "../God";

let timer = null;

const Pair = props => {
	const params = useParams();
	const data = props.data[params.id];
	const [updatedWight, setUpdatedWeight] = useState(0);
	const [heartbeat, setHeartbeat] = useState("0:0:0");

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

	useEffect(() => {
		God.fetchDataWithSymbol(params.id, updated => {
			if (updated) {
				countUpdateWeight();
				countHeartBeat();
			}
		})
	}, []);

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
	</div>);
};

export default Pair;