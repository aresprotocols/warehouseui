import { Fragment, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useState } from "react/cjs/react.development";
import ResourceLabel from "../../components/ResourceLabel";
import Global from "../../Global";
import God from "../../God";
import "./style.css";
import {Button, Radio, Space, Table} from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import SetWeight from "./SetWeight";
import SetIntervalView from "./setIntervalView"
import Config from "../../Config";
import HttpError from "./HttpError";
import PriceHistoryChart from "./PriceHistoryChart";

let timer = null;

const Pairs = (props) => {
  const params = useParams();

  const [price, setPrice] = useState("");
  const [dataAvg, setDataAvg] = useState({});
  const [dataAvgIP, setDataAvgIP] = useState([]);
  const [dataAvgLoading, setDataAvgLoading] = useState(false);
  const [updatedWight, setUpdatedWeight] = useState({});
  const [currentTab, setCurrentTab] = useState(0);
  const [historyPrice, setHistoryPrice] = useState({});
  const [historyPriceLoading, setHistoryPriceLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [intervalVisible, setIntervalVisible] = useState(false);
  const [showError, setShowError] = useState(false);
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const [resources, setResource] = useState([]);
  const [filterIP, setFilterIP] = useState(null);
  const [dataAvgPageIndex, setDataAvgPageIndex] = useState(1);

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
                alt=""
              />
            ))}

            <span style={{ color: "#7779AC" }}>
              {record.price_infos.length > 0 ? (
                <Fragment>&nbsp;+ {record.price_infos.length}</Fragment>
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
      filtered: !!filterIP,
      filterMultiple: false,
      filterDropdownVisible: filterDropdownVisible,
      onFilterDropdownVisibleChange: (visible) => {
        setFilterDropdownVisible(visible);
      },
      filterDropdown: (props) => {
        return <div className="filterDropdown">
          <Radio.Group onChange={fileterValueChange} value={filterIP}>
            <Space direction="vertical">
              {
                dataAvgIP.map((item) => {
                  return <Radio key={item.text} value={item.text}>{item.value}</Radio>
                })
              }
            </Space>
          </Radio.Group>
          <Button type="primary" className="resetButton" onClick={filterReset} >Reset</Button>
        </div>
      },
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

  const fileterValueChange = (e) => {
    setFilterDropdownVisible(false);
    setFilterIP(e.target.value);
  }

  const filterReset = () => {
    setFilterIP(null);
    setFilterDropdownVisible(false);
  }

  const columnsDataInfo = [
    {
      title: "date",
      dataIndex: "date",
      key: "date",
      render: (text, record) => {
        return new Date(record.timestamp * 1000).toLocaleString();
      },
    },
    {
      title: "price",
      dataIndex: "price",
      key: "price",
      render: (text, record) => {
        return record.price.toLocaleString();
      },
    },
    {
      title: "CEX",
      dataIndex: "CEX",
      key: "CEX",
      render: (text, record) => {
        return (
          <div>
            {/*<img*/}
            {/*  src={`/images/exchanges/${record.PriceOrigin}.png`}*/}
            {/*  height="16px"*/}
            {/*  alt=""*/}
            {/*/>*/}
            {/*<span style={{ color: "#7779AC" }}>&nbsp;{record.PriceOrigin}</span>*/}
            {record.infos.map((resource) => (
              <img
                key={resource.priceOrigin + String(Math.random())}
                src={`/images/exchanges/${resource.priceOrigin}.png`}
                height="16px"
                alt=""
              />
            ))}
            <span style={{ color: "#7779AC" }}>
              {record.infos.length > 0 ? (
                <Fragment>&nbsp;+ {record.infos.length}</Fragment>
              ) : (
                "--"
              )}
            </span>
          </div>
        );
      },
    },
    {
      title: "",
      key: "option",
      render: (text, record) => {
        return <CaretDownOutlined style={{ padding: "0 30px" }} />;
      },
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
      current: dataAvgPageIndex,
      pageSize: 20,
      showSizeChanger: false,
      total: dataAvg.historyTotalNUm,
      onChange: (pageIndex) => {
        setDataAvgPageIndex(pageIndex);
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

  const historyExpandable = () => {
    return {
      expandedRowRender: (record) => {
        return (
          <div className="exchangeWrapper">
            {record.infos.map((item) => {
              return (
                <div key={item.exchange}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={`/images/exchanges/${item.priceOrigin}.png`}
                      alt=""
                      height={18}
                      width={18}
                    />
                    <span>
                      &nbsp;
                      {item.priceOrigin[0].toUpperCase() +
                        item.priceOrigin.slice(1)}
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

  // const countUpdateWeight = () => {
  //   const tempArray = data.weight.filter((item) => {
  //     return item.price > 0;
  //   });
  //   setUpdatedWeight(tempArray.length);
  // };

  useEffect(() => {
    getHistoryPrices(1);
    God.fetchDataWithSymbol(params.id, (updated) => {
      // if (updated) {
      //   countUpdateWeight();
      // }
    });
    getResources();
    getUpdatePriceHeartbeat();
    heartbeatCallBack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setDataAvgPageIndex(1);
    getRequestInfoBySymbol(1)
  }, [filterIP]);

  const handleSwitchTab = (event) => {
    const tabId = parseInt(event.target.id);
    setCurrentTab(tabId);
    if (tabId === 1) {
      getRequestInfoBySymbol(1);
    }
  };

  function getHistoryPrices(pageIndex) {
    if (pageIndex === 1)
    {
      setHistoryPrice({});
    }
    if ( pageIndex !== 1 &&
      Object.keys(historyPrice).length !== 0 &&
      historyPrice.items.length >= pageIndex * 20
    ) {
      return false;
    }
    setHistoryPriceLoading(true);
    fetch(
      Config.rootAPIURL +
        Config.getHistoryPrices +
        `?index=${pageIndex - 1}&symbol=${params.title}usdt`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          source: "datafeed",
        },
      }
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
          return Promise.reject(res);
        }
      })
      .finally(() => {
        setHistoryPriceLoading(false);
      });
  }

  function getRequestInfoBySymbol(pageIndex) {
    if (pageIndex === 1)
    {
      setDataAvg([]);
    }
    if (pageIndex !== 1 && dataAvg.history && dataAvg.history.length >= pageIndex * 20) {
      return false;
    }
    setDataAvgLoading(true);
    const rpageIndex = pageIndex - 1;
    let url = Config.rootAPIURL + Config.getRequestInfoBySymbol +
        "?index=" +
        rpageIndex +
        "&symbol=" +
        params.title +
        "usdt";

    if (filterIP) {
      url = url + "&ip=" + filterIP;
    }
    fetch( url,
      {
        method: "GET",
        mode: "cors",
        headers: {
          source: "datafeed",
        },
      }
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
          const ips = [...dataAvgIP];
          result.data.items.map((item, index) => {
            const temp = {
              text: item.client.ip,
              value: item.client.ip
            }
            ips.push(temp);
          })
          let obj = {};
          const uniIps = ips.reduce((cur, next) => {
            // eslint-disable-next-line no-unused-expressions
            obj[next.value] ? "" : obj[next.value] = true && cur.push(next);
            return cur;
          }, [])
          setDataAvgIP(uniIps);
        } else {
          return Promise.reject(resp);
        }
      })
      .finally((_) => {
        setDataAvgLoading(false);
      });
  }

  function getResources() {
    fetch(Config.rootAPIURL + Config.getPriceAll + "/" + params.title + "usdt", {
      method: "GET",
      mode: "cors",
      headers: {
        source: "datafeed",
      },
    }).then(async (res) => {
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
        params.title +
        "usdt",
      {
        method: "GET",
        mode: "cors",
        headers: {
          source: "datafeed",
        },
      }
    ).then(async (res) => {
      if (res.ok) {
        const result = await res.json();
        setUpdatedWeight({
          actual_resources: result.data.actual_resources,
          expect_resources: result.data.expect_resources,
          interval: result.data.interval,
        });
      }
    });
  }

  const onCancel = () => {
    setVisible(!visible);
    getResources();
  };

  const onIntervalCancel = () => {
    setIntervalVisible(!intervalVisible);
  }

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

  const onClickSetInterval = () => {
    if (props.isLogin) {
      setIntervalVisible(!intervalVisible);
    } else {
      props.showLogin();
    }
  };

  const heartbeatCallBack = () => {
    fetch(
      Config.rootAPIURL + Config.getPartyPrice + "/" + params.title + "usdt",
      {
        method: "GET",
        mode: "cors",
        headers: {
          source: "datafeed",
        },
      }
    ).then(async (res) => {
      if (res.ok) {
        const result = await res.json();
        setPrice(result.data.price);
      }
    });
  };

  return (
    <div className="pairLayout">
      <Link to="/" className="back">
        ??? Back to date
      </Link>

      <div className="infoPanel">
        <div className="infoTitleBar">
          <div className="tokenTitle">
            <img src={`/images/icons/${params.title}.svg`} alt="" width={32} height={32} />
            <span>{params.title}/USDT</span>
          </div>

          <div
            className="gettingError"
            onClick={() => {
              setShowError(true);
            }}
          >
            <span>Get Http Error info</span>
          </div>
          {showError ? (
            <HttpError
              pair={params.title}
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

            <div className="bigPrice">${price.toLocaleString()}</div>
          </div>

          <div className="labels">
            <div className="labelAndValue">
              <div>response</div>
              <div>
                {updatedWight.actual_resources}/{updatedWight.actual_resources}
              </div>
            </div>

            <Heartbeat
              interval={updatedWight.interval ?? 60}
              callback={heartbeatCallBack}
            />
          </div>
        </div>
      </div>

      <div className="infoPanelBelow">
        <div className="infoTitleBar">
          <div>Resources ({resources.length})</div>

          <div>
            <button className="bottonWithBorder" onClick={onClickSetWeight}>
              Set weight
            </button>
            {visible ? (
                <SetWeight
                    visible={visible}
                    cancel={onCancel}
                    dataSource={resources}
                    pair={params.title}
                />
            ) : null}
            &nbsp;
            <button className="bottonWithBorder" onClick={onClickSetInterval}>
              Set Interval
            </button>
            {
              intervalVisible ? (
                  <SetIntervalView visible={intervalVisible}
                                   cancel={onIntervalCancel}
                                   dataSource={resources}
                                   pair={params.title}/>
              ) : null
            }
          </div>
        </div>

        <div className="infoContent resource">
          {resources.map((item) => {
            if (item.weight) {
              return <ResourceLabel data={item} key={item.name} />;
            }
            return "";
          })}
        </div>
      </div>

      {historyPrice && historyPrice.items && (
        <div className="historyPanel">
          <div className="infoTitleBar">Price history</div>
          <PriceHistoryChart data={historyPrice.items} />
        </div>
      )}

      {historyPrice && (
        <div className="tables">
          <div className="title">
            Oracles data on{" "}
            <span style={{ color: "#1195F1", textTransform: "uppercase" }}>
              {params.title}/USDT
            </span>
          </div>

          <div className="tabBar">
            <div
                id={0}
                className={currentTab === 0 ? "selected" : "unselected"}
                onClick={handleSwitchTab}
            >
              Date Request
            </div>
            <div
              id={1}
              className={currentTab === 1 ? "selected" : "unselected"}
              onClick={handleSwitchTab}
            >
              Date Aggregation
            </div>
          </div>

          {currentTab === 0 && (
            <Table
            columns={columnsDataInfo}
            dataSource={historyPrice.items}
            pagination={pagination()}
            rowKey={(record) => record.timestamp + record.price}
            loading={historyPriceLoading}
            expandable={historyExpandable()}
            />
          )}
          {currentTab === 1 && (
              <Table
                  columns={columns}
                  dataSource={dataAvg.history}
                  pagination={dataAvgPagination()}
                  expandable={expandable()}
                  loading={dataAvgLoading}
                  onChange={() => {

                  }}
              />
          )}
        </div>
      )}
    </div>
  );
};

const Heartbeat = (props) => {
  const [heartbeat, setHeartbeat] = useState(0);
  const [heartbeatFormat, setHeartbeatFormat] = useState("0:0:0");
  const counterRef = useRef();
  const intervalRef = useRef();
  const callbackRef = useRef();

  useEffect(() => {
    intervalRef.current = props.interval;
    callbackRef.current = props.callback;
    counterRef.current = heartbeat;
    countHeartBeat();
    return () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const countHeartBeat = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }

    timer = setInterval(() => {
      let heart = counterRef.current + 1;
      if (heart >= intervalRef.current) {
        counterRef.current = 0;
        heart = 0;
        callbackRef.current();
      }
      counterRef.current = heart;
      setHeartbeat(heart);
      const formated = Global.formatCountDown(heart);
      setHeartbeatFormat(formated.h + ":" + formated.m + ":" + formated.s);
    }, 1000);
  };

  return (
    <div className="labelAndValue">
      <div>Heartbeat</div>
      <div>{heartbeatFormat} </div>
    </div>
  );
};

export default Pairs;
