import { useState, useEffect } from "react";
import "./App.css";
import Header from "./views/Header";
import Home from "./views/Home";
import God from "./God";
import Footer from "./views/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Pairs from "./views/pair";
import Login from "./views/login";
import { getToken } from "./views/login/LoginProvider";
import { BackTop } from "antd";
import { CaretUpOutlined } from "@ant-design/icons";

let updatePairTimer = null;

function App() {
  const [data, setData] = useState([]);
  const [aresData, setAresData] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsLogin(true);
    }
  }, []);

  useEffect(() => {
    getPairData();
  }, []);

  useEffect(() => {
    if (updatePairTimer) {
      clearInterval(updatePairTimer);
    }
    updatePairTimer = setInterval(() => {
      getPairData();
    }, 1000 * 60);
    return () => {
      if (updatePairTimer) {
        clearInterval(updatePairTimer);
      }
    };
  }, []);

  const getPairData = () => {
    God.fetchAresData((res) => setAresData(res));
    God.fetchData((res) => setData(res));
  };

  const onClickLogin = () => {
    setVisible(!visible);
  };

  const onCancel = () => {
    setVisible(!visible);
  };

  const onLoginSuccess = () => {
    setIsLogin(true);
  };

  return (
    <div className="App">
      <Login
        visible={visible}
        cancel={onCancel}
        loginSuccess={onLoginSuccess}
      />
      <Header onClickLogin={onClickLogin} isLogin={isLogin} />
      <BrowserRouter>
        <Routes>
          <Route
            index
            path="/"
            element={<Home data={data} aresData={aresData} />}
          />
          <Route
            path="/pair/:id"
            element={
              <Pairs data={data} showLogin={onClickLogin} isLogin={isLogin} />
            }
          />
        </Routes>
      </BrowserRouter>
      <Footer />
      <BackTop>
        <div className="backUP">
          <CaretUpOutlined />
        </div>
      </BackTop>
    </div>
  );
}

export default App;
