const fillingStateConent = (state, document) => {
	console.log('state--->', state);
	console.log('document--->', document);
	
	// TODO заполнить данными state
}

export default (state, content) => {
	const parser = new DOMParser();
	const rssDocument = parser.parseFromString(content, 'application/xml');
	const hasError = rssDocument.querySelector('parsererror');
	
	if (!hasError) {
		fillingStateConent(state, rssDocument);
	}
	
	return !hasError;
}
