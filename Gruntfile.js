module.exports = function(grunt) {

  require('jit-grunt')(grunt);

  grunt.initConfig({
    watch: {
      files: ['<config:lint.files>', 'configurations/**/*.json'],
      tasks: 'default timestamp'
    },
    jshint: {
      files: ['Gruntfile.js', 'partner_server.js', 'client/**/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        globals: {
          require: false,
          __dirname: false,
          console: false,
          module: false,
          exports: false,
          Buffer: false,
          process: false
        }
      }
    }
  });

  grunt.registerTask('default', ['clean', 'jshint']);

  grunt.registerTask('heroku:production', ['clean', 'uglify']);

  grunt.registerTask('clean', function() {
    grunt.log.writeln('clean');
  });

  grunt.registerTask('uglify', function() {
    grunt.log.writeln('uglfiy');
  });
};