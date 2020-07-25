import React from 'react';
import browser from '../util/browser';

const Wrapper = ({ children }) => (
  // ie11 needs additional wrappers
  <div className="wrapper">
    {browser.isIE ? (
      <div className="wrapper__inner">
        <div className="wrapper__inner-i">{children}</div>
      </div>
    ) : (
      children
    )}
  </div>
);

export default Wrapper;
