var _ = require('lodash');
var _s = require('underscore.string')

var defaultCodes = ["missing", "missing_field", "invalid", "already_exists"];

module.exports = function(codes) {
  codes = defaultCodes.concat(codes);
  return function(message) {
    function ClientError(message) {
      this.message = message;
      this.errors = [];
    }

    ClientError.prototype.fromSails = function(resource, sailsError) {
      var self = this;
      if(sailsError.ValidationError) {
        this.message = 'ValidationError';
        _.each(sailsError.ValidationError, function(errors, field) {
          _.each(errors, function(err) {
            var code;
            switch(err.rule) {
            case 'unique':
              code = 'already_exists';
              break;
            case 'required':
              code = 'missing_field';
              break;
            default:
              code = 'invalid';
              break;
            }
            self[code](resource, field, err);
          });
        });
      }
    };

    _.each(codes, function(code) {
      ClientError.prototype[_s.camelize(code)] = function(resource, field, details) {
        this.errors.push({
          resource: resource,
          field: field,
          code: code, 
          details: details
        });
        return this;
      };
    });

    return new ClientError(message);
  };
};