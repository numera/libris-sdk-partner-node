module.exports = {
  /**
   * Increments the version number, etc.
   */
  bump: {
    options: {
      files: [
        "package.json",
        "bower.json"
      ],
      commit: false,
      commitMessage: 'chore(release): v%VERSION%',
      commitFiles: [
        "package.json",
        "client/bower.json"
      ],
      createTag: false, //note that we can only create the tag once, and because it is all in the same project, we only tag the bump on the root.
      tagName: 'v%VERSION%',
      tagMessage: 'Version %VERSION%',
      push: false,
      pushTo: 'origin'
    }
  },

  /**
   * `jshint` defines the rules of our linter as well as which files we
   * should check. This file, all javascript sources, and all our unit tests
   * are linted based on the policies listed in `options`. But we can also
   * specify exclusionary patterns by prefixing them with an exclamation
   * point (!); this is useful when code comes from a third party but is
   * nonetheless inside `src/`.
   */
  jshint: {
    src: [
      '<%= app_files.js %>'
    ],
    config: [
      '<%= app_files.config %>'
    ],
    test: [
      '<%= app_files.jsunit %>'
    ],
    gruntfile: [
      'Gruntfile.js'
    ],
    options: {
      curly: true,
      immed: true,
      newcap: true,
      noarg: true,
      sub: true,
      boss: true,
      eqnull: true,
      node: true
    },
    globals: {}
  },


  /**
   * The Karma configurations.
   */
  karma: {
    options: {
      configFile: '<%= build_dir %>/karma-unit.js'
    },
    unit: {
      background: true,
      port: 9877
    },
    continuous: {
      background: false,
      singleRun: true
    }
  },


  /**
   * This task compiles the karma template so that changes to its file array
   * don't have to be managed manually.
   */
  karmaconfig: {
    unit: {
      dir: '<%= build_dir %>',
      src: [
        '<%= vendor_files.js %>',
        '<%= html2js.app.dest %>',
        '<%= build_dir %>/configuration.js',
        '<%= test_files.js %>'
      ]
    }
  },
  /**
   * And for rapid development, we have a watch set up that checks to see if
   * any of the files listed below change, and then to execute the listed
   * tasks when they do. This just saves us from having to type "grunt" into
   * the command-line every time we want to see what we're working on; we can
   * instead just leave "grunt watch" running in a background terminal. Set it
   * and forget it, as Ron Popeil used to tell us.
   *
   * But we don't need the same thing to happen for all the files.
   */
  delta: {
    /**
     * By default, we want the Live Reload to work for all tasks; this is
     * overridden in some tasks (like this file) where browser resources are
     * unaffected. It runs by default on port 35729, which your browser
     * plugin should auto-detect.
     */
    options: {
      livereload: true
    },

    /**
     * When the Gruntfile changes, we just want to lint it. In fact, when
     * your Gruntfile changes, it will automatically be reloaded!
     */
    gruntfile: {
      files: 'Gruntfile.js',
      tasks: ['jshint:gruntfile'],
      options: {
        livereload: false
      }
    },

    /**
     * When our JavaScript source files change, we want to run lint them and
     * run our unit tests.
     */
    jssrc: {
      files: [
        '<%= app_files.js %>'
      ],
      tasks: ['jshint:src', 'karma:unit:run', 'copy:build_appjs']
    },

    /**
     * When our configuration files change, we want to run lint them and
     * run our unit tests.
     */
    config: {
      files: [
        '<%= app_files.config %>'
      ],
      tasks: ['jshint:config', 'karma:unit:run', 'copy:build_appjs']
    },


    /**
     * When assets are changed, copy them. Note that this will *not* copy new
     * files, so this is probably not very useful.
     */
    assets: {
      files: [
        'src/assets/**/*'
      ],
      tasks: ['copy:build_app_assets', 'copy:build_vendor_assets']
    },

    /**
     * When index.html changes, we need to compile it.
     */
    html: {
      files: ['<%= app_files.html %>'],
      tasks: ['index:build']
    },

    /**
     * When our templates change, we only rewrite the template cache.
     */
    tpls: {
      files: [
        '<%= app_files.atpl %>',
        '<%= app_files.ctpl %>'
      ],
      tasks: ['html2js']
    },

    /**
     * When the CSS files change, we need to compile and minify them.
     */
    less: {
      files: ['src/**/*.less'],
      tasks: ['less:build']
    },

    /**
     * When a JavaScript unit test file changes, we only want to lint it and
     * run the unit tests. We don't want to do any live reloading.
     */
    jsunit: {
      files: [
        '<%= app_files.jsunit %>'
      ],
      tasks: ['jshint:test', 'karma:unit:run'],
      options: {
        livereload: false
      }
    }
  }

};