module.exports = {
  options: {
    filepathTransform: function(filepath) {
      filepath.replace('ember-validatable', 'ember-validatable/lib');
      return 'packages/' + filepath.replace('ember-validatable', 'ember-validatable/lib');
    }
  },
  'dist/ember-validatable.js': 'packages/ember-validatable/lib/main.js'
};
