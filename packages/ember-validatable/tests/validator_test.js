module('Ember.Validator');

test('it exists', function() {
  ok(Ember.Validator);
});

var PresenceValidator = Ember.Validator.extend({});

test('it is valid when content is present', function() {
  var validator = PresenceValidator.create({content: 'foo'});
  ok(Ember.run(validator, validator.get, 'isValid'));
});

test('it is invalid when content is not present', function() {
  var validator = PresenceValidator.create({});
  ok(Ember.run(validator, validator.get, 'isInvalid'));
});

test('it is invalid when content is empty', function() {
  var validator = PresenceValidator.create({content: ''});
  ok(Ember.run(validator, validator.get, 'isInvalid'));
});

test('it updates its content property when validate is called', function() {
  var dummy = Ember.Object.create({
    foo: 'bar'
  });

  var validator = PresenceValidator.create({
    targetKey: 'foo',
    target: dummy,
    content: null
  });

  equal(validator.get('content'), null);

  Ember.run(validator, validator.validate);

  equal(validator.get('content'), 'bar');
});

test('it updates its error property when invalid', function() {
  var dummy = Ember.Object.create({});

  var validator = PresenceValidator.create({
    targetKey: 'foo',
    target: dummy,
    content: 'foo'
  });

  equal(validator.get('error'), undefined);

  Ember.run(validator, validator.validate);

  equal(validator.get('error'), 'foo is invalid.');
});
