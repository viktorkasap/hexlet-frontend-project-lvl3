import isEmpty from 'lodash/isEmpty';
import validate from './validate';
import api from './api';

export default (e, form, elements, watchedState, i18nInstance) => {
  e.preventDefault();

  const state = watchedState;
  const formData = new FormData(form);

  // FILL FIELDS VALUES OF STATE
  Object.entries(elements.fields).forEach(([name, element]) => {
    state.form.fields[name] = formData.get(name).trim();
  });

  // ERRORS
  const errors = validate(state.form.fields, state.urls, i18nInstance);
  errors
    .then((data) => {
      state.form.process.info = data;
      state.form.valid = isEmpty(data);
    })
    .then(() => {
      if (!state.form.valid) {
        state.form.process.status = 'error';
      }

      // AXIOS GET DATA OF LINK
      if (state.form.valid) {
        const { url } = state.form.fields;
        state.form.process.status = null;

        api(url)
          .then((response) => {
            console.log('\nsending url');
            state.form.process.status = 'sending';
            return response.data;
          })
          .then((data) => {
            state.content = [...state.content, data];
            state.urls = [...state.urls, url];
            state.form.process.status = 'sent';
            state.form.process.info = i18nInstance.t('network.success.rss');
          })
          .catch((err) => {
            if (err.request) {
              state.form.process.info = i18nInstance.t('network.error.request');
            } else {
              state.form.process.info = i18nInstance('network.error.default');
            }
            state.form.process.status = 'error';
          });
      }
    });

  console.log(state);
};
