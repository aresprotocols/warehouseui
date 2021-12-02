const ResourceLabel = props => {
	return (<div className="ResourceLabelLayout">
		<img src="/images/eth.png" />

		<div className="title">{props.data.exchange}</div>

		<div className="price">${props.data.price ? props.data.price.toLocaleString() : "-"}</div>

		<div className="weight">{props.data.weight ?? 0}&nbsp;weight</div>
	</div>);
};

export default ResourceLabel;