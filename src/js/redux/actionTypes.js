/* eslint-disable import/prefer-default-export */
const asyncActionType = (type) => ({
  PENDING: `${type}_PENDING`,
  SUCCESS: `${type}_SUCCESS`,
  ERROR: `${type}_ERROR`,
});

export const API = asyncActionType('API');

export const APPS_FETCH = asyncActionType('APPS_FETCH');
export const OS_REORDER_APPS = 'OS_REORDER_APPS';
