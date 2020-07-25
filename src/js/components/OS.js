/* eslint-disable no-shadow */
import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import { fetchApps } from '../redux/actions';

import Spinner from './Spinner';
import Service from './Service';
import Time from './Time';
import BatteryStatus from './BatteryStatus';
import ScreenList from './ScreenList';
import Dock from './Dock';

const readyKlass = 'is-ready';

function OS({ data = [], className = '', OSStore, fetchApps }) {
  const screenListRef = useRef(null);
  const dockRef = useRef(null);

  useEffect(() => {
    if (typeof data === 'string') {
      fetchApps(data);
    }
  }, []);

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      setTimeout(() => {
        dockRef.current.classList.add(readyKlass);
      }, 100);
    }
  }, [data]);

  const EmptyMsg = ({ children }) => <div className="OS__empty-msg">{children}</div>;
  const Toolbar = () => (
    <div className="OS__toolbar">
      <Service signal={84} carrier="AT&T" className="OS__service" />
      <Time className="OS__time" />
      <BatteryStatus charge={82} className="OS__battery" />
    </div>
  );

  function getContent() {
    let content = <EmptyMsg>Приложения отсутствуют.</EmptyMsg>;

    if (typeof data === 'string') {
      content = (
        <>
          <Toolbar />
          <EmptyMsg>
            {OSStore && OSStore.status === 'pending' && <Spinner className="OS__spinner" />}
            {OSStore && OSStore.status === 'error' && <>Приложения недоступны.</>}
          </EmptyMsg>
        </>
      );
    }

    if (Array.isArray(data) && data.length > 0) {
      content = (
        <>
          <Toolbar />
          <div ref={screenListRef} className="OS__app-screen-list">
            <ScreenList apps={data} />
          </div>
          <div ref={dockRef} className="OS__dock">
            <Dock apps={data} />
          </div>
        </>
      );
    }

    return content;
  }

  return <div className={`${className} OS`}>{getContent()}</div>;
}

const mapStateToProps = (state) => {
  return { OSStore: state.OS };
};
export default connect(mapStateToProps, {
  fetchApps,
})(OS);
