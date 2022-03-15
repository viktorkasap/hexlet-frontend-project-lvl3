import isEqual from 'lodash/isEqual';

const renderErrors = (elements, value, prevValue) => {
  const { form } = elements;
  const input = elements.fields.url();

  Object.entries(value).forEach(([name, error]) => {
    // ADD CLASS ERROR
    elements.fields[name]().classList.add('is-invalid');

    // SHOW ERRORS
    const errorEl = elements.errors[name];
    errorEl.innerHTML = '';
    errorEl.textContent = error.message;
  });
};

export default (elements) => (path, value, prevValue) => {
  // path form.fields.url
  console.log('PATH --->', path);
  console.log('VALUE --->', value);
  console.log('PREV VALUE --->', prevValue);
  console.log('\n---\n');

  // path form.errors
  switch (true) {
    case path === 'form.errors' && !isEqual(value, prevValue):
      renderErrors(elements, value, prevValue);
      break;

    default:
      break;
  }
};
