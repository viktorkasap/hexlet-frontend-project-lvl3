import uniq from 'lodash/uniq.js';
import uniqWith from 'lodash/uniqWith.js';
import isEmpty from 'lodash/isEmpty.js';
import onChange from 'on-change';
import i18n from 'i18next';
import validate from './utils/validate.js';
import resources from './locales/index.js';
import parse from './utils/parse.js';
import render from './render.js';
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
};

const getRss = (watchedState, i18nInstance, url) => {
  const state = watchedState;

  api(url)
    .then((response) => {
      toFillingStateFeeds(state, parse(response.data.contents));
      state.urls = uniq([...state.urls, url]);
      state.status.success = 'network.success.rss';
      state.form.status = 'success';
    })
    .catch((err) => {
      if (err.request) {
        state.status.error = 'network.error.request';
      }

      if (err.type === 'parse') {
        state.status.error = 'errors.rss';
      }

      state.form.status = 'error';
    });
};

const updateRss = (watchedState, i18nInstance) => {
  const state = watchedState;
  const { urls } = state;

  const promises = urls.map((url) => api(url)
    .then((response) => {
      state.update.isUpdate = 'update';
      toFillingStateFeeds(state, parse(response.data.contents));
    }));

  Promise.all(promises)
    .finally(() => {
      setTimeout(() => {
        updateRss(state, i18nInstance);
      }, state.update.interval);
    });
};

const postsHandler = (e, elements, watchedState) => {
  const state = watchedState;
  const { target: el } = e;
  const { viewedPostsIds } = state.ui;

  if (el.dataset.postId) {
    const { postId: id } = el.dataset;
    const hasViewedId = viewedPostsIds.includes(id);

    if (!hasViewedId) {
      state.ui.viewedPostsIds = [...viewedPostsIds, id];
    }

    if (el.tagName === 'BUTTON') {
      state.ui.modal.renderId = id;
    }
  }
};

const formHandler = (e, elements, watchedState, i18nInstance) => {
  e.preventDefault();

  const state = watchedState;
  const { form } = elements;
  const formData = new FormData(form);

  state.status.error = null;
  state.status.success = null;
  state.update.isUpdate = null;
  state.form.status = 'sending';

  Object.entries(elements.fields).forEach(([name]) => {
    state.form.fields[name] = formData.get(name).trim();
  });

  const process = validate(state.form.fields, state.urls, i18nInstance);
  process
    .then((validData) => {
      state.form.valid = isEmpty(validData);

      if (!state.form.valid) {
        state.status.error = validData;
        state.form.status = 'error';
        return;
      }

      const { url } = state.form.fields;
      getRss(state, i18nInstance, url);
    });
};

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    fields: {
      url: document.getElementById('url-input'),
    },
    submit: document.getElementById('submit'),
    message: document.querySelector('.text-danger'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
    modal: {
      title: document.querySelector('.modal-title'),
      body: document.querySelector('.modal-body'),
      link: document.querySelector('.full-article'),
    },
  };

  const state = {
    lng: 'ru',
    form: {
      valid: null,
      fields: {
        url: null,
      },
      status: null,
    },
    status: {
      error: null,
      success: null,
    },
    urls: [],
    feeds: [],
    ui: {
      viewedPostsIds: [],
      modal: {
        renderId: null,
      },
    },
    update: {
      interval: 5000,
      isUpdate: null,
    },
  };

  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: state.lng,
    debug: true,
    resources,
  });

  const { form: formEl, posts: postsEl } = elements;
  const watchedState = onChange(state, render(state, elements, i18nInstance));

  formEl.addEventListener('submit', (e) => {
    formHandler(e, elements, watchedState, i18nInstance);
    // console.log('watchedState', watchedState);
  });

  postsEl.addEventListener('click', (e) => {
    postsHandler(e, elements, watchedState);
  });

  setTimeout(() => updateRss(watchedState, i18nInstance), state.update.interval);
};
