import { Link } from "react-router-dom";

const DataCell = (props) => {
  return (
    <Link to={"/pair/" + props.data.id} className="dataCellLayout">
      <div className="header">
        <div className="title">
          <img src={props.data.logo} width={30} height={30} />
          <span>{props.data.title}/USDT</span>
        </div>

        {props.data.isActived ? (
          <div className="pairActive" />
        ) : (
          <div className="pairUnreceived" />
        )}
      </div>

      <div className="price">${props.data.price.toLocaleString()}</div>

      <div className="resourceLabels">
        <div className="tinyTitle">Resources</div>

        <div className="resourcesLine">
          <div className="resources">
            {props.data.weight.map((item) => {
              return (
                <img
                  className="exchangeIcon"
                  key={item.exchange}
                  src={"/images/exchanges/" + item.exchange + ".png"}
                />
              );
            })}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DataCell;
