import { Fragment, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useState } from "react/cjs/react.development";
import { Chart, Lines, Layer, Ticks } from "rumble-charts";
import ResourceLabel from "../../components/ResourceLabel";
import Global from "../../Global";
import God from "../../God";
import "./style.css";
import { Table } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import SetWeight from "./SetWeight";
import Config from "../../Config";
import HttpError from "./HttpError";

let timer = null;

const Pairs = (props) => {
  const params = useParams();
  const data = props.data.filter((item) => {
    return item.id === parseInt(params.id);
  })[0];

  const [dataAvg, setDataAvg] = useState({});
  const [dataAvgLoading, setDataAvgLoading] = useState(false);
  const [updatedWight, setUpdatedWeight] = useState({});
  const [series, setSeries] = useState([{ data: [0, 1, 2] }]);
  const [xTicks, setXTicks] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [historyPrice, setHistoryPrice] = useState({});
  const [historyPriceLoading, setHistoryPriceLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showError, setShowError] = useState(false);
  const [resources, setResource] = useState([]);

  const columns = [
    {
      title: "date",
      dataIndex: "date",
      key: "date",
      render: (text, record) => {
        return new Date(
          record.client.request_timestamp * 1000
        ).toLocaleString();
      },
    },
    {
      title: "price",
      dataIndex: "price",
      key: "price",
      render: (text, record) => {
        return record.price_info.price.toLocaleString();
      },
    },
    {
      title: "resource",
      dataIndex: "resource",
      key: "resource",
      render: (text, record) => {
        return (
          <div>
            {record.price_infos.map((resource) => (
              <img
                key={resource.exchange + String(Math.random())}
                src={`/images/exchanges/${resource.exchange}.png`}
                height="16px"
              />
            ))}

            <span style={{ color: "#7779AC" }}>
              {record.price_infos.length > 0 ? (
                <Fragment>&nbsp;+ record.price_infos.length</Fragment>
              ) : (
                "--"
              )}
            </span>
          </div>
        );
      },
    },
    {
      title: "ip",
      dataIndex: "ip",
      key: "ip",
      render: (text, record) => {
        return record.client.ip;
      },
    },
    {
      title: "METHOD",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "",
      key: "option",
      render: (text, record) => {
        return <CaretDownOutlined style={{ padding: "0 30px" }} />;
      },
    },
  ];

  const columnsDataInfo = [
    {
      title: "date",
      dataIndex: "date",
      key: "date",
      render: (text, record) => {
        return new Date(record.TimeStamp * 1000).toLocaleString();
      },
    },
    {
      title: "price",
      dataIndex: "price",
      key: "price",
      render: (text, record) => {
        return record.Price.toLocaleString();
      },
    },
    {
      title: "CEX",
      dataIndex: "CEX",
      key: "CEX",
      render: (text, record) => {
        return (
          <div>
            <img
              src={`/images/exchanges/${record.PriceOrigin}.png`}
              height="16px"
            />
            <span style={{ color: "#7779AC" }}>&nbsp;{record.PriceOrigin}</span>
          </div>
        );
      },
    },
    {
      title: "Weight",
      dataIndex: "Weight",
      key: "Weight",
    },
    {
      title: "",
      key: "option",
    },
  ];

  const pagination = () => {
    return {
      pageSize: 20,
      showSizeChanger: false,
      total: historyPrice.totalNum,
      onChange: (pageIndex) => {
        getHistoryPrices(pageIndex);
      },
    };
  };

  const dataAvgPagination = () => {
    return {
      pageSize: 20,
      showSizeChanger: false,
      total: dataAvg.historyTotalNUm,
      onChange: (pageIndex) => {
        getRequestInfoBySymbol(pageIndex);
      },
    };
  };

  const expandable = () => {
    return {
      expandedRowRender: (record) => {
        return (
          <div className="exchangeWrapper">
            {record.price_infos.map((item) => {
              return (
                <div key={item.exchange}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={`/images/exchanges/${item.exchange}.png`}
                      alt=""
                      height={18}
                      width={18}
                    />
                    <span>
                      &nbsp;
                      {item.exchange[0].toUpperCase() + item.exchange.slice(1)}
                    </span>
                  </div>
                  <div className="expPrice">${item.price}</div>
                  <div className="expWeight">{item.weight} Wight</div>
                </div>
              );
            })}
          </div>
        );
      },
      defaultExpandAllRows: false,
      expandIcon: (props) => null,
      expandRowByClick: true,
    };
  };

  const countUpdateWeight = () => {
    const tempArray = data.weight.filter((item) => {
      return item.price > 0;
    });
    setUpdatedWeight(tempArray.length);
  };

  const formatHistory = () => {
    const tempArray = [];
    const tempTicks = [];
    console.log("parse", dataAvg.history);
    const step = Math.round(dataAvg.history.length / 5);
    dataAvg.history.reverse().map((item, index) => {
      if (
        item.price_info &&
        item.price_info.price &&
        item.price_info.timestamp
      ) {
        tempArray.push(Number(item.price_info.price.toFixed(3)));

        if (
          index === 0 ||
          index === dataAvg.history.length - 1 ||
          index % step === 0
        ) {
          const theTime = new Date(item.client.request_timestamp * 1000);
          tempTicks.push({
            label: theTime.getHours() + ":" + theTime.getMinutes(),
            x: index,
          });
        }
      }
    });
    setSeries([{ data: tempArray }]);
    setXTicks(tempTicks);
  };

  useEffect(() => {
    getRequestInfoBySymbol(1);
    God.fetchDataWithSymbol(params.id, (updated) => {
      // if (updated) {
      //   countUpdateWeight();
      // }
    });
    getResuources();
    getUpdatePriceHeartbeat();
  }, []);

  useEffect(() => {
    if (dataAvg.history) {
      formatHistory();
    }
  }, [dataAvg]);

  const handleSwitchTab = (event) => {
    const tabId = parseInt(event.target.id);
    setCurrentTab(tabId);
    if (tabId === 1) {
      getHistoryPrices(1);
    }
  };

  function getHistoryPrices(pageIndex) {
    if (
      Object.keys(historyPrice).length !== 0 &&
      historyPrice.items.length >= pageIndex * 20
    ) {
      return false;
    }
    setHistoryPriceLoading(true);
    fetch(
      Config.rootAPIURL +
        Config.getHistoryPrices +
        `?index=${pageIndex}&symbol=${data.title}usdt`
    )
      .then(async (res) => {
        if (res.ok) {
          const result = await res.json();
          let history;
          if (Object.keys(historyPrice).length !== 0) {
            result.data.items = [...historyPrice.items, ...result.data.items];
            history = result.data;
          } else {
            history = result.data;
          }
          setHistoryPrice(history);
          setHistoryPriceLoading(false);
        } else {
          return Promise.reject(data);
        }
      })
      .finally(() => {
        setHistoryPriceLoading(false);
      });
  }

  function getRequestInfoBySymbol(pageIndex) {
    if (dataAvg.history && dataAvg.history.length >= pageIndex * 20) {
      return false;
    }
    setDataAvgLoading(true);
    fetch(
      Config.rootAPIURL +
        Config.getRequestInfoBySymbol +
        "?index=" +
        pageIndex +
        "&symbol=" +
        data.title +
        "usdt"
    )
      .then(async (resp) => {
        if (resp.ok) {
          const result = await resp.json();
          let res = {};
          if (pageIndex === 1) {
            let items = result.data.items;
            res.historyTotalNUm = result.data.totalNum;
            if (items) {
              items.forEach((item) => {
                item.key = item.price_info.timestamp + Math.random();
              });
              res.history = items;
            }
          } else {
            let items = result.data.items;
            if (items) {
              items.forEach((item) => {
                item.key = item.price_info.timestamp + Math.random();
              });
              const oldHistory = dataAvg.history;
              res.historyTotalNUm = result.data.totalNum;
              res.history = oldHistory.concat(items);
            }
          }
          setDataAvg(res);
          setDataAvgLoading(false);
        } else {
          return Promise.reject(data);
        }
      })
      .finally((_) => {
        setDataAvgLoading(false);
      });
  }

  function getResuources() {
    fetch(
      Config.rootAPIURL + Config.getPriceAll + "/" + data.title + "usdt"
    ).then(async (res) => {
      if (res.ok) {
        const result = await res.json();
        setResource(result.data);
      }
    });
  }

  function getUpdatePriceHeartbeat() {
    fetch(
      Config.rootAPIURL +
        Config.getUpdatePriceHeartbeat +
        "/" +
        data.title +
        "usdt"
    ).then(async (res) => {
      if (res.ok) {
        const result = await res.json();
        setUpdatedWeight({
          actual_resources: result.data.actual_resources,
          expect_resources: result.data.expect_resources,
        });
      }
    });
  }

  const onCancel = () => {
    setVisible(!visible);
    getResuources();
  };

  const onCancelShowError = () => {
    setShowError(!showError);
  };

  const onClickSetWeight = () => {
    if (props.isLogin) {
      setVisible(!visible);
    } else {
      props.showLogin();
    }
  };

  return (
    <div className="pairLayout">
      <Link to="/" className="back">
        ❮ Back to date
      </Link>

      <div className="infoPanel">
        <div className="infoTitleBar">
          <div className="tokenTitle">
            <img src={data.logo} width={32} height={32} />
            <span>{data.title}/USDT</span>
          </div>

          <div
            className="gettingError"
            onClick={() => {
              setShowError(true);
            }}
          >
            <img src="/images/info.png" />
            <span>Get Http Error info</span>
          </div>
          {showError ? (
            <HttpError
              pair={data.title}
              visible={showError}
              cancel={onCancelShowError}
            />
          ) : (
            ""
          )}
        </div>

        <div className="infoContent">
          <div className="bigPriceLabel">
            <div className="title">latest confirmed value</div>

            <div className="bigPrice">${data.price.toLocaleString()}</div>
          </div>

          <div className="labels">
            <div className="labelAndValue">
              <div>response</div>
              <div>
                {updatedWight.actual_resources}/{updatedWight.actual_resources}
              </div>
            </div>

            <Heartbeat data={data} />
          </div>
        </div>
      </div>

      <div className="infoPanelBelow">
        <div className="infoTitleBar">
          <div>Resources ({data.weight.length})</div>

          <button className="bottonWithBorder" onClick={onClickSetWeight}>
            Set weight
          </button>
          {visible ? (
            <SetWeight
              visible={visible}
              cancel={onCancel}
              dataSource={resources}
              pair={data.title}
            />
          ) : null}
        </div>

        <div className="infoContent">
          {resources.map((item) => {
            if (item.weight) {
              return <ResourceLabel data={item} key={item.name} />;
            }
          })}
        </div>
      </div>

      {dataAvg.history && dataAvg.history.length > 1 && (
        <div className="historyPanel">
          <div className="infoTitleBar">Price history</div>

          <Chart
            viewBox="0 0 1000 300"
            series={series}
            minY={Math.min(...series[0].data)}
            scaleX={{
              paddingEnd: 0,
              paddingStart: 0,
            }}
            scaleY={{
              paddingTop: 10,
            }}
          >
            <Layer height="70%" width="85%">
              <Lines />

              <Ticks
                axis="x"
                labelAttributes={{
                  fontFamily: "sans-serif",
                  x: 20,
                  y: 30,
                }}
                labelStyle={{
                  dominantBaseline: "middle",
                  textAnchor: "end",
                  fontFamily: "hzgb",
                  fontSize: "0.8em",
                  fill: "gray",
                }}
                lineStyle={{
                  stroke: "rgba(255,255,255,0.3)",
                }}
                lineLength="100%"
                ticks={xTicks}
              />

              <Ticks
                axis="y"
                labelAttributes={{
                  fontFamily: "sans-serif",
                  x: -10,
                }}
                labelStyle={{
                  dominantBaseline: "middle",
                  textAnchor: "end",
                  fontFamily: "hzgb",
                  fontSize: "0.8em",
                  fill: "gray",
                }}
                lineStyle={{
                  stroke: "rgba(255,255,255,0.3)",
                }}
                lineLength="100%"
              />
            </Layer>
          </Chart>
        </div>
      )}

      {dataAvg.history && (
        <div className="tables">
          <div className="title">
            Oracles data on{" "}
            <span style={{ color: "#1195F1", textTransform: "uppercase" }}>
              {data.title}/USD
            </span>
          </div>

          <div className="tabBar">
            <div
              id={0}
              className={currentTab === 0 ? "selected" : "unselected"}
              onClick={handleSwitchTab}
            >
              Date Aggregation
            </div>
            <div
              id={1}
              className={currentTab === 1 ? "selected" : "unselected"}
              onClick={handleSwitchTab}
            >
              Date Request
            </div>
          </div>

          {currentTab === 0 && (
            <Table
              columns={columns}
              dataSource={dataAvg.history}
              pagination={dataAvgPagination()}
              expandable={expandable()}
              loading={dataAvgLoading}
            />
          )}
          {currentTab === 1 && (
            <Table
              columns={columnsDataInfo}
              dataSource={historyPrice.items}
              pagination={pagination()}
              rowKey={(record) => record.TimeStamp + record.PriceOrigin}
              loading={historyPriceLoading}
            />
          )}
        </div>
      )}
    </div>
  );
};

const Heartbeat = (props) => {
  const [heartbeat, setHeartbeat] = useState("0:0:0");

  useEffect(() => {
    countHeartBeat();
  }, []);

  const countHeartBeat = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }

    timer = setInterval(() => {
      const now = new Date().getTime();
      const formated = Global.formatCountDown(
        now / 1000 - props.data.timeStamp
      );
      setHeartbeat(formated.h + ":" + formated.m + ":" + formated.s);
    }, 1000);
  };

  return (
    <div className="labelAndValue">
      <div>Heartbeat</div>
      <div>{heartbeat}</div>
    </div>
  );
};

export default Pairs;
