var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

// Gruntfile.js
module.exports = function(grunt) {

    // Configure
    grunt.initConfig({

        working_base_folder: 'jsdebugger',

        // Dev
        dev_base_folder: 'jsdebugger',
        dev_server_port: 9001,


        // ---

        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! ' + [
            '<%= pkg.description %> v<%= pkg.version %>',
            'Copyright (c) <%= grunt.template.today("yyyy") %>',
            '<%= grunt.template.today("ddd, dd mmm yyyy HH:MM:ss Z") %>'
            ].join(' | ') + ' */',

        csslint: {
            dev: {
                src: [
                    '<%= working_base_folder %>/style.css',
                ],
                strict: {
                    options: {
                        import: 2,
                    },
                },
                options: {
                    'floats': false,
                    'universal-selector': false,
                    'font-sizes': false,
                    'adjoining-classes': false,
                    'bulletproof-font-face': false,
                    'box-model': false,
                },
            },
        },

        // Watch task.
        watch: {
            options: {
                livereload: true,
            },
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: [
                    'default',
                ],
            },
            scripts: {
                files: [
                    '<%= working_base_folder %>/jsdebugger.js',
                    '<%= working_base_folder %>/style.css',
                ],
                tasks: [
                    'default',
                ],
            },
        },


        jshint: {
            options: {
                camelcase: true,
                forin: true,
                curly: true,
                eqeqeq: false,
                eqnull: false,
                camelcase: true,
                forin: false,
                undef: true,
                globals: {
                    jQuery: true,
                    '$': true,
                    "JSConsole": true,
                    "window" :true ,
                    "error" : true,
                    "document" : true,
                },
            },
            beforeconcat: [
                '<%= working_base_folder %>/jsdebugger.js',
            ],

        },

        connect: {
            dev: {
                options: {
                    middleware: function (connect, options) {
                        return [
                            // proxySnippet,
                            require('connect-livereload')(),
                            connect.static(options.base),
                            connect.directory(options.base),
                        ];
                    },
                    port: '<%= dev_server_port %>',
                    base: '<%= dev_base_folder %>',
                },
            },
        },

        open: {
            dev: {
                path: 'http://localhost:<%= dev_server_port %>',
            },
        },

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-connect-proxy');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-includes');

    // Default task
    grunt.registerTask('default', 'runs my tasks', function () {
        var tasks = [
            'jshint:beforeconcat',
            'csslint:dev',
        ];

        // always use force when watching
        grunt.option('force', true);
        grunt.task.run(tasks);
    });

    grunt.registerTask('start', [
        'default',
        'open:dev',
        'connect:dev',
        //'watch',
    ]);

};
