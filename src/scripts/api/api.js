import axios from 'axios';

const buildUrl = (url) => {
  const proxy = 'https://allorigins.hexlet.app';
  const path = 'get';

  const newUrl = new URL(path, proxy);
  newUrl.searchParams.append('disableCache', 'true');
  newUrl.searchParams.append('url', url);

  return newUrl.href;
};

// export default (url) => axios.get(buildUrl(url));
export default (url) => axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${url}`);

