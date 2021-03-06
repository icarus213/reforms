'use strict';

const tag = require('html-tag');
const uuidv4 = require('uuid/v4');

class labelField {
  constructor(field, options) {
    this.$options = Object.assign({}, options);
    for (var x in this.$options) {this[x] = this.$options[x]}
    this.$field = field || {};
    this.text = this.text || field._name;
  }

  render(attrs) {
    var merged_attrs = Object.assign({}, attrs);
    var filtered_keys = Object.keys(this).filter(x => x[0] === '_');
    for (var x in filtered_keys) {
      var key = filtered_keys[x].substring(1);
      if (typeof merged_attrs[key] === 'undefined') {
        merged_attrs[x] = this['_' + x];
      }
    }
    merged_attrs.for = merged_attrs.for || this.$field._id;
    var fieldHTML = tag('label', merged_attrs, this.text);
    return fieldHTML;
  }
}

class templateField {
  constructor(options) {
    this.$options = Object.assign({}, options);
    for (var x in this.$options) {this[x] = this.$options[x]}
    this.errors = [];
    this.label = new labelField(this, this.$options.label);
  }

  validate(form) {
    var self = this;
    var validators = self.validators || [];
    self.errors = [];
    for (var x in validators) {
      validators[x](form, self, error => error ? self.errors.push(error) : null);
    }
    return self.errors.length > 0 ? false : true;
  }
}

class inputField extends templateField {
  constructor(options) {
    var uuid = uuidv4();
    options = options || {};
    options._type = options._type || 'text';
    options._id = options._id || 'id-' + options._type + '-' + uuid;
    options._name = options._name || options._type + '-' + uuid;
    super(options);
    this.$default_attrs = ['id', 'name', 'type'];
  }

  render(attrs) {
    var merged_attrs = Object.assign({}, attrs);
    var filtered_keys = Object.keys(this).filter(x => x[0] === '_');
    for (var x in filtered_keys) {
      var key = filtered_keys[x].substring(1);
      if (typeof merged_attrs[key] === 'undefined' || this.$default_attrs.includes(key)) {
        merged_attrs[key] = this['_' + key];
      }
    }
    var fieldHTML = tag('input', merged_attrs);
    return fieldHTML;
  }
}

class selectField extends templateField {
  constructor(options) {
    var uuid = uuidv4();
    options = options || {};
    options.choices = options.choices || [];
    options._id = options._id || 'id-select-' + uuid;
    options._name = options._name || 'select-' + uuid;
    super(options);
  }

  render(attrs) {
    var merged_attrs = Object.assign({}, attrs);
    var filtered_keys = Object.keys(this).filter(x => x[0] === '_');
    for (var x in filtered_keys) {
      var key = filtered_keys[x].substring(1);
      if (typeof merged_attrs[key] === 'undefined') {
        merged_attrs[key] = this['_' + key];
      }
    }

    var text = '';
    for (var x in this.choices) {
      var option_attrs = {};
      var option_filtered_keys = Object.keys(this.choices[x]).filter(x => x[0] === '_');
      for (var y in option_filtered_keys) {
        var key = option_filtered_keys[y].substring(1);
        option_attrs[key] = this.choices[x]['_' + key];
      }
      var option_text = this.choices[x].text || this.choices[x]._value;
      var optionHTML = tag('option', option_attrs, option_text);
      text = text + optionHTML;
    }

    var fieldHTML = tag('select', merged_attrs, text);
    return fieldHTML;
  }
}

class textAreaField extends templateField {
  constructor(options) {
    var uuid = uuidv4();
    options = options || {};
    options._id = options._id || 'id-textarea-' + uuid;
    options._name = options._name || 'textarea-' + uuid;
    super(options);
  }

  render(attrs) {
    var merged_attrs = Object.assign({}, attrs);
    var filtered_keys = Object.keys(this).filter(x => x[0] === '_');
    for (var x in filtered_keys) {
      var key = filtered_keys[x].substring(1);
      if (typeof merged_attrs[key] === 'undefined' || default_attrs.includes(key)) {
        merged_attrs[key] = this['_' + key];
      }
    }
    var fieldHTML = tag('textarea', merged_attrs, this.text);
    return fieldHTML;
  }
}

exports._field = function(options, field) {
  var generator = function() {return new field(generator.options)}
  generator.options = Object.assign({}, options);
  return generator;
}

exports.labelField = function(options) {return exports._field(options, labelField);}
exports.templateField = function(options) {return exports._field(options, templateField);}
exports.inputField = function(options) {return exports._field(options, inputField);}
exports.selectField = function(options) {return exports._field(options, selectField);}
exports.textAreaField = function(options) {return exports._field(options, textAreaField);}

exports._classes = {labelField, templateField, inputField, selectField, textAreaField}