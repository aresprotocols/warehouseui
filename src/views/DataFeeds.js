const DataFeeds = props => {
	return (<div className="dataFeedsLayout">
		<div className="titleBlock">
			<h2>Cryptocurrency (USD Pairs) Data Feeds</h2>
			<h6>Explore the decentralizen oracle networks powered by <a href="">Ares Protocol</a></h6>
		</div>

		<div className="scorePanel">
			<div className="scorePanelContent">
				<div className="scoreTitle">
					<span>
						<img src="/images/ares.png" />
					</span>

					<span>ARS/USD</span>
				</div>

				<div className="scoreItem">
					<div>$0.045</div>
					<div>last price</div>
				</div>

				<div className="scoreItem">
					<div>$0.045</div>
					<div>last price</div>
				</div>

				<div className="scoreItem">
					<div>$0.045</div>
					<div>last price</div>
				</div>

				<div className="scoreItem">
					<div>$0.045</div>
					<div>last price</div>
				</div>
			</div>
		</div>
	</div>)
};

export default DataFeeds;