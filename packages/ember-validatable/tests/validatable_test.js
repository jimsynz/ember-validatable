module('Ember.Validatable');

test('it exists', function() {
  ok(Ember.Validatable);
});

var NotChickenValidator = Ember.Validator.extend({
  isValid: function() {
    return (this.get('content') || '').toLowerCase() !== 'chicken';
  }.property('content'),

  message: 'is not a chicken!'
});

var Protagonist = Ember.Object.extend(Ember.Validatable, {
  name: 'Marty McFly',
  nickNameValidator: NotChickenValidator
});

test('it detects all fooValidator keys', function() {
  var marty = Protagonist.create();
  var validations = Ember.run(marty, marty.get, '_validations');
  equal(validations.get('length'), 1);

  equal(validations.mapProperty('targetKey').get('firstObject'), 'nickName');
});

test('it validates', function() {
  var marty = Protagonist.create();
  ok(marty.get('isValid'));
  Ember.run(marty, marty.set, 'nickName', 'Chicken');
  ok(marty.get('isInvalid'));
});

test('it sets errors', function() {
  var marty = Protagonist.create();
  equal(marty.get('errors.length'), 0);
  Ember.run(marty, marty.set, 'nickName', 'Chicken');
  equal(marty.get('errors.length'), 1);
  equal(marty.get('errors.firstObject'), "nickName is not a chicken!");
});
