import './App.css';
import Header from './views/Header';
import DataFeeds from './views/DataFeeds';
import DataTable from './views/DataTable';
import { useEffect, useState } from 'react';
import God from './God';
import Footer from './views/Footer';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    God.fetchData(res => setData(res));
  }, []);

  return (
    <div className="App">
      <Header />
      <DataFeeds />
      <DataTable data={data} />
      <Footer />
    </div>
  );
}

export default App;
