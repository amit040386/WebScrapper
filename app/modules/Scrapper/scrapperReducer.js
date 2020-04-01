import { handle } from 'redux-pack';

import * as actionTypes from './scrapperActionTypes';
import translate from '../../locale';

const initialState = {
  links: [],
  savedLinks: [],
  errors: '',
  loading: false
};

// common failure function for all APIs
const failureMessage = (prevState, payload) => ({
  ...prevState,
  errors:
    payload && payload.message === 'Network Error'
      ? translate('common.networkTryAgain')
      : translate('common.tryAgainSometime')
});

const articleReducer = (state = initialState, action = '') => {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.FETCH_LINKS:
      return handle(state, action, {
        start: (prevState) => ({
          ...prevState,
          errors: '',
          loading: true
        }),
        success: (prevState) => ({
          ...prevState,
          links: payload ? [...payload] : []
        }),
        failure: (prevState) => failureMessage(prevState, payload),
        finish: (prevState) => ({
          ...prevState,
          loading: false
        })
      });

    case actionTypes.FETCH_SAVED_LINKS:
      return handle(state, action, {
        start: (prevState) => ({
          ...prevState,
          errors: '',
          loading: true
        }),
        success: (prevState) => ({
          ...prevState,
          savedLinks: [...payload]
        }),
        failure: (prevState) => ({
          ...prevState,
          savedLinks: []
        }),
        finish: prevState => ({
          ...prevState,
          loading: false
        })
      });

    default:
      return state;
  }
};

export default articleReducer;
