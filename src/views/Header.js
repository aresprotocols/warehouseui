const Header = (props) => {
  return (
    <header className="App-header">
      <div className="headerLayout">
        <img src="/images/logo.png" />
        <div className="headerRight">
          <span>Home</span>
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
