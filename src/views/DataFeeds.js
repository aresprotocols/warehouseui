import { Divider } from "antd";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";

const DataFeeds = (props) => {
  return (
    <div className="dataFeedsLayout">
      <div className="titleBlock">
        <h3>Cryptocurrency (USD Pairs) Data Feeds</h3>
        <p className="webDesc">
          Explore the decentralizen oracle networks powered by{" "}
          <a href="">Ares Protocol</a>
        </p>
      </div>
      <div className="scorePanel">
        <div className="scorePanelContent">
          <div className="scoreTitle">
            <div className="logo">
              <img src="/images/ares.png" width={70} height={70} />
              <img
                src="/images/loading.png"
                className="loading"
                alt=""
                width={70}
                height={70}
              />
            </div>
            <div className="arsPriceWrapper">
              <span className="arsPriceTitle">Ares Protocol (ARES)</span>
              <span className="arsPrice">
                {props.aresData ? props.aresData.price : 0}
                <span className="priceUnit">USD</span>
              </span>
            </div>
          </div>
          <Divider type="vertical" style={{ height: "30px" }} />
          {props.aresData && props.aresData.percent_change > 0 ? (
            <div className="undulationWrapperUp">
              <div className="undulation">
                {props.aresData ? props.aresData.percent_change : 0}%
              </div>
              <CaretUpOutlined />
            </div>
          ) : (
            <div className="undulationWrapper">
              <div className="undulation">
                {props.aresData ? props.aresData.percent_change : 0}%
              </div>
              <CaretDownOutlined />
            </div>
          )}
          <Divider type="vertical" style={{ height: "30px" }} />
          <div className="scoreItem">
            <div>Rank</div>
            <div>{props.aresData ? props.aresData.rank : 0}</div>
          </div>
          <Divider type="vertical" style={{ height: "30px" }} />
          <div className="scoreItem">
            <div>Market Cap</div>
            <div>
              ${props.aresData ? props.aresData.market_cap.toLocaleString() : 0}
            </div>
          </div>
          <Divider type="vertical" style={{ height: "30px" }} />
          <div className="scoreItem">
            <div>24H Volume</div>
            <div>
              {props.aresData ? props.aresData.volume.toLocaleString() : 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataFeeds;
