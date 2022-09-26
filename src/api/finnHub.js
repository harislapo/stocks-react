import axios from 'axios';

const TOKEN = 'cciaueiad3ie5k93fa30';

export default axios.create({
  baseURL: 'https://finnhub.io/api/v1',
  params: {
    token: TOKEN,
  },
});
