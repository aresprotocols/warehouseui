import { Modal, Table } from "antd";
import { useEffect, useState } from "react";
import Config from "../../Config";

const HttpError = (props) => {
  const [errs, setErr] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    {
      title: "symbol",
      dataIndex: "symbol",
      key: "symbol",
      width: "150px",
    },
    {
      title: "Error",
      dataIndex: "error",
      key: "error",
      width: "430px",
    },
    {
      title: "Url",
      dataIndex: "url",
      key: "url",
      width: "350px",
    },
    {
      title: "Time",
      dataIndex: "Timestamp",
      key: "Timestamp",
      render: (text, record) => {
        return new Date(record.Timestamp * 1000).toLocaleString();
      },
    },
  ];

  useEffect(() => {
    getHttpErrorInfo(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getHttpErrorInfo(pageIndex) {
    if (Object.keys(errs).length !== 0 && errs.length >= pageIndex * 5) {
      return false;
    }
    setIsLoading(true);
    pageIndex = parseInt((pageIndex * 5) / 20) + 1;
    fetch(
      Config.rootAPIURL +
        Config.getHttpErrorInfo +
        "/" +
        props.pair +
        "usdt" +
        "?index=" +
        pageIndex
    )
      .then(async (res) => {
        if (res.ok) {
          const result = await res.json();
          setTotalNum(result.data.totalNum);
          let items;
          if (Object.keys(errs).length !== 0) {
            items = [...errs, ...result.data.items];
          } else {
            items = result.data.items;
          }
          setErr(items);
          setIsLoading(false);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const pagination = () => {
    return {
      pageSize: 5,
      showSizeChanger: false,
      total: totalNum,
      onChange: (pageIndex) => {
        getHttpErrorInfo(pageIndex);
      },
    };
  };

  const cancel = () => {
    props.cancel();
  };

  return (
    <Modal
      visible={true}
      title={"Http Error"}
      width={1200}
      height={200}
      mask={true}
      footer={null}
      onCancel={cancel}
    >
      <Table
        columns={columns}
        dataSource={errs}
        pagination={pagination()}
        rowKey={(record) => record.Timestamp + record.url}
        loading={isLoading}
      />
    </Modal>
  );
};

export default HttpError;
