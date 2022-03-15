import * as yup from 'yup';
import onChange from 'on-change';
import keyBy from 'lodash/keyBy';
import isEmpty from 'lodash/isEmpty';
import api from './api';
import render from './render';

const errorMessages = {
	network: {
		error: {
			request:  'Ресурс не доступен',
			default: 'Неизвестная ошибка. Что-то пошло не так.',
		},
	},
};

const schema = (urls) => yup.object().shape({
	url: yup.string()
		.url('Некорректный адрес URL')
		.notOneOf(urls, 'URL уже существует')
		.required('Поле не должно быть пустым'),
});

const validate = (fields, urls) => schema(urls) // const validate = (fields, urls) => schema
	.validate(fields, {abortEarly: false})
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
		urls: [],
		content: [],
	};
	
	const watchedState = onChange(state, render(elements));
	
	elements.form.addEventListener('submit', (e) => {
		e.preventDefault();
		const formData = new FormData(elements.form);
		
		// FILL FIELDS VALUES OF STATE
		Object.entries(elements.fields).forEach(([name, element]) => {
			watchedState.form.fields[name] = formData.get(name).trim();
		});
		
		// ERRORS
		const errors = validate(state.form.fields, watchedState.urls);
		errors.then((data) => {
			watchedState.form.errors = data;
			watchedState.form.valid = isEmpty(data);
			
			// AXIOS GET DATA OF LINK
			if (watchedState.form.valid) {
				// + TODO #1 вытащить из апи изменения стейтов
				// + TODO #2 сделать список урлов
				// + TODO #3 валидаця на наличие ура в списке урлов
				
				const url = watchedState.form.fields.url;
				api(url)
					.then((response) => {
						watchedState.form.process.state = 'sending';
						watchedState.form.process.error = null;
						return response.data;
					})
					.then((data) => {
						watchedState.content = [...state.content, data];
						watchedState.urls = [...watchedState.urls, url];
						watchedState.form.process.state = 'sent';
						console.log(state);
					})
					.catch((err) => {
						watchedState.form.process.state = 'error';

						if (err.request) {
							console.log('REQUEST\n', errorMessages.network.error.request);
							watchedState.form.process.error = errorMessages.network.error.request;
						} else {
							console.log('MESSAGE\n', err.message);
							watchedState.form.process.error = errorMessages.network.error.default;
						}
					});
			}
		});
	});
};
