module.exports = function (grunt) {
    'use strict';
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        bower: {
            install: {
                options: {
                    targetDir: 'app/lib',
                    layout: 'byType',
                    install: true,
                    verbose: true,
                    cleanTargetDir: false,
                    cleanBowerDir: true
                }
            }
        },
        less: {
            devel: {
                files: {
                    "app/css/main.css": "app/less/main.less"
                }
            }
        },
        clean: {
            bower: ['bower_components'],
            lib: ['./app/lib'],
            css: ['./app/css'],
            node_modules: ['node_modules']
        },
        watch: {
            less: {
                files: ['app/less/*.less'],
                tasks: ['less'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.registerTask('default', ['bower:install', 'less:devel']);
};