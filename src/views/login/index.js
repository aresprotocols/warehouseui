import React from "react";
import { Button, Form, Input, message, Modal } from "antd";
import { login } from "./LoginProvider";
import "./login.css";

const Login = (props) => {
  const handleSubmit = (values) => {
    const user = login(values.username, values.password);
    if (user) {
      message.success("update success");
      props.cancel();
      props.loginSuccess();
    }
  };

  const onCancel = () => {
    props.cancel();
  };

  return (
    <Modal
      visible={props.visible}
      centered={true}
      width={320}
      mask={true}
      onCancel={onCancel}
      footer={null}
    >
      <div style={{ textAlign: "center" }} className="loginFormWrapper">
        {/*<img src="/images/login_logo.png" alt="" />*/}
        <span className="title">Login</span>
        <div className="LoginForm">
          <Form onFinish={handleSubmit} preserve={false}>
            <Form.Item
              name="username"
              rules={[{ required: true, message: "please input username" }]}
            >
              <Input placeholder="username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "please input password" }]}
            >
              <Input placeholder="password" type="password" />
            </Form.Item>
            <Button block type="primary" htmlType="submit" className="loginButton">
              Login
            </Button>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default Login;
