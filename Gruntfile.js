'use strict';

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-browserify');

    grunt.initConfig({
        browserify: {
            dist: {
                files: {
                    'public/build/bundle.js': ['public/javascripts/**/*.js']
                },
                options: {
                    transform: ['debowerify']
                }
            }
        }
    });
};
