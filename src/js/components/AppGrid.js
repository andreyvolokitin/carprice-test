/* eslint-disable no-shadow */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ReactSortable } from 'react-sortablejs';

import { reorderApps } from '../redux/actions';
import AppThumbnail from './AppThumbnail';

const AppGrid = ({ className = '', screenIndex, apps, reorderApps }) => {
  const [appsState, setAppsState] = useState(apps);

  return (
    <ReactSortable
      className={`${className} app-grid`}
      list={appsState}
      setList={setAppsState}
      group="appGrid"
      animation={200}
      delay={300}
      handle={'.app-grid__thumb'}
      forceFallback={true}
      fallbackOnBody={true}
      onChoose={(e) => {
        e.target.dispatchEvent(new CustomEvent('app-grid-sortable-chosen', { bubbles: true }));
      }}
      onStart={(e) => {
        e.target.dispatchEvent(new CustomEvent('app-grid-sort-started', { bubbles: true }));
      }}
      onEnd={(e) => {
        e.target.dispatchEvent(new CustomEvent('app-grid-sort-ended', { bubbles: true }));
      }}
      onSort={(e, sortable) => {
        reorderApps(
          appsState.map((app, i) => Object.assign({}, app, { order: i + 1, screen: screenIndex }))
        );
      }}
    >
      {appsState.map((app) => (
        <div key={app.id} className="app-grid__item">
          <AppThumbnail tabIndex="-1" className="app-grid__thumb" app={app} />
        </div>
      ))}
    </ReactSortable>
  );
};

const mapStateToProps = (state) => {
  return { OSStore: state.OS };
};
export default connect(mapStateToProps, {
  reorderApps,
})(AppGrid);
