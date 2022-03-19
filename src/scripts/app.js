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
          { title: 'Где и как искать работу в IT / Трудоустройство', description: 'Цель: Узнать как правильно изменять базу данных, так чтобы не было больно', link: 'https://ru.hexlet.io/courses/production-basics/lessons/database/theory_unit' },
          { title: 'post3', description: 'content post3', link: 'link post3' },
          { title: 'post4', description: 'content post4', link: 'link post4' },
          { title: 'post5', description: 'content post4', link: 'link post5' },
          { title: 'Организации работы с базой данных / Продакшен и Деплой', description: 'content post1', link: 'link post1' },
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
