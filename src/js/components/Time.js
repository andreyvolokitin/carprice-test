import React, { useEffect, useState } from 'react';

function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const Time = ({ className = '' }) => {
  const [time, setTime] = useState(getTime());

  useEffect(() => {
    const intervalID = setInterval(() => setTime(getTime()), 1000);

    return () => clearInterval(intervalID);
  }, []);

  return <time className={`${className} time`}>{time}</time>;
};

export default Time;
