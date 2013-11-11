require('validator');

var get = Ember.get;

var validationsFor = function(proto) {
  var meta        = Ember.meta(proto);
  var validations = get(meta, 'validations');
  if ('undefined' === typeof validations) {
    validations = Ember.A();
    Ember.set(meta, 'validations', validations);
  }
  return validations;
};

Ember.Validatable = Ember.Mixin.create({
  init: function() {
    if (this._super) { this._super(); }

    this.set('_validationConfigs', validationsFor(this.constructor));
  },

  _validations: Ember.computed.map('_validationConfigs', function(config) {
    return config.validator.create({target: this, targetKey: config.targetKey});
  }),

  didDefineProperty: function(proto, key, value) {
    var targetKey = key.replace(/Validators?$/, '');
    var validations;

    if (this._super)                        { this._super(); }
    if (Ember.typeOf(proto) === 'instance') { proto = proto.constructor; }

    validations = validationsFor(proto);

    if (/Validator$/.test(key)) {
      validations.pushObject({targetKey: targetKey, validator: value});
    }
    if (/Validators$/.test(key)) {
      value.forEach(function(item) {
        validations.pushObject({targetKey: targetKey, validator: item});
      });
    }
  },

  errors: function() {
    return this.get('_validations').filterProperty('isInvalid').mapProperty('error');
  }.property('_validations.@each.isInvalid', '_validations.@each.error').readOnly(),

  isValid: function() {
    return this.get('_validations').filterProperty('isValid').get('length') > 0;
  }.property('_validations.@each.isValid'),

  isInvalid: Ember.computed.not('isValid')
});
