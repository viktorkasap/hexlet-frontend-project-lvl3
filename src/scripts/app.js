import * as yup from 'yup';
import axios from 'axios';
import onChange from 'on-change';
import keyBy from 'lodash/keyBy.js';
import isEmpty from 'lodash/isEmpty.js';
import isEqual from 'lodash/isEqual.js';

const errorMessages = {
	network: {
		error: 'Network Problems. Try again.',
	},
};

const schema = yup.object().shape({
	url: yup.string().url('Некорректный адрес URL').required('Не должно быть пустым'),
});

const validate = (fields) => {
	try {
		schema.validateSync(fields, { abortEarly: false });
		return {};
	} catch (e) {
		return keyBy(e.inner, 'path');
	}
	// schema.validate(fields)
	// 	.then((data) => console.log('DATA', data))
	// 	.catch((err) => console.log('ERR', err))
};

const renderErrors = (elements, value, prevValue) => {
	const form = elements.form;
	const input = elements.fields.url();
	
	
	Object.entries(value).forEach(([name, data]) => {
		// ADD CLASS ERROR
		elements.fields[name]().classList.add('is-invalid');
		
		// SHOW ERRORS
		const errorEl = elements.errors[name];
		errorEl.innerHTML = '';
		errorEl.textContent = data.message;
	});
};

const render = (elements) => (path, value, prevValue) => {
	
	// path form.fields.url
	
	// path form.errors
	switch (true) {
		case path ==='form.errors' && !isEqual(value, prevValue):
			renderErrors(elements, value, prevValue);
			break;
			
		default:
			break;
	}
};

export default () => {
	const elements = {
		form: document['form-search'],
		fields: {
			url: () => elements.form.elements.url,
		},
		submit: () => elements.form.elements.submit,
		errors: {
			url: document.querySelector('.text-danger__url')
		}
	};
	
	const state = {
		form: {
			valid: null,
			process: {
				state: 'filling',
				error: null
			},
			fields: {
				url: null
			},
			errors: {}
		},
		content: []
	};
	
	const watchedState = onChange(state, render(elements));
	
	elements.form.addEventListener('submit', (e) => {
		e.preventDefault();

		// VALUES
		Object.entries(elements.fields).forEach(([name, element]) => {
			const value = element().value.trim();
			watchedState.form.fields[name] = value;
		});
		
		// ERRORS
		const errors = validate(state.form.fields);
		watchedState.form.errors = errors;
		watchedState.form.valid = isEmpty(errors);
		
		// AXIOS
		if (watchedState.form.valid) {
			try {
				axios.get(value)
					.then((response) => {
						console.log(response.data);
						// watchedState.conent = [...watchedState.conent, response.data]
					});
				
				watchedState.form.process.state = 'sending';
				state.form.process.error = null;
			}
			catch (err) {
				watchedState.form.process.state = 'sending';
				state.form.process.error = errorMessages.network.error;
				throw err;
			}
		}
	});
};
