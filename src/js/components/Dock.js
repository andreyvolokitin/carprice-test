import React from 'react';
import AppThumbnail from './AppThumbnail';

const Dock = ({ className = '', apps }) => {
  apps.sort((app1, app2) => app1.dockOrder - app2.dockOrder);

  return (
    <div className={`${className} dock`}>
      {apps
        .filter((app) => app.dockOrder)
        .map((app) => (
          <div key={app.id} className="dock__item">
            <AppThumbnail type="compact" app={app} />
          </div>
        ))}
    </div>
  );
};

export default Dock;
