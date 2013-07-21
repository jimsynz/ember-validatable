# Ember.Validatable [![Build Status](https://travis-ci.org/jamesotron/ember-validatable.png?branch=master)](https://travis-ci.org/jamesotron/ember-validatable)

## Introduction

Ember Validatable is a simple and lightweight validation library for Ember.

## Validations
Validations are added to a model by defining properties ending in either `Validator` or `Validators`.

```javascript
App.User = Ember.Model.extend(Ember.Validatable, {
  firstName: attr(),
  password:  attr(),
  firstNameValidator: App.PresenceValidator,
  passwordValidators: [App.PresenceValidator, App.PasswordValidator]
});
```

Mixing in `Ember.Validatable` also adds several properties to your model:

  - `isValid` - `true` if all the validations on this model are successful.
  - `isInvalid` - the opposite of `isValid`.
  - `errors` - an Enumerable containing the contents of each validation's `error` property (should any
     be invalid).

### Writing Validators

Your validators should be a subclass of the `Ember.Validator` class. As a minimum your validator should contain
an `isValid` computed property (dependent on the `content` property) which implements your logic for defining the
validity of the content.

Other properties available are:

  - `content` - the value of retrieving `targetKey` from `target` (ie the value to test for validity).
  - `target` - the model instance for which we are validating.
  - `targetKey` - the name of the property on `target` which we are validating.
  - `message` - "is invalid." by default.
  - `error` - by default this concatenates `targetKey` and `message`. The result of this will be placed
    in your models `errors` array property.

### Validating multiple properties

Sometimes you might want to validate a selection of properties together.  You might be tempted to
reach into `target` and get the properties you need, but this would be unwise, as these additional
properties will not have the validator's observer configured against them, instead it's best
to create a computed property and validate that:

```javascript
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

App.Delorean = Ember.Object.extend(Ember.Validatable, {
  speed: '17mph',
  powerLevel: '99000000',

  fluxCapacitorRequirements: function() {
    // Technically, we can return anything here, as long as it
    // triggers.
    return [ this.get('speed'), this.get('powerLevel') ];
  }.property('speed', 'powerLevel'),

  fluxCapacitorRequirementsValidator: TimeTravelValidator
});
```
