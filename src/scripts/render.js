import isEqual from 'lodash/isEqual';

const clearErrors = (elements) => {
  const {form} = elements;
  const {fields} = elements;

  Object.entries(fields).forEach(([name, el]) => {
    // REMOVE CLASS ERROR
    el().classList.remove('is-invalid');

    // HIDE ERRORS
    const errorEl = elements.errors[name];
    errorEl.innerHTML = '';
  });
}

const renderErrors = (elements, value, prevValue) => {
  const { form } = elements;
  
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
  // console.log('PATH --->', path);
  // console.log('VALUE --->', value);
  // console.log('PREV VALUE --->', prevValue);
  // console.log('\n---\n');
  
  // path form.errors
  switch (true) {
    case path === 'form.errors' && !isEqual(value, prevValue):
      console.log('RENDER ERRORS')
      renderErrors(elements, value, prevValue);
      break;
      
    case value === 'sent':
      clearErrors(elements);
      break;

    default:
      break;
  }
  

  
  
};
