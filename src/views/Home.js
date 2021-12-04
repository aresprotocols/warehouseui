import DataFeeds from "./DataFeeds";
import DataTable from "./DataTable";

const Home = props => {
	return (<>
		<DataFeeds aresData={props.aresData} />
		<DataTable data={props.data} />
	</>)
};

export default Home;