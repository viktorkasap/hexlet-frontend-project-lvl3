import * as yup from 'yup';
import axios from 'axios';
import onChange from 'on-change';

const schema = yup.object().shape({
	url: yup.string().url().required('Не должно быть пустым'),
});

const render = (elements) => (path, value, prevValue) => {
	console.log('elements', elements);
	console.log('path', path);
	console.log('value', value);
	console.log('prevValue', prevValue);
};

export default () => {
	const elements = {
		form: document['form-search'],
	};
	
	const state = {
		form: {
			valid: false,
			fields: {
				urL: null
			},
			errors: {}
		}
	};
	
	const watchedState = onChange(state, render(elements));
	
	// const formSearch = elements.form;
	//
	// const formSearchHamdler = (e, form) => {
	// 	e.preventDefault();
	// 	const url = form.elements.url;
	// 	console.log('form', form);
	// 	console.log( form.elements.url)
	// }
	//
	// formSearch.addEventListener('submit', (e) => formSearchHamdler(e, formSearch));
	
	elements.form.addEventListener('submit', (e) => {
		e.preventDefault();
		
		const input = elements.form.elements.url;

		

	});
};
