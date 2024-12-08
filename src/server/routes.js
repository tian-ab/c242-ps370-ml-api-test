const { postPredictHandler, postPredictHistoriesHandler } = require('../server/handler');
 
const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        allow: 'application/json', // Accept JSON input format
        maxBytes: 1000000
      }
    }
  },
  {
    path: '/predict/histories',
    method: 'GET',
    handler: postPredictHistoriesHandler,
  }
]
 
module.exports = routes;