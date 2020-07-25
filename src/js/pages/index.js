import 'modernizr';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from '../redux/store';

import Wrapper from '../components/Wrapper';
import MutantDevice from '../components/MutantDevice';

ReactDOM.render(
  <Provider store={store}>
    <Wrapper>
      <MutantDevice data="/APPS.json" />
    </Wrapper>
  </Provider>,
  document.getElementById('root')
);
