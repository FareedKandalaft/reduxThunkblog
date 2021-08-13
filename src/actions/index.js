import _ from 'lodash';
import jsonPlaceholder from '../apis/jsonPlaceholder';

export const fetchPostsAndUsers = () => async (dispatch, getState) => {
  await dispatch(fetchPosts());

  // without .chain()
  // const userIds = _.uniq(_.map(getState().posts, 'userId'));
  // userIds.forEach((id) => dispatch(fetchUser(id)));

  // using lodash chain()
  _.chain(getState().posts)
    .map('userId')
    .uniq()
    .forEach((id) => dispatch(fetchUser(id)))
    .value(); // lodash will only complete the chain when you end the chain with .value()
};

export const fetchPosts = () => async (dispatch) => {
  const resp = await jsonPlaceholder.get('/posts');

  dispatch({
    type: 'FETCH_POSTS',
    payload: resp.data,
  });
};

export const fetchUser = (id) => async (dispatch) => {
  const resp = await jsonPlaceholder.get(`/users/${id}`);
  dispatch({ type: 'FETCH_USER', payload: resp.data });
};

// in order to memoize the inner function you first need to
// refactor the inner function into a standalone _.memoize
// and then call that from the action creator
// export const fetchUser = id => dispatch => _fetchUser(id, dispatch);
// const _fetchUser = _.memoize(async (id, dispatch) => {
//   const resp = await jsonPlaceholder.get(`/users/${id}`);
//   dispatch({ type: 'FETCH_USER', payload: resp.data, });
// });
