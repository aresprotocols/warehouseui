import React, {useEffect, useState} from "react";
import { Button, Modal, Select, message } from "antd";
import "./setWeight.css";
import config from "../../Config";
import { getToken } from "../login/LoginProvider";
import Config from "../../Config";

const { Option } = Select;

const SetIntervalView = (props) => {
    const [defaultIntervalValue, setdefaultIntervalValue] = useState(1);

    useEffect(() => {
        fetch(Config.rootAPIURL + Config.getReqConfig, {
            method: "GET",
            mode: "cors",
            headers: {
                source: "datafeed",
            },
        }).then( async  res => {
            if (res.ok){
                const result = await res.json();
                const pair = props.pair + "-usdt";
                setdefaultIntervalValue(result.data[pair].interval / 60)
            }
        })
    }, [])

    const onCancel = () => {
        props.cancel();
    };

    const exchangeIntervalSelect = (value) => {
        setdefaultIntervalValue(value);
    }

    const onChangeExchangeInterval = () => {
        const data = {
            symbol: props.pair + "-usdt",
            interval: defaultIntervalValue * 60,
        };
        fetch(config.rootAPIURL + config.setInterval, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + getToken(),
                source: "datafeed",
            },
            body: JSON.stringify(data),
        }).then(async (res) => {
            if (res.ok) {
                await res.json();
                message.success("update success");
                onCancel();
            } else {
                message.error("update error");
                return Promise.reject(data);
            }
        });
    }

    return (
        <Modal
            visible={props.visible}
            title={"Set Interval"}
            centered={true}
            width={320}
            mask={true}
            onCancel={onCancel}
            footer={null}
        >
            <div className="selectWrapper">
                <Select
                    style={{ width: '100%' }}
                    defaultValue={defaultIntervalValue}
                    value={defaultIntervalValue}
                    onChange={(value) => exchangeIntervalSelect(value)}
                >
                    {new Array(9).fill(1).map((v, index) => {
                        const value = index + 1;
                        return (
                            <Option value={value} key={value}>
                                {value} 分钟
                            </Option>
                        );
                    })}
                </Select>
            </div>
            <div style={{ marginTop: 20 }}>
                <Button block type="primary" onClick={onChangeExchangeInterval}>
                    Update
                </Button>
            </div>
        </Modal>
    );
};


export default SetIntervalView;
