import uniqWith from 'lodash/uniqWith';
import parse from '../utils/parse.js';
import api from './api.js';

const toFillingStateFeeds = (watchState, newFeed) => {
  const state = watchState;
  const feeds = [...state.feeds, newFeed];
  const mergedFeeds = uniqWith(feeds, (prev, curr) => {
    if (prev.title === curr.title) {
      const current = curr;
      current.description = prev.description;
      current.posts = prev.posts;
      return true;
    }
    return false;
  });
  
  state.feeds = mergedFeeds;
  return true;
};

export default (watchedState, i18nInstance, url, isUpdate = null) => {
  const state = watchedState;

  api(url)
    .then((response) => {
      state.form.process.status = 'sending';
      return response.data.contents;
    })
    .then((content) => {
      const rssContent = parse(content);
      
      if (!rssContent) {
        state.form.process.info = i18nInstance.t('errors.rss');
        state.form.process.status = 'error';
      }

      if (rssContent) {
        toFillingStateFeeds(state, rssContent);
        
        const isUrlExist = state.urls.includes(url);
        if (!isUrlExist) {
          state.urls = [...state.urls, url];
        }

        state.form.process.status = 'sent';
        state.update.isUpdate = isUpdate;
        state.form.process.info = i18nInstance.t('network.success.rss');
      }
    })
    .catch((err) => {
      if (err.request) {
        state.form.process.info = i18nInstance.t('network.error.request');
      } else {
        state.form.process.info = i18nInstance.t('network.error.default');
      }
      state.form.process.status = 'error';
      throw err;
    });
};
