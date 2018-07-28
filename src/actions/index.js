import { createAction } from 'redux-actions';
import { reset, change } from 'redux-form';
import getRssData from '../getter';

export const addToFeedsList = createAction('FEEDS_LIST_ADD', (url, title, id) => ({ url, title, id }));
export const updateFeedsList = createAction('FEEDS_LIST_UPDATE', (id, lastUpdate) => ({ id, lastUpdate }));
export const checkError = createAction('ERROR_CHECK', url => ({ url }));
export const deleteError = createAction('ERROR_DELETE', url => ({ url }));
export const addToItems = createAction('ITEMS_ADD', (items, feedId) => ({ items, feedId }));
export const addNewItems = createAction('NEW_ITEMS_ADD', (items, feedId) => ({ items, feedId }));
export const updateNextId = createAction('NEXT_ID_UPDATE', id => ({ id }));
export const removeFeed = createAction('FEED_REMOVE', id => ({ id }));
export const validateInput = createAction('INPUT_VALIDATE');
export const rejectInput = createAction('INPUT_REJECT');

export const changeInput = value => async (dispatch) => {
  dispatch(change('feed', 'feed', value));
};

export const addNewFeed = (feed, feedId) => async (dispatch) => {
  try {
    const { itemsData, feedTitle } = await getRssData(feed);
    dispatch(reset('feed'));
    dispatch(addToFeedsList(feed, feedTitle, feedId));
    dispatch(updateNextId(feedId));
    dispatch(addToItems(itemsData, feedId));
  } catch (e) {
    dispatch(checkError(feed));
  }
};

export const downloadOnStart = feedsList => async (dispatch) => {
  const feedsArray = Object.values(feedsList);
  feedsArray.forEach(async (feed) => {
    try {
      dispatch(addToFeedsList(feed.url, feed.title, feed.id));
      const { itemsData } = await getRssData(feed.url);
      dispatch(addToItems(itemsData, feed.id));
    } catch (e) {
      dispatch(checkError(feed.url));
    }
  });
};

export const updateFeeds = store => async (dispatch) => {
  const { feedsList } = store.getState();
  const feedsArray = Object.values(feedsList);
  feedsArray.forEach(async (feed) => {
    try {
      const { itemsData, lastUpdate } = await getRssData(feed.url);
      if (!feed.lastUpdate) {
        dispatch(updateFeedsList(feed.id, lastUpdate));
      } else if (new Date(feed.lastUpdate) < lastUpdate) {
        dispatch(updateFeedsList(feed.id, lastUpdate));
        dispatch(addNewItems(itemsData, feed.id));
      }
    } catch (e) {
      dispatch(checkError(feed.url));
    }
  });
  setTimeout(() => dispatch(updateFeeds(store)), 5000);
};
