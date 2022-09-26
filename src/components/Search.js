import { useState, useEffect, useContext } from 'react';
import { StocksContext } from '../context/context';
import finnHub from '../api/finnHub';

const Search = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  const { addStock } = useContext(StocksContext);

  const onClicked = (symbol) => {
    addStock(symbol);
    setSearch('');
  };

  const showDropdown = () => {
    const dropdownClass = search.length >= 3 ? 'show' : null;
    return (
      <ul
        style={{
          height: '500px',
          overflowY: 'scroll',
          overflowX: 'hidden',
          cursor: 'pointer',
        }}
        className={`dropdown-menu ${dropdownClass}`}
      >
        {results.map((res) => {
          return (
            <li
              className="dropdown-item"
              key={res.symbol}
              onClick={() => {
                onClicked(res.symbol);
              }}
            >
              {res.description} ({res.symbol})
            </li>
          );
        })}
      </ul>
    );
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await finnHub.get('/search', {
          params: {
            q: search,
          },
        });
        if (isMounted) {
          setResults(response.data.result);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (search.length >= 3) {
      fetchData();
    } else {
      setResults([]);
    }
    return () => (isMounted = false);
  }, [search]);

  return (
    <div className="w-50 p-5 rounded mx-auto">
      <div className="form-floating dropdown">
        <input
          style={{ backgroundColor: 'rgba(145, 158, 170, 0.04' }}
          id="search"
          type="text"
          className="form-control"
          placeholder="Enter a stock name..."
          autoComplete="off"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        ></input>
        <label htmlFor="search">Search</label>
        {results && showDropdown()}
      </div>
    </div>
  );
};

export default Search;
