module.exports = {
  production : {
    src : 'dist/ember-validatable.prod.js',
    options : {
      inline: true,
      nodes : ['Ember.assert']
    }
  }
};
