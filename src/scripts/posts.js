export default (e, elements, watchedState) => {
  const el = e.target;
  const state = watchedState;
  const { viewedPostsIds } = state.ui;

  if (el.dataset.postId) {
    const id = el.dataset.postId;
    const hasViewedId = viewedPostsIds.includes(id);

    if (!hasViewedId) {
      state.ui.viewedPostsIds = [...viewedPostsIds, id];
    }

    if (el.tagName === 'BUTTON') {
      state.ui.modal.renderId = id;
    }
  }
};
