import { createStore, persist } from 'easy-peasy';
import { createLogger } from 'redux-logger';

import blockchain from './blockchain'

const middleware = [];
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger());
}

const model = persist({
  blockchain,
// }, {
//   storage: 'localStorage'
});

export default createStore(model, { middleware });
