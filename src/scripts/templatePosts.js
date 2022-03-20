// const buildLiEl = () => {
// 	const li = document.createElement('li');
// 	li.classList.add(
// 		'list-group-item',
// 		'd-flex',
// 		'justify-content-between',
// 		'align-items-start',
// 		'border-0',
// 		'order-end-0');
// 	return li;
// };
//
// const buildButtonEl = (i18nInstance, idx) => {
// 	const button = document.createElement('button');
// 	button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
// 	button.textContent = i18nInstance.t('ui.posts.button');
// 	button.dataset.bsToogle = 'modal';
// 	button.dataset.bsTarget = 'modal';
// 	button.dataset.id = idx;
// 	return button;
// };
//
// const buildLinkEl = (link, text, idx) => {
// 	const a = document.createElement('a');
// 	a.classList.add('fw-bold');
// 	a.rel = 'noopener noreferrer';
// 	a.dataset.id = idx;
// 	a.target = '_blank';
// 	a.textContent = text;
// 	a.href = link;
// 	return a;
// };
//
// export default (feeds, i18nInstance) => {
// 	const items = feeds.map((item, index) => {
// 		const {posts} = item;
// 		return posts.map((postItem, idx) => {
// 			const li = buildLiEl();
// 			const link = buildLinkEl(postItem.link, postItem.title, `${index}-${idx}`);
// 			const button = buildButtonEl(i18nInstance, `${index}-${idx}`);
//
// 			li.append(link);
// 			li.append(button);
//
// 			return li;
// 		});
// 	});
//
// 	const card = document.createElement('div');
// 	card.classList.add('card','border-0');
//
// 	const cardBody = document.createElement('div');
// 	cardBody.classList.add('card-body');
//
// 	const titleCard = document.createElement('h2');
// 	titleCard.textContent = i18nInstance.t('ui.posts.title');
//
// 	const list = document.createElement('ul');
// 	list.classList.add('list-group', 'border-0','rounded-0');
//
// 	items.flat().forEach((item) => {
// 		list.append(item);
// 	});
//
// 	cardBody.append(titleCard);
// 	card.append(list);
//
// 	return card;
// }

const items = (feeds, i18nInstance) => {
	
	return feeds.map((item, index) => {
		return item.posts.map((post, idx) => {
			return `
				<li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
					<a href="${post.link}"
					   class="fw-bold"
					   data-id="${index}-${idx}"
					   target="_blank"
					   rel="noopener noreferrer">${post.title}
					</a>
					<button type="button"
					        class="btn btn-outline-primary btn-sm"
					        data-id="${index}-${idx}"
					        data-bs-toggle="modal"
					        data-bs-target="#modal">${i18nInstance.t('ui.posts.button')}</button>
				</li>
			`;
		}).join('');
	}).join('');
};

export default (feeds, i18nInstance) => {
	return `
		<div class="card border-0">
      <div class="card-body">
      		<h2 class="card-title h4">
						${i18nInstance.t('ui.posts.title')}
					</h2>
      	</div>
    		<ul class="list-group border-0 rounded-0">
    			${items(feeds, i18nInstance)}
    		</ul>
    	</div>
	`;
}
