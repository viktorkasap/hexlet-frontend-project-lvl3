import * as yup from 'yup';
import onChange from 'on-change';
import keyBy from 'lodash/keyBy';
import isEmpty from 'lodash/isEmpty';
import api from './api';
import render from './render';

const schema = yup.object().shape({
  url: yup.string().url('Некорректный адрес URL').required('Не должно быть пустым'),
});

const validate = (fields) => schema
  .validate(fields, { abortEarly: false })
  .then(() => ({}))
  .catch((err) => keyBy(err.inner, 'path'));

export default () => {
  const elements = {
    form: document['form-search'],
    fields: {
      url: () => elements.form.elements.url,
    },
    submit: () => elements.form.elements.submit,
    errors: {
      url: document.querySelector('.text-danger__url'),
    },
  };

  const state = {
    form: {
      valid: null,
      process: {
        state: 'filling',
        error: null,
      },
      fields: {
        url: null,
      },
      errors: {},
    },
    content: [],
  };

  const watchedState = onChange(state, render(elements));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    // FILL FIELDS VALUES OF STATE
    Object.entries(elements.fields).forEach(([name, element]) => {
      const value = element().value.trim();
      watchedState.form.fields[name] = value;
    });

    // ERRORS
    const errors = validate(state.form.fields);
    errors.then((data) => {
      watchedState.form.errors = data;
      watchedState.form.valid = isEmpty(data);

      // AXIOS GET DATA OF LINK
      if (watchedState.form.valid) {
        api(watchedState, watchedState.form.fields.url);
      }
    });
  });
};
