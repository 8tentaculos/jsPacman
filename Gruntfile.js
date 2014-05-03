'use strict';

module.exports = function(grunt) {

    var port = 8981;

    grunt.initConfig({
        connect: {
            dev : {
                options : {
                    keepalive : true,
                    livereload : true,
                    debug : false
                }
            },
            test : {
                options : {
                    port : port
                }
            }
        },
        shell: {
            'mocha-phantomjs': {
                command: 'mocha-phantomjs -R spec http://localhost:8000/test/testrunner.html',
                options: {
                    stdout : true,
                    stderr : true
                }
            },
            'mocha-phantomjs-port' : {
                command : 'mocha-phantomjs -R spec http://localhost:' + port + '/test/testrunner.html',
                options : {
                    stdout : true,
                    stderr : true
                }
            }
        },
        jshint: {
            options : {
            },
            tests : {
                options : {
                    '-W030' : true // to.be.true syntax
                },
                src : ['test/*.js']
            },
            src : ['js/src/**/*.js']
        },
        watch : {
            js : {
                options : {
                    livereload : true
                },
                files : ['js/src/**/*.js', 'test/*.js'],
                tasks : ['jshint', 'shell:mocha-phantomjs']
            }
        },
        requirejs : {
            build : {
                options : {
                    baseUrl : 'js/src', // Relative to Gruntfile.
                    paths: { // Relative to baseUrl.
                        jquery : '../lib/jquery-1.10.2.min',
                        gameQuery : '../lib/jquery.gamequery-0.7.1',
                        main : '../main'
                    },
                    shim : {
                        gameQuery : ['jquery']
                    },
                    name : 'main',
                    out : 'js/main-build.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');  
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    
    grunt.registerTask('test', ['jshint', 'connect:test', 'shell:mocha-phantomjs-port']);
    grunt.registerTask('build', ['requirejs:build']);
    grunt.registerTask('default', ['connect:dev']);
  
};
