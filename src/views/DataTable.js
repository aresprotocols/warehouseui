import DataCell from "../components/DataCell";

const DataTable = props => {
	return (<div className="dataTableLayout">
		<div className="dataTableHeader">
			<div>Cryptocurrencies ({props.data.length})</div>

			<div className="filter">
				<div>
					<img src="/images/actived.png" />
					<span>active</span>
				</div>

				<div>
					<img src="/images/unactived.png" />
					<span>Unreceived</span>
				</div>
			</div>
		</div>

		<div className="dataTable">
			{props.data.map(item => {
				return (<DataCell data={item} />)
			})}
		</div>
	</div>)
};

export default DataTable;