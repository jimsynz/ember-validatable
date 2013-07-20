module.exports = {
  options: {
    nospawn: true,
  },
  code: {
    files: ['packages/ember-validatable/lib/**/*.js'],
    tasks: ['jshint:development', 'neuter'],
  },
  test: {
    files: ['packages/ember-validatable/tests/**/*.js'],
    tasks: ['jshint:development', 'build_test_runner_file'],
  }
};
