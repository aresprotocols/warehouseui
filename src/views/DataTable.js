import React, {Fragment, useState} from "react";
import DataCell from "../components/DataCell";
import {Select} from "antd";
import {SearchOutlined} from '@ant-design/icons';

const {Option} = Select;

const DataTable = (props) =>
{
    const [options, setOptions] = useState([]);
    const handleSearch = (title) =>
    {

    }

    const handleChange = (value, options) =>
    {
        setOptions(value);
    }

    return (
        <div className="dataTableLayout">
            <div className="dataTableHeader">
                <div>Cryptocurrencies ({props.data.length})</div>
                <div className="headerSearch">
                    <Select style={{width: '100%'}}
                            placeholder={
                                <Fragment>
                                    <SearchOutlined style={{color: '#AFB7DB'}}/>
                                    &nbsp; Search Cryptocurrencies
                                </Fragment>
                            }
                            onSearch={handleSearch}
                            onChange={handleChange}
                            notFoundContent={null}
                            showSearch mode="multiple" showArrow={false}
                    >

                        {
                            props.data.map((item, index) => {
                                return <Option value={item.title}>{item.title}</Option>
                            })
                        }
                    </Select>
                </div>
                <div className="filter">
                    <div>
                        <span className="pairActive"/>
                        <span>active</span>
                    </div>
                    <div>
                        <span className="pairUnreceived"/>
                        <span>Unreceived</span>
                    </div>
                </div>
            </div>
            <div className="dataTable">
                {
                    options.length > 0 ? props.data
                        .filter(item => {
                            return options.indexOf(item.title) !== -1;
                        })
                        .map((item) => {
                            return <DataCell key={item.title} data={item}/>;
                        }) :
                    props.data.map((item) => {
                        return <DataCell key={item.title} data={item}/>;
                    })
                }
            </div>
        </div>
    );
};

export default DataTable;
