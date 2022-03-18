import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';

const classes = {
	sent: {
		message: 'text-success',
		url: null,
	},
	error: {
		message: 'text-danger',
		url: 'is-invalid',
	},
};

const statusType = (type) => type === 'error' ? 'sent' : 'error';

const handleProcessState = (elements, status) => {
	const {submit, form} = elements;
	const {url: inputUrl} = form;
	
	switch (true) {
		case status ==='sending':
			submit.disabled = true;
			inputUrl.readOnly = true;
			break;

		case status ==='error' || status === 'sent':
			submit.disabled = false;
			inputUrl.readOnly = false;
			break;
			
		default:
			break;
	}
};

const rendeStatus = (elements, status, info) => {
	if (!status || !info) return;

	const {message} = elements;
	const {url: inputUrl} = elements.fields;
	const messageInfo = isObject(info)
		? info.url.message
		: info;
	
	message.innerHTML = '';
	message.textContent = messageInfo;
	
	message.classList.remove(classes[statusType(status)].message);
	message.classList.add(classes[status].message);
	
	const urlClsToRemove = classes[statusType(status)].url;
	const urlClsToAdd = classes[status].url;
	if (urlClsToRemove) {
		inputUrl.classList.remove(urlClsToRemove);
	}
	inputUrl.classList.add(classes[status].url);
};

export default (state, elements, i18nInstance) => (path, value, prevValue) => {
	// console.log('\nPATH', path);
	// console.log('VALUE', value, '\n');
	
	const {status, info} = state.form.process;
	if ( path === 'form.process.status'
		|| path === 'form.process.info'
		&& value !== 'sending'
	) {
		rendeStatus(elements, status, info);
	}
	
	if ( value === 'error'
		|| value === 'sending'
		|| value === 'sent'
	) {
		handleProcessState(elements, value);
	}
};
