const buildLiEl = () => {
	const li = document.createElement('li');
	li.classList.add(
		'list-group-item',
		'd-flex',
		'justify-content-between',
		'align-items-start',
		'border-0',
		'order-end-0');
	return li;
};

const buildButtonEl = (i18nInstance) => {
	const button = document.createElement('button');
	button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
	button.setAttribute('data-bs-toggle', 'modal');
	button.setAttribute('data-bs-target', 'modal');
	button.textContent = i18nInstance.t('ui.posts.button');
	return button;
};

const buildLinkEl = (link, text) => {
	const a = document.createElement('a');
	a.classList.add('fw-bold');
	a.target = '_blank';
	a.rel = 'noopener noreferrer';
	a.href = link;
	a.textContent = text;
	return a;
};

export default (feeds, i18nInstance) => {
	const items = feeds.map((item) => {
		const {posts} = item;
		return posts.map((postItem) => {
			const li = buildLiEl();
			const link = buildLinkEl(postItem.link, postItem.title);
			const button = buildButtonEl(i18nInstance);
			
			li.append(link);
			li.append(button);
			
			return li;
		});
	});
	
	console.log('items', items);
	
	const card = document.createElement('div');
	card.classList.add('card','border-0');
	
	const cardBody = document.createElement('div');
	cardBody.classList.add('card-body');
	
	const titleCard = document.createElement('h2');
	titleCard.textContent = i18nInstance.t('ui.posts.title');
	
	const list = document.createElement('ul');
	list.classList.add('list-group', 'border-0','rounded-0');
	
	items.flat().forEach((item) => {
		list.append(item);
	});
	
	cardBody.append(titleCard);
	card.append(list);
	
	console.log(list)
	return card;
}
