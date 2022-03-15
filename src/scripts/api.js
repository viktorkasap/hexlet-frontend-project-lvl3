import axios from 'axios';
import render from './render';

const errorMessages = {
  network: {
    error: 'Network Problems. Try again.',
  },
};

export default (watchedState, url) => {
  const state = watchedState;

  try {
    axios
      .get(url)
      .then((response) => {
        state.form.process.state = 'sending';
        state.form.process.error = null;
        return response.data;
      })
      .then((data) => {
        state.content = [...state.content, data];
        render(data);
        console.log('AXIOS DONE --->', data);
      });
  } catch (err) {
    state.form.process.state = 'sending';
    state.form.process.error = errorMessages.network.error;
    throw err;
  }
};
