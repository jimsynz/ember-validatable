module('Ember-Model acceptance tests');

test('Ember-Model is loaded', function() {
  ok(Ember.Model);
});

var TimeTravelValidator = Ember.Validator.extend({
  error: null,
  isValid: function() {
    var speed = this.get('target.speed');
    var power = this.get('target.powerLevel');
    if (speed < 88) {
      this.set('error', 'Must be travelling at least 88mph to engage the flux capacitor');
      return false;
    }
    if (power < 1210000000) { // 1.21GW
      this.set('error', 'We need at least 1.21 giga-watts of available power to engage the flux capacitor');
      return false;
    }
    return true;
  }.property('content')
});

var Delorean = Ember.Model.extend(Ember.Validatable, {
  speed: Ember.attr(),
  powerLevel: Ember.attr(),

  fluxCapacitorRequirements: function() {
    return this.get('speed') + ' ' + this.get('powerLevel');
  }.property('speed', 'powerLevel'),
  fluxCapacitorRequirementsValidator: TimeTravelValidator
});

test('it should be invalid as created', function() {
  var delorean = Delorean.create({speed: '17mph', powerLevel: 99000000});
  ok(delorean.get('isInvalid'));
});

test('it should be valid when set with the correct data', function() {
  var delorean = Delorean.create({speed: '17mph', powerLevel: 99000000});
  ok(delorean.get('isInvalid'));

  delorean.set('speed', '88mph');
  delorean.set('powerLevel', 1210000000);
  ok(delorean.get('isValid'));
});
