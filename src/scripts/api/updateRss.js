import getRss from './getRss.js';

const updateRss = (state, i18nInstance) => {
  const { urls } = state;

  urls.forEach((url) => getRss(state, i18nInstance, url, 'update'));

  setTimeout(() => updateRss(state, i18nInstance), state.update.interval);
};

export default updateRss;
