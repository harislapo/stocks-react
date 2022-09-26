import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StocksContext } from '../context/context';
import finnHub from '../api/finnHub';
import { BsFillCaretDownFill, BsFillCaretUpFill } from 'react-icons/bs';

const StockList = () => {
  const [stock, setStock] = useState();
  const { stockList, deleteStock } = useContext(StocksContext);
  const navigate = useNavigate();

  const changeColor = (change) => {
    return change > 0 ? 'success' : 'danger';
  };

  const renderIcon = (change) => {
    return change > 0 ? <BsFillCaretUpFill /> : <BsFillCaretDownFill />;
  };

  const handleStockSelect = (symbol) => {
    navigate(`detail/${symbol}`);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        let responses = [];
        responses = await Promise.all(
          stockList.map((stock) => {
            return finnHub.get('/quote', {
              params: {
                symbol: stock,
              },
            });
          })
        );
        const data = responses.map((response) => {
          return {
            data: response.data,
            symbol: response.config.params.symbol,
          };
        });
        if (isMounted) {
          setStock(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    return () => (isMounted = false);
  }, [stockList]);

  return (
    <div>
      <table className="table hover mt-5">
        <thead style={{ color: 'rgb(80, 90, 102)' }}>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Last</th>
            <th scope="col">Chg</th>
            <th scope="col">Chg%</th>
            <th scope="col">High</th>
            <th scope="col">Low</th>
            <th scope="col">Open</th>
            <th scope="col">Pclose</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {stock &&
            stock.map((s) => {
              return (
                <tr
                  style={{ cursor: 'pointer' }}
                  className="table-row"
                  key={s.symbol}
                  onClick={() => {
                    handleStockSelect(s.symbol);
                  }}
                >
                  <th scope="row">{s.symbol}</th>
                  <td>{s.data.c}</td>
                  <td className={`text-${changeColor(s.data.d)}`}>
                    {s.data.d} {renderIcon(s.data.d)}
                  </td>
                  <td className={`text-${changeColor(s.data.dp)}`}>
                    {s.data.dp} {renderIcon(s.data.dp)}
                  </td>
                  <td>{s.data.h}</td>
                  <td>{s.data.l}</td>
                  <td>{s.data.o}</td>
                  <td>{s.data.pc}</td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteStock(s.symbol);
                      }}
                      className="btn btn-danger ml-3 btn-sm d-inline-block delete-button"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default StockList;
