import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StockOverview from './pages/StockOverview';
import StockDetail from './pages/StockDetail';
import { StocksContextProvider } from './context/context';
import './App.css';
import Nav from './components/Nav';

function App() {
  return (
    <main className="container">
      <StocksContextProvider>
        <BrowserRouter>
          <Nav />
          <Routes>
            <Route path="/" element={<StockOverview />} />
            <Route path="/detail/:stock" element={<StockDetail />} />
          </Routes>
        </BrowserRouter>
      </StocksContextProvider>
    </main>
  );
}

export default App;
