const Header = props => {
	return (<header className="App-header">
		<div className="headerLayout">
			<img src="/images/logo.png" />

			<div>
				<select className="selectWithoutBorder">
					<option>English</option>
				</select>

				<span>&nbsp;&nbsp;</span>

				<button className="blueButton" onClick={props.onClickLogin}>Login</button>
			</div>
		</div>
	</header>)
};

export default Header;