import {Button, Input, Popover, message} from "antd";
import config from "../Config";
import {useState} from "react";
import Config from "../Config";

const Header = (props) => {
  const [popoverVisible, setPopoverVisible] = useState(false);
  let [newAddress, setNewAddress] = useState("");
  const [localRes, setLocalRes] = useState(JSON.parse(localStorage.getItem("resource")) ?? [{api: "https://api.aresprotocol.io", isDefault: true}])

  newAddress = newAddress.replace(/^\s+|\s+$/g, '');
  const addNewAddress = async () => {
    if (!newAddress.startsWith("http")) {
      message.error('Address Error, Please Start With http:// Or https://');
      return;
    }

    if (config.apis.includes(newAddress))
    {
      message.error('Address Added');
    }


    if (!/^http[s]?:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]+/.test(newAddress))
    {
      message.error('Address Format Error');
      return;
    }

    let address = newAddress;
    if (newAddress.endsWith("/"))
    {
      address = newAddress.slice(0, -1);
    }

    fetch(address + Config.getReqConfig, {
      method: "GET",
      mode: "cors",
      headers: {
        source: "datafeed",
      },
    }).then(async res => {
      const result = await res.json();
      if (result && result.data) {
        setNewAddress("");
        const filter = localRes.filter(item => item.api === address);
        if (!(filter.length > 0))
        {
          localRes.push({"api": address, "isDefault": false});
        }

        localStorage.setItem("resource", JSON.stringify(localRes));
        setLocalRes(JSON.parse(localStorage.getItem("resource")));

        message.success('Add New Address Success');
      } else {
        message.error('New Address Request Data Failed');
      }
    }).catch( error => {
      message.error('New Address Request Data Failed');
    });

  };

  const popoverContent = (
      <div className="popoverContent">
        {
          localRes.map(item => {
            return <div className="popoverContentItem" key={item.api}>
              <Button disabled={item.isDefault} onClick={e => {
                const api = e.target.innerText;
                config.rootAPIURL = api;
                localRes.map(item => {
                  if (item.api === api)
                  {
                    item.isDefault = true;
                  } else {
                    item.isDefault = false;
                  }
                })
                localStorage.setItem("resource", JSON.stringify(localRes));
                setPopoverVisible(!popoverContent);
              }}>
                {item.api}
              </Button>
            </div>
          })
        }
        <div style={{display: "flex", flexDirection: "column", rowGap: "5px", marginTop: "20px"}}>
          <Input value={newAddress} placeholder="please input new data source address"  onChange={ e => setNewAddress(e.target.value)}/>
          <Button type="primary" onClick={addNewAddress}>Add Source</Button>
        </div>
      </div>
  );

  return (
    <header className="App-header">
      <div className="headerLayout">
        <img src="/images/logo.png" alt="" onClick={() => {
          window.location = "/"
        }}/>
        <div className="headerRight">
          <span className="homeButton" onClick={() => {
            window.location = "/"
          }}>Home</span>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>

          <Popover
              content={popoverContent}
              trigger="click"
              visible={popoverVisible}
              onVisibleChange={(visible) => {setPopoverVisible(visible)}}
          >
            <span className="switchButton" onClick={() => setPopoverVisible(true)}>
              Switch Source
            </span>
          </Popover>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <select className="selectWithoutBorder">
            <option>English</option>
          </select>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          {props.isLogin ? (
            <img src="/images/avator.png" alt="" />
          ) : (
            <button className="blueButton" onClick={props.onClickLogin}>
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
