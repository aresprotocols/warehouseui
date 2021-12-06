const LoginForm = props => {
	return (<div className="loginFormLayout">
		<img src="/images/logo.png" />

		<input type="text" className="userNameInput" placeholder="User Name" />

		<input type="password" className="passwordInput" placeholder="Password" />

		<button className="loginButton" onClick={props.onClickLogin}>Login In</button>
	</div>);
};

export default LoginForm;