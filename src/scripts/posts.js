const isExistId = (collection, id) => collection.includes(id);

export default (e, elements, watchedState) => {
	const el = e.target;
	const state = watchedState;
	
	if (el.dataset.postId) {
		const id = el.dataset.postId;
		const hasId = isExistId(state.ui.viewedPostsIds, id);

		if (!hasId) {
			state.ui.viewedPostsIds = [...state.ui.viewedPostsIds, id];
		}
	}
};
