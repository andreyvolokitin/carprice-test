import { APPS_FETCH, OS_REORDER_APPS } from '../actionTypes';

export default function OS(OSData = {}, action) {
  const { type, payload } = action;

  switch (type) {
    case APPS_FETCH.PENDING:
      return Object.assign({}, OSData, {
        status: 'pending',
      });
    case APPS_FETCH.ERROR:
      return Object.assign({}, OSData, {
        status: 'error',
      });
    case APPS_FETCH.SUCCESS:
      return Object.assign({}, OSData, {
        status: 'success',
        data: payload.data,
      });
    case OS_REORDER_APPS:
      return Object.assign({}, OSData, {
        data: OSData.data.map((app) => {
          const sortedApp = payload.data.filter((a) => a.id === app.id)[0];

          if (sortedApp && (app.order !== sortedApp.order || app.screen !== sortedApp.screen)) {
            return {
              ...app,
              order: sortedApp.order,
              screen: sortedApp.screen,
            };
          }

          return app;
        }),
      });
    default:
      return OSData;
  }
}
