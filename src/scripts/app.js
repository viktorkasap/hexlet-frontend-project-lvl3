import onChange from 'on-change';
import i18n from 'i18next';
import render from './view/render.js';
import formHandler from './controllers/form.js';
import postsHandler from './controllers/posts.js';
import resources from './locales/index.js';
import updateRss from './api/updateRss.js';

export default () => {
  const elements = {
    form: document['form-search'],
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
      process: {
        info: null,
        status: null,
      },
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

  window.addEventListener('DOMContentLoaded', () => {
    const { form: formEl, posts: postsEl, submit } = elements;
    const watchedState = onChange(state, render(state, elements, i18nInstance));

    /*
    formEl.addEventListener('submit', (e) => {
      formHandler(e, formEl, elements, watchedState, i18nInstance)
    });
     */
    submit.addEventListener('click', (e) => {
      formHandler(e, formEl, elements, watchedState, i18nInstance);
    });
    postsEl.addEventListener('click', (e) => postsHandler(e, elements, watchedState));
    setTimeout(() => updateRss(watchedState, i18nInstance), state.update.interval);
  });
};
