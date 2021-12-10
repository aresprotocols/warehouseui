import React, { useState } from "react";
import { Button, Modal, Select, message } from "antd";
import "./setWeight.css";
import config from "../../Config";
import { getToken } from "../login/LoginProvider";

const { Option } = Select;

const SetWeight = (props) => {
  const [defaultWeightValue, setdefaultWeightValue] = useState(
    props.dataSource[0].weight ?? 0
  );
  const [selectExchange, setSelectExchange] = useState(
    props.dataSource[0].exchange ?? ""
  );

  const onCancel = () => {
    props.cancel();
  };

  const exchangeSelect = (value) => {
    setSelectExchange(value);
    const weight =
      props.dataSource.filter((item) => item.exchange === value)[0].weight ?? 0;
    setdefaultWeightValue(weight);
  };

  const onChangeExchangeWeight = () => {
    const oldWeight =
      props.dataSource.filter((item) => item.exchange === selectExchange)[0]
        .weight ?? 0;
    if (defaultWeightValue === oldWeight) {
      return false;
    }

    const data = {
      symbol: props.pair + "-usdt",
      exchange: selectExchange,
      weight: defaultWeightValue,
    };
    fetch(config.rootAPIURL + config.setWeight, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken(),
      },
      body: JSON.stringify(data),
    }).then(async (res) => {
      if (res.ok) {
        const result = res.json();
        message.success("update success");
        onCancel();
      } else {
        message.error("update error");
        return Promise.reject(data);
      }
    });
  };

  const exchangeWeightSelect = (weight) => {
    setdefaultWeightValue(weight);
  };

  return (
    <Modal
      visible={props.visible}
      title={"Set Weight"}
      centered={true}
      width={320}
      mask={true}
      onCancel={onCancel}
      footer={null}
    >
      <div className="selectWrapper">
        <div>
          <Select
            defaultValue={selectExchange}
            onChange={(value) => exchangeSelect(value)}
          >
            {props.dataSource.map((item) => {
              return (
                <Option value={item.exchange}>
                  <div className="exchangeOption">
                    <img
                      src={`/images/exchanges/${item.exchange}.png`}
                      alt=""
                      width={19}
                      height={20}
                    />
                    <span>{item.exchange}</span>
                  </div>
                </Option>
              );
            })}
          </Select>
        </div>
        <div>
          <Select
            defaultValue={defaultWeightValue}
            value={defaultWeightValue}
            onChange={(value) => exchangeWeightSelect(value)}
          >
            {new Array(11).fill(1).map((v, index) => {
              return <Option value={index}>{index}</Option>;
            })}
          </Select>
        </div>
      </div>
      <div style={{ marginTop: 20 }}>
        <Button block type="primary" onClick={onChangeExchangeWeight}>
          Ok
        </Button>
      </div>
    </Modal>
  );
};

export default SetWeight;
