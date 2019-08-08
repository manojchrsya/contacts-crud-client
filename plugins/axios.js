import * as _ from 'lodash';

export default function ({ $axios }) {
// runs everytime on api call
  $axios.onRequest((config) => {
    if (config.method === 'get') {
      if (config.query) {
        config.headers.filter = JSON.stringify(config.query);
      }
      if (config.count) {
        config.headers.where = JSON.stringify(config.count);
      }
    }
  });
}
