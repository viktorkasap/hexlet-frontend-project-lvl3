import getRss from './getRss';

let count = 0;

const updateRss = (state, i18nInstance) => {
  console.log('update rss', (count += 1));

  const { urls } = state;

  urls.forEach((url) => getRss(state, i18nInstance, url));

  setTimeout(() => updateRss(state, i18nInstance), state.update.interval);
};

export default updateRss;
