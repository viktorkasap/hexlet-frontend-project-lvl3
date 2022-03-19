import onChange from 'on-change';
import i18n from 'i18next';
import render from './render';
import formHandler from './form';
import resources from './locales/index';

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
    feeds: [
      {
        title: 'Deutsche Welle: DW.COM News',
        description: 'News',
        posts: [
          { title: 'post3', description: 'content post3', link: 'link post3' },
          { title: 'post4', description: 'content post4', link: 'link post4' },
          { title: 'post5', description: 'content post4', link: 'link post5' },
        ],
      },
      {
        title: 'Deutsche Welle: DW.COM News2',
        description: 'News',
        posts: [
          { title: 'post3', description: 'content post3', link: 'link post3' },
          { title: 'post4', description: 'content post4', link: 'link post4' },
          { title: 'post5', description: 'content post4', link: 'link post5' },
        ],
      },
      {
        title: 'Deutsche Welle: DW.COM News',
        description: 'News',
        posts: [
          { title: 'post6', description: 'content post3', link: 'link post3' },
          { title: 'post7', description: 'content post4', link: 'link post4' },
          { title: 'post8', description: 'content post4', link: 'link post5' },
        ],
      },
    ],
  };

  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: state.lng,
    debug: true,
    resources,
  });

  const { form } = elements;
  const watchedState = onChange(state, render(state, elements, i18nInstance));

  form.addEventListener('submit', (e) => formHandler(e, form, elements, watchedState, i18nInstance));
};
