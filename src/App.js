import logo from './logo.svg';
import './App.css';
import Header from './views/Header';
import DataFeeds from './views/DataFeeds';
import DataTable from './views/DataTable';
import God from './God';

const data = [
  {
    id: 0,
    logo: "/images/eth.png",
    title: "ETH/USD",
    price: 3978.20,
    isActived: true,
    resources: [God.Resources.uniswap]
  }
];

function App() {
  return (
    <div className="App">
      <Header />
      <DataFeeds />
      <DataTable data={data} />
    </div>
  );
}

export default App;
