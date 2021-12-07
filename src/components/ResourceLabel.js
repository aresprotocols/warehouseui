const ResourceLabel = props => {
	return (<div className="ResourceLabelLayout">
		<img src={"/images/exchanges/" + props.data.exchange + ".png"} width="32px" />

		<div className="title">{props.data.exchange}</div>

		<div className="price">${props.data.price ? props.data.price.toLocaleString() : "-"}</div>

		<div className="weight">{props.data.weight ?? 0}&nbsp;weight</div>
	</div>);
};

export default ResourceLabel;