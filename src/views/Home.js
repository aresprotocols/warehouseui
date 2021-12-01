import DataFeeds from "./DataFeeds";
import DataTable from "./DataTable";

const Home = props => {
	return (<>
		<DataFeeds />
		<DataTable data={props.data} />
	</>)
};

export default Home;