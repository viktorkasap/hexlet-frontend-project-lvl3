import validate from './utils/validate.js';
import resources from './locales/index.js';
import uniqWith from 'lodash/uniqWith.js';
import isEmpty from 'lodash/isEmpty.js';
import parse from './utils/parse.js';
import render from './render.js';
import onChange from 'on-change';
import api from './api.js';
import i18n from 'i18next';

const toFillingStateFeeds = (watchState, newFeed) => {
	const state = watchState;
	const feeds = [...state.feeds, newFeed];
	const mergedFeeds = uniqWith(feeds, (prev, curr) => {
		if (prev.title === curr.title) {
			const current = curr;
			current.description = prev.description;
			current.posts = prev.posts;
			return true;
		}
		return false;
	});
	
	state.feeds = mergedFeeds;
	return true;
};

const getRss = (watchedState, i18nInstance, url, isUpdate = null) => {
	const state = watchedState;
	state.form.process.status = 'sending';
	api(url)
		.then((response) => response.data.contents)
		.then((content) => {
			const rssContent = parse(content);
			
			if (!rssContent) {
				state.form.process.info = i18nInstance.t('errors.rss');
				state.form.process.status = 'error';
			}
			
			if (rssContent) {
				rssContent
					.then((data) => {
					toFillingStateFeeds(state, data);
					
					const isUrlExist = state.urls.includes(url);
					if (!isUrlExist) {
						state.urls = [...state.urls, url];
					}
					
					state.form.process.status = 'sent';
					state.update.isUpdate = isUpdate;
					state.form.process.info = i18nInstance.t('network.success.rss');
				})
			}
		})
		.catch((err) => {
			if (err.request) {
				state.form.process.info = i18nInstance.t('network.error.request');
			} else {
				state.form.process.info = i18nInstance.t('network.error.default');
			}
			state.form.process.status = 'error';
		});
};

const updateRss = (state, i18nInstance) => {
	const { urls } = state;
	
	urls.forEach((url) => getRss(state, i18nInstance, url, 'update'));
	
	setTimeout(() => updateRss(state, i18nInstance), state.update.interval);
};

const postsHandler = (e, elements, watchedState) => {
	const { target: el } = e;
	const state = watchedState;
	const { viewedPostsIds } = state.ui;
	
	if (el.dataset.postId) {
		const { postId: id } = el.dataset;
		const hasViewedId = viewedPostsIds.includes(id);
		
		if (!hasViewedId) {
			state.ui.viewedPostsIds = [...viewedPostsIds, id];
		}
		
		if (el.tagName === 'BUTTON') {
			state.ui.modal.renderId = id;
		}
	}
};

const formHandler = (e, elements, watchedState, i18nInstance) => {
	e.preventDefault();
	
	const state = watchedState;
	const {form} = elements;
	const formData = new FormData(form);
	
	// FILL FIELDS VALUES OF STATE
	Object.entries(elements.fields).forEach(([name]) => {
		state.form.fields[name] = formData.get(name).trim();
	});
	
	// ERRORS
	const process = validate(state.form.fields, state.urls, i18nInstance);
	process
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
				getRss(state, i18nInstance, url);
			}
		});
};

export default () => {
	const elements = {
		form: document.querySelector('.rss-form'),
		fields: {
			url: document.getElementById('url-input'),
		},
		submit: document.getElementById('submit'),
		message: document.querySelector('.text-danger'),
		posts: document.querySelector('.posts'),
		feeds: document.querySelector('.feeds'),
		modal: {
			title: document.querySelector('.modal-title'),
			body: document.querySelector('.modal-body'),
			link: document.querySelector('.full-article'),
		},
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
		feeds: [],
		ui: {
			viewedPostsIds: [],
			modal: {
				renderId: null,
			},
		},
		update: {
			interval: 5000,
			isUpdate: null,
		},
	};
	
	const i18nInstance = i18n.createInstance();
	i18nInstance.init({
		lng: state.lng,
		debug: true,
		resources,
	});
	
	const { form: formEl, posts: postsEl } = elements;
	const watchedState = onChange(state, render(state, elements, i18nInstance));
	
	formEl.addEventListener('submit', (e) => {
		formHandler(e, elements, watchedState, i18nInstance);
	});
	
	postsEl.addEventListener('click', (e) => {
		postsHandler(e, elements, watchedState);
	});
	
	setTimeout(() => updateRss(watchedState, i18nInstance), state.update.interval);
};
