import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StockChart from '../components/StockChart';
import StockData from '../components/StockData';
import finnHub from '../api/finnHub';

const formatData = (data) => {
  return data.t.map((el, index) => {
    return {
      x: el * 1000,
      y: Math.floor(data.c[index]),
    };
  });
};

const StockDetail = () => {
  const { stock } = useParams();
  const [chartData, setChartData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const date = new Date();
      const currentTime = Math.floor(date.getTime() / 1000);
      let oneDayAgo;

      // Because stocks market closes at friday, we have to check which day is currently
      // and then return the data from the last available day the market was open.
      if (date.getDay() === 6) {
        oneDayAgo = currentTime - 48 * 60 * 60;
      } else if (date.getDay() === 7) {
        oneDayAgo = currentTime - 72 * 60 * 60;
      } else {
        oneDayAgo = currentTime - 24 * 60 * 60;
      }

      const oneWeekAgo = currentTime - 7 * 24 * 60 * 60;
      const oneYearAgo = currentTime - 365 * 24 * 60 * 60;

      try {
        const responses = await Promise.all([
          finnHub.get('/stock/candle', {
            params: {
              symbol: stock,
              from: oneDayAgo,
              to: currentTime,
              resolution: 30,
            },
          }),
          finnHub.get('/stock/candle', {
            params: {
              symbol: stock,
              from: oneWeekAgo,
              to: currentTime,
              resolution: 60,
            },
          }),
          finnHub.get('/stock/candle', {
            params: {
              symbol: stock,
              from: oneYearAgo,
              to: currentTime,
              resolution: 'W',
            },
          }),
        ]);
        setChartData({
          day: formatData(responses[0].data),
          week: formatData(responses[1].data),
          year: formatData(responses[2].data),
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [stock]);

  return (
    <div>
      {chartData && (
        <div>
          <StockChart chartData={chartData} symbol={stock} />
          <StockData symbol={stock}/>
        </div>
      )}
    </div>
  );
};

export default StockDetail;
