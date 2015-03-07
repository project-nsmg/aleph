'use strict';

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');

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
        },
        watch: {
            browserify: {
                files: ['public/javascripts/**/*.js'],
                tasks: ['browserify']
            }
        }
    });

    grunt.registerTask('jswatch', ['browserify', 'watch']);
};
