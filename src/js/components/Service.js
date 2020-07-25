import React from 'react';

const SIGNAL_LEVELS_COUNT = 5;

const Service = ({ className = '', signal, carrier }) => {
  const marks = [];
  let i = 0;

  while (i < SIGNAL_LEVELS_COUNT) {
    marks.push(
      <span
        key={i}
        className={`${
          i < Math.round(signal / (100 / SIGNAL_LEVELS_COUNT)) ? 'is-active' : ''
        } service__signal-mark`}
      ></span>
    );
    i += 1;
  }

  return (
    <div className={`${className} service`}>
      <span className="service__signal">{marks}</span>
      {carrier}
    </div>
  );
};

export default Service;
