import DataFeeds from "./DataFeeds";
import DataTable from "./DataTable";

const Home = props => {
	return (
		<div className="HomeContent">
			<DataFeeds aresData={props.aresData} />
			<DataTable data={props.data} />
		</div>
	)
};

export default Home;
