import { useParams } from "react-router";
import { Link } from "react-router-dom";

const Pair = props => {
	const params = useParams();
	const data = props.data[params.id];
	console.log(data);

	return (<div className="pairLayout">
		<Link to="/" className="back">❮ Back to date</Link>

		<div className="infoPanel">
			asdf
		</div>
	</div>);
};

export default Pair;