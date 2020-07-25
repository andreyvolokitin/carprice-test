import React from 'react';
import { connect } from 'react-redux';

import OS from './OS';

function MutantDevice({ data, OSStore }) {
  const appData = OSStore && OSStore.data;

  /* eslint-disable no-return-assign */
  return (
    <div className="mutant-device_spaced mutant-device">
      <div className="mutant-device__inner">
        <div className="mutant-device__device">
          <button type="button" className="mutant-device__power-btn"></button>
          <button
            type="button"
            className="mutant-device__handler_main mutant-device__handler"
          ></button>
          <button
            type="button"
            className="mutant-device__handler_1 mutant-device__handler"
          ></button>
          <button
            type="button"
            className="mutant-device__handler_2 mutant-device__handler"
          ></button>
          <div className="mutant-device__camera"></div>
          <div className="mutant-device__sensor"></div>
          <div className="mutant-device__speaker"></div>
          <div className="mutant-device__screen">
            <div className="mutant-device__screen-content">
              {<OS className="mutant-device__os" data={appData || data || []} />}
            </div>
          </div>
          <button type="button" className="mutant-device__home-btn"></button>
        </div>
      </div>
    </div>
  );
  /* eslint-enable */
}

const mapStateToProps = (state) => {
  return { OSStore: state.OS };
};
export default connect(mapStateToProps)(MutantDevice);
