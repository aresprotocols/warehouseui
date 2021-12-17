import DataCell from "../components/DataCell";

const DataTable = (props) => {
  return (
    <div className="dataTableLayout">
      <div className="dataTableHeader">
        <div>Cryptocurrencies ({props.data.length})</div>
        <div className="filter">
          <div>
            <span className="pairActive" />
            <span>active</span>
          </div>
          <div>
            <span className="pairUnreceived" />
            <span>Unreceived</span>
          </div>
        </div>
      </div>
      <div className="dataTable">
        {props.data.map((item) => {
          return <DataCell key={item.title} data={item} />;
        })}
      </div>
    </div>
  );
};

export default DataTable;
