import React, { useState } from "react";
import { Button, Modal, Select, message } from "antd";
import "./setWeight.css";
import config from "../../Config";
import { getToken } from "../login/LoginProvider";

const { Option } = Select;

const SetWeight = (props) => {
  let dWeight = 0;
  let dExchange = "";
  if (props.dataSource && props.dataSource.length > 0) {
    dWeight = props.dataSource[0].weight ?? 0;
    dExchange = props.dataSource[0].name ?? "";
  }
  const [defaultWeightValue, setdefaultWeightValue] = useState(dWeight);
  const [selectExchange, setSelectExchange] = useState(dExchange);

  const onCancel = () => {
    props.cancel();
  };

  const exchangeSelect = (value) => {
    setSelectExchange(value);
    const exchange = props.dataSource.filter((item) => item.name === value);
    let weight = 0;
    if (exchange.length > 0) {
      weight = exchange[0].weight ?? 0;
    }
    setdefaultWeightValue(weight);
  };

  const onChangeExchangeWeight = () => {
    const oldExchange = props.dataSource.filter(
      (item) => item.name === selectExchange
    );
    let oldWeight = 0;
    if (oldExchange.length > 0) {
      oldWeight = oldExchange[0].weight ?? 0;
    }
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
        const result = await res.json();
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
                <Option value={item.name} key={item.name}>
                  <div className="exchangeOption">
                    <img
                      src={`/images/exchanges/${item.name}.png`}
                      alt=""
                      width={19}
                      height={20}
                    />
                    <span>{item.name}</span>
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
              return (
                <Option value={index} key={index}>
                  {index}
                </Option>
              );
            })}
          </Select>
        </div>
      </div>
      <div style={{ marginTop: 20 }}>
        <Button block type="primary" onClick={onChangeExchangeWeight}>
          Update
        </Button>
      </div>
    </Modal>
  );
};

export default SetWeight;
