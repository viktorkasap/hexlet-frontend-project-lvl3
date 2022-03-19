import axios from 'axios';

const buildUrl = (url) => {
  const proxy = 'https://allorigins.hexlet.app';
  const path = 'get';

  const newUrl = new URL(path, proxy);
  newUrl.searchParams.append('disableCache', 'true');
  newUrl.searchParams.append('url', url);

  return newUrl.href;
};
// https://allorigins.hexlet.app/get?disableCache=true&url=https%3A%2F%2Fru.hexlet.io%2Flessons.rss
export default (url) => axios.get(buildUrl(url));
