var _ = require('lodash')
  , _s = require('underscore.string');
module.exports = require('./package.json').name;
angular.module(module.exports, [])
.factory('WeoError', function() {
  function WeoError(form) {
    var self = this;
    this.data = {};
    this.form = form;
    _.each(this.form, function(field, fieldName) {
      field && field.$parsers && field.$parsers.unshift(function(val) {
        _.each(self.data, function(data, action) {
          self.success(action)();
        });
        return val;
      });
    });
  }

  WeoError.prototype.success = function(key) {
    var self = this;
    return function() {
      _.each(self.data[key], function(error) {
        console.log('success', error.field, error.code);
        self.form[error.field].$setValidity(error.code, true);
      });
      delete self.data[key];
    };
  };

  WeoError.prototype.failure = function(key) {
    var self = this;
    return function(err) {
      self.data[key] = err.data.errors;
      err && _.each(err.data.errors, function(error) {
        self.form[error.field].$setValidity(error.code, false);
      });
    };
  }

  return WeoError;
});