import React from 'react';

const BatteryStatus = ({ className = '', charge }) => (
  <div className={`${className} battery`}>
    {`${charge}%`}
    <span className="battery__progress">
      <span style={{ width: `${charge}%` }} className="battery__progress-fill"></span>
    </span>
  </div>
);

export default BatteryStatus;
