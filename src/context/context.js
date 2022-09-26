import { createContext, useState, useEffect } from 'react';

export const StocksContext = createContext();

export const StocksContextProvider = ({ children }) => {
  const [stockList, setStockList] = useState(
    localStorage.getItem('stockList')?.split(',') || ['GOOGL', 'MSFT']
  );

  useEffect(() => {
    localStorage.setItem('stockList', stockList);
  }, [stockList]);

  const addStock = (stock) => {
    // Check if it's already in the stock list
    if (stockList.indexOf(stock) === -1) {
      setStockList([...stockList, stock]);
    }
  };

  const deleteStock = (stock) => {
    const filteredStockList = stockList.filter((el) => el !== stock);
    setStockList(filteredStockList);
  };

  return (
    <StocksContext.Provider value={{ stockList, addStock, deleteStock }}>
      {children}
    </StocksContext.Provider>
  );
};
