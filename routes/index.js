"use strict";

/**
 * Sends status code
 */
function sendStatus(status) {
  return function(req, res) {
    res.send(status);
  }
}


module.exports = function(app) {
  app.get('/_status', sendStatus(200));
  /**
   * ADMIN API
   */

  require('./admin')(app);

};
