import { getFeedsList } from './storage';

export const state = {
  feedsList: getFeedsList(),
  validInput: false,
};

export const previousState = {
  feedsList: [],
};