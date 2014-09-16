'use strict';

module.exports = function(grunt) {

  require('jit-grunt')(grunt);

  var herokuConfig = {
    hub: {
      client: {
        src: ['client/Gruntfile.js'],
        tasks: ['build', 'compile']
      },
      'client-watch': {
        src: ['client/Gruntfile.js'],
        tasks: ['watch']
      }
    }
  };

  if (process.env.NODE_ENV === 'production') {
    grunt.initConfig(grunt.util._.extend(herokuConfig));
  } else {
    var localConfig = {
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
      },
      supervisor: {
        target: {
          script: 'server.js',
          options: {
            watch: ['.,configuration,routes'],
            ignore: ['node_modules'],
            pollInterval: 500,
            extensions: ['js,json'],
            exec: 'node',
            debug: false,
            debugBrk: false,
            harmony: false,
            noRestartOn: 'error',
            //forceWatch: true,
            quiet: false
          }
        }
      },
      concurrent: {
        watch: ['hub:client-watch', 'supervisor'],
        options: {
          logConcurrentOutput: true
        }
      }
    };
    grunt.initConfig(grunt.util._.extend(herokuConfig, localConfig));
  }

  grunt.registerTask('default', ['watch']);

  grunt.registerTask('watch', 'concurrent:watch');

  grunt.registerTask('heroku:production', ['build-angular']);

  grunt.registerTask('build-angular', 'hub:client');

};