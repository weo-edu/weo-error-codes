var _ = require('lodash');
var _s = require('underscore.string')

var defaultCodes = ["missing", "missing_field", "invalid", "already_exists"];

module.exports = function(codes) {
  codes = defaultCodes.concat(codes);
  return function(req, res, next) {
    res.clientError = function(code, message) {
      var errors = [];

      var error =  {
        code: function(code, resource, field) {
          errors.push({resource: resource, field: field, code: code});
          return this; 
        },
        send: function() {
          res.json(code, {message: message, errors: errors});
        }
      };
      _.each(codes, function(code) {
        error[_s.camelize(code)] = _.partial(error.code, code);
      });
      return error;
    };

    next();
  };
};