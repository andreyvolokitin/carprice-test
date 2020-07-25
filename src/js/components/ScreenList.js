import React, { useState } from 'react';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import PointerTracker from 'pointer-tracker';

import AppGrid from './AppGrid';

require('swiper/swiper.scss');
require('swiper/components/navigation/navigation.scss');
require('swiper/components/pagination/pagination.scss');

SwiperCore.use([Navigation, Pagination]);

function enableTouch() {
  this.swiper.allowTouchMove = true;
}
function disableTouch() {
  this.swiper.allowTouchMove = false;
}

let updateSwiperRect;

const ScreenList = ({ className = '', apps }) => {
  const screens = [];
  const screensCount = Math.max(...apps.map((app) => app.screen));
  const [pointerTracker, setPointerTracker] = useState(null);

  apps.sort((app1, app2) => app1.order - app2.order);

  for (let i = 1; i <= screensCount; i += 1) {
    screens.push(
      <SwiperSlide key={i} className="screen-list__item">
        <AppGrid
          screenIndex={i}
          className="OS__app-grid"
          apps={apps.filter((app) => app.screen === i)}
        />
      </SwiperSlide>
    );
  }

  return (
    <div className={`${className} screen-list`}>
      <div className="screen-list__inner">
        <Swiper
          className="screen-list__swiper"
          spaceBetween={45}
          slidesPerView={1}
          touchStartPreventDefault={false}
          breakpoints={{
            990: {
              spaceBetween: 140,
            },
          }}
          pagination={{
            el: '.screen-list__paging',
            type: 'bullets',
          }}
          navigation={{
            nextEl: '.screen-list__nav_next',
            prevEl: '.screen-list__nav_prev',
          }}
          onInit={(swiper) => {
            // don't support rtl to revert "next/prev" due to lack of time
            let isSlidingNextForbidden = false;
            let isSlidingPrevForbidden = false;
            const edgeTolerance = 2;
            const edgeResetTolerance = 30;
            let swiperRect;

            updateSwiperRect = function () {
              swiperRect = swiper.el.getBoundingClientRect();
            };

            updateSwiperRect();

            const tracker = new PointerTracker(swiper.el, {
              // simple (and buggy) edge swiping
              move(previousPointers, changedPointers, event) {
                if (
                  isSlidingPrevForbidden &&
                  tracker.currentPointers[0].pageX - swiperRect.left > edgeResetTolerance
                ) {
                  isSlidingPrevForbidden = false;
                }

                if (
                  !isSlidingPrevForbidden &&
                  tracker.currentPointers[0].pageX - swiperRect.left < edgeTolerance
                ) {
                  swiper.slidePrev();
                  isSlidingPrevForbidden = true;
                }

                if (
                  isSlidingNextForbidden &&
                  swiperRect.left + swiperRect.width - tracker.currentPointers[0].pageX >
                    edgeResetTolerance
                ) {
                  isSlidingNextForbidden = false;
                }

                if (
                  !isSlidingNextForbidden &&
                  swiperRect.left + swiperRect.width - tracker.currentPointers[0].pageX <
                    edgeTolerance
                ) {
                  swiper.slideNext();
                  isSlidingNextForbidden = true;
                }
              },
            });

            setPointerTracker(tracker);

            setTimeout(() => {
              swiper.update();
              swiper.el.parentNode.parentNode.classList.add('is-ready');
            }, 600);

            swiper.el.addEventListener('app-grid-sortable-chosen', disableTouch);
            swiper.el.addEventListener('app-grid-sortable-chosen', updateSwiperRect);
            swiper.el.addEventListener('app-grid-sort-ended', enableTouch);
          }}
          onBeforeDestroy={(swiper) => {
            pointerTracker.stop();
            swiper.el.removeEventListener('app-grid-sortable-chosen', disableTouch);
            swiper.el.removeEventListener('app-grid-sortable-chosen', updateSwiperRect);
            swiper.el.removeEventListener('app-grid-sort-ended', enableTouch);
          }}
        >
          {screens}
        </Swiper>
      </div>
      <button type="button" className="screen-list__nav_prev screen-list__nav"></button>
      <button type="button" className="screen-list__nav_next screen-list__nav"></button>
      <div className="screen-list__paging"></div>
    </div>
  );
};

export default ScreenList;
