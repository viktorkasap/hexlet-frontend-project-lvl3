const feeds = (document) => {
	console.log('document--->', document);
	
	const titleEl = document.querySelector('title');
	const title = titleEl.textContent;
	
	const descriptionEl = document.querySelector('description');
	const description = descriptionEl.textContent;
	
	const items = document.querySelectorAll('item');
	const posts = [...items].map((item) => {
		const titleEl = item.querySelector('title');
		const title = titleEl.textContent;
		
		const descriptionEl = item.querySelector('description');
		const description = descriptionEl.textContent;
		
		const linkEl = item.querySelector('link');
		const link = linkEl.textContent;
		
		return {title, description, link};
	});

	return {title, description, posts};
}

export default (content) => {
	const parser = new DOMParser();
	const document = parser.parseFromString(content, 'application/xml');
	const hasError = document.querySelector('parsererror');
	
	return hasError ? false : feeds(document);
}
