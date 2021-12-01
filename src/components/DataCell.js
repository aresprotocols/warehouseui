import { Link } from "react-router-dom";

const DataCell = props => {
	const handleClick = () => {
		return props.onClick(props.id)
	};

	return (
		<Link to={"/pair/" + props.data.id} className="dataCellLayout">
			<div className="title">
				<img src={props.data.logo} />
				<span>{props.data.title}/USDT</span>
			</div>

			<div className="price">${props.data.price.toLocaleString()}</div>

			<div className="resourceLabels">
				<tinyTitle>Resources</tinyTitle>

				<resourcesLine>
					<resources>
						{props.data.weight.map(item => {
							return <img src={"/images/resources/" + item.exchange + ".png"} />
						})}
					</resources>

					{props.data.isActived ? (<img src="/images/actived.png" />) : (<img src="/images/unactived.png" />)}
				</resourcesLine>
			</div>
		</Link>);
};

export default DataCell;