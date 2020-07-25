import { API, APPS_FETCH, OS_REORDER_APPS } from './actionTypes';

export const apiPending = () => ({
  type: API.PENDING,
});
export const apiSuccess = (response) => ({
  type: API.SUCCESS,
  payload: response,
});
export const apiError = (error) => ({
  type: API.ERROR,
  error: true,
  payload: error,
});

export const fetchApps = (url) => ({
  type: API,
  payload: Object.assign({ url }, APPS_FETCH),
});
export const reorderApps = (data) => ({
  type: OS_REORDER_APPS,
  payload: { data },
});
