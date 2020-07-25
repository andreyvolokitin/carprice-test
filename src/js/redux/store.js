/* eslint-disable import/prefer-default-export */
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { throttle } from 'throttle-debounce';

import OS from './reducers/OS';
import apiMiddleware from './middleware/apiMiddleware';

const stateKey = 'carprice-test-state';
const localState = localStorage.getItem(stateKey) ? JSON.parse(localStorage.getItem(stateKey)) : {};
const store = createStore(combineReducers({ OS }), localState, applyMiddleware(apiMiddleware));

// persist all state to make it easy
store.subscribe(
  throttle(50, () => {
    localStorage.setItem(stateKey, JSON.stringify(store.getState()));
  })
);

export default store;
