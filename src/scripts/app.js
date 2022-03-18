import render from './render';
import onChange from 'on-change';
import formHandler from './form';
import i18n from 'i18next';
import resources from './locales/index';

export default () => {
	const elements = {
		form: document['form-search'],
		fields: {
			url: document.getElementById('url-input'),
		},
		submit: document.getElementById('submit'),
		message: document.querySelector('.text-danger')
	};
	
	const state = {
		lng: "ru",
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
		content: [],
	};
	
	const i18nInstance = i18n.createInstance();
	i18nInstance.init({
		lng: state.lng,
		debug: true,
		resources
	});
	
	const { form } = elements;
	const watchedState = onChange(state, render(state, elements, i18nInstance));
	
	form.addEventListener('submit', (e) => formHandler(e, form, elements, watchedState, i18nInstance));
};
