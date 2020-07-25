import React, { useEffect, useRef } from 'react';
import imagesLoaded from 'imagesloaded';

const AppThumbnail = ({ className = '', tabIndex, type, app }) => {
  const iconRef = useRef(null);

  const highDensitySuffix = '@2x';
  const iconURL = encodeURI(app.icon.trim());
  const iconExtension = `.${iconURL.split('.').pop()}`;
  const phoneIconURL = iconURL.replace(iconExtension, '-phone$&');
  const phoneIcon2xURL = phoneIconURL.replace(iconExtension, `${highDensitySuffix}$&`);
  const tabletIconURL = iconURL.replace(iconExtension, '-tablet$&');
  const tabletIcon2xURL = tabletIconURL.replace(iconExtension, `${highDensitySuffix}$&`);

  useEffect(() => {
    if (typeof picturefill === 'function') {
      /* eslint-disable-next-line no-undef */
      picturefill();
    }

    imagesLoaded(iconRef.current, (instance) => instance.elements[0].classList.add('is-ready'));
  }, []);

  return (
    <button
      tabIndex={tabIndex}
      ref={iconRef}
      type="button"
      app-id={app.id}
      className={`${className} app-thumbnail`}
    >
      <span className="app-thumbnail__icon">
        <img
          className="app-thumbnail__pic"
          draggable="false"
          srcSet={`${phoneIconURL} 60w, ${tabletIconURL} 72w, ${phoneIcon2xURL} 120w, ${tabletIcon2xURL} 144w`}
          sizes="(min-width: 990px) 72px, 60px"
          alt={app.name}
        />
      </span>
      {type !== 'compact' ? <span className="app-thumbnail__label">{app.name}</span> : ''}
    </button>
  );
};

export default AppThumbnail;
