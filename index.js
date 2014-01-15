var _ = require('lodash');
var _s = require('underscore.string')

var defaultCodes = ["missing", "missing_field", "invalid", "already_exists"];

module.exports = function(codes) {
  codes = defaultCodes.concat(codes);
  return function(req, res, next) {
    res.error = function(code, message) {
      var errors = [];

      var error =  {
        code: function(code, resource, field) {
          errors.push({resouce: resource, field: field, code: code});
        },
        send: function() {
          res.json(code, {message: message, errors: errors});
        }
      };
      _.each(codes, function(code) {
        error[_s.camelized(code)] = _.partial(error.code, code);
      });
    }
  }
};