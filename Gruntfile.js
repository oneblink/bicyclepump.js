/*jslint indent:2, node:true*/
'use strict';

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({

    jslint: {
      all: {
        src: [
          '**/*.json',
          '**/*.js',
          '!**/node_modules/**',
          '!**/*.min.js'
        ],
        directives: {},
        options: {
          errorsOnly: true,
          failOnError: true
        }
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    mochacli: {
      options: {
        require: ['chai'],
        ui: 'tdd',
        bail: true
      },
      all: ['tests/**/tests.js']
    },

    mocha: {
      tests: {
        src: ['tests/**/*.html'],
        options: {
          run: true
        }
      },
      options: {
        mocha: {},
        log: false
      }
    },

    watch: {
      files: [
        '**/*.html',
        '<%= jslint.all.src %>'
      ],
      tasks: ['jslint', 'mochacli', 'mocha'],
      options: {
        interrupt: true
      }
    }

  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jslint');
  // grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-mocha-cli');

  grunt.registerTask('test', ['jslint', 'mochacli', 'mocha']);
  grunt.registerTask('default', ['test']);

};
