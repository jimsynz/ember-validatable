(function() {

Ember.Validator = Ember.Object.extend({
  target:    null,
  targetKey: null,

  error: function() {
    if (!this.get('isValid')) {
      return this.get('targetKey') + ' ' + this.get('message');
    }
  }.property('isValid', 'targetKey', 'message'),

  message: 'is invalid.',

  isInvalid: Ember.computed.not('isValid'),

  isValid: function() {
    var content = this.get('content');
    return content && (content.length > 0);
  }.property('content'),

  init: function() { this.addPropertyObserver(); },

  addPropertyObserver: function() {
    var target = this.get('target');
    var targetKey = this.get('targetKey');
    if (target && targetKey) {
      target.addObserver(targetKey, this, 'validate');
    }
  }.observes('target', 'targetKey'),

  validate: function() {
    this.set('content', this.get('target').get(this.get('targetKey')));
  }
});



})();

(function() {

Ember.Validatable = Ember.Mixin.create({
  _validations: function() {
    var _this = this;
    return this.constructor.validators.map(function(item) {
      return item.validator.create({target: _this, targetKey: item.targetKey});
    });
  }.property(),

  didDefineProperty: function(proto, key, value) {
    if (this._super) {
      this._super();
    }

    if (proto.get('isInstance')) { proto = proto.constructor; }

    if (/Validators?$/.test(key)) {
      var targetKey = key.replace(/Validators?$/, '');
      var validators = proto.validators || [];

      if (/Validator$/.test(key)) {
        validators.pushObject({targetKey: targetKey, validator: value});
      }
      if (/Validators$/.test(key)) {
        value.each(function(item) {
          validators.pushObject({targetKey: targetKey, validator: item});
        });
      }

      proto.validators = validators;
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


})();