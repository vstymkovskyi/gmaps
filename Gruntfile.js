/**
 * Created by VStymkovskyi on 7/8/2016.
 */
'use strict';

/**
 * Livereload and connect variables
 */
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({
	port: LIVERELOAD_PORT
});

var mountFolder = function (connect, dir) {
	return require('serve-static')(require('path').resolve(dir));
};

/**
 * Grunt module
 */
module.exports = function (grunt) {
	/**
	 * Dynamically load npm tasks
	 */
	require('load-grunt-tasks')(grunt);

	/**
	 * FireShell Grunt config
	 */
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		/**
		 * Set project info
		 */
		project: {
			src: 'src',
			app: 'app',
			assets: '<%= project.app %>/assets',
			css: ['<%= project.src %>/scss'],
			js: [
				'<%= project.src %>/js/**/*.js'
			]
		},

		/**
		 * Connect port/livereload
		 * https://github.com/gruntjs/grunt-contrib-connect
		 * Starts a local webserver and injects
		 * livereload snippet
		 */
		connect: {
			options: {
				port: 9001,
				hostname: '*'
			},
			livereload: {
				options: {
					middleware: function (connect) {
						return [lrSnippet, mountFolder(connect, 'app')];
					}
				}
			}
		},

		/**
		 * Clean files and folders
		 * https://github.com/gruntjs/grunt-contrib-clean
		 * Remove generated files for clean deploy
		 */
		clean: {
			dist: [
				'<%= project.assets %>/css/style.unprefixed.css',
				'<%= project.assets %>/css/style.prefixed.css'
			]
		},

		/**
		 * JSHint
		 * https://github.com/gruntjs/grunt-contrib-jshint
		 * Manage the options inside .jshintrc file
		 */
		jshint: {
			files: [
				'src/js/*.js',
				'Gruntfile.js'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		/**
		 * Concatenate JavaScript files
		 * https://github.com/gruntjs/grunt-contrib-concat
		 * Imports all .js files and appends project banner
		 */
		concat: {
			dev: {
				files: {
					'<%= project.assets %>/js/scripts.min.js': '<%= project.js %>'
				}
			},
			options: {
				stripBanners: true,
				nonull: true
			}
		},

		/**
		 * Uglify (minify) JavaScript files
		 * https://github.com/gruntjs/grunt-contrib-uglify
		 * Compresses and minifies all JavaScript files into one
		 */
		uglify: {
			options: {
			},
			dev: {
				files: {
					'<%= project.assets %>/js/scripts.min.js': '<%= project.js %>'
				}
			}
		},

		/**
		 * Compile Sass/SCSS files
		 * https://github.com/gruntjs/grunt-contrib-sass
		 * Compiles all Sass/SCSS files and appends project banner
		 */
		sass: {
			dev: {
				options: {
					style: 'expanded'
				},
				files: {
					'<%= project.assets %>/css/angular-material.css': '<%= project.src %>/components/angular-material/angular-material.scss',
					'<%= project.assets %>/css/bootstrapImport.css': '<%= project.css %>/bootstrapImport.scss',
					'<%= project.assets %>/css/style.css': '<%= project.css %>/style.scss'
				}
			}
		},

		/**
		 * CSSMin
		 * CSS minification
		 * https://github.com/gruntjs/grunt-contrib-cssmin
		 */
		cssmin: {
			compile: {
				files: {
					'<%= project.assets %>/css/angular-material.min.css': '<%= project.assets %>/css/angular-material.css',
					'<%= project.assets %>/css/bootstrapImport.min.css': '<%= project.assets %>/css/bootstrapImport.css'
				}
			},
			dev: {
				files: {
					'<%= project.assets %>/css/style.min.css': [
						'<%= project.src %>/components/normalize-css/normalize.css',
						'<%= project.assets %>/css/style.css'
					]
				}
			}
		},

		/**
		 * Build bower components
		 * https://github.com/yatskevich/grunt-bower-task
		 */
		bower: {
			dev: {
				options: {
					layout: 'byComponent'
				},
				dest: '<%= project.assets %>/components/'
			}
		},

		/**
		 * Opens the web server in the browser
		 * https://github.com/jsoverson/grunt-open
		 */
		open: {
			server: {
				path: 'http://localhost:<%= connect.options.port %>'
			}
		},

		/**
		 * Runs tasks against changed watched files
		 * https://github.com/gruntjs/grunt-contrib-watch
		 * Watching development files and run concat/compile tasks
		 * Livereload the browser once complete
		 */
		watch: {
			concat: {
				files: [
					'<%= project.src %>/js/{,*/}*.js'
				],
//				tasks: ['concat:dev', 'jshint']
				tasks: ['concat:dev']
			},
			sass: {
				files: '<%= project.src %>/scss/{,*/}*.{scss,sass}',
				tasks: ['sass:dev', 'cssmin:dev']
			},
			livereload: {
				options: {
					livereload: LIVERELOAD_PORT
				},
				files: [
					'<%= project.app %>/{,*/}*.html',
					'<%= project.assets %>/templates/{,*/}*.html',
					'<%= project.assets %>/css/*.css',
					'<%= project.assets %>/js/{,*/}*.js',
					'<%= project.assets %>/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
				]
			}
		}
	});

	/**
	 * Default task
	 * Run `grunt` on the command line
	 */
	grunt.registerTask('default', [
		'sass:dev',
		'bower:dev',
		'cssmin:compile',
		'cssmin:dev',
//		'jshint',
		'concat:dev',
		'connect:livereload',
		'open',
		'watch'
	]);

	/**
	 * Build task
	 * Run `grunt build` on the command line
	 * Then compress all JS/CSS files
	 */
	grunt.registerTask('build', [
		//'sass:dist',
		//'bower:dist',
		//'autoprefixer:dist',
		//'cssmin:dist',
		//'clean:dist',
		//'jshint',
		//'uglify'
	]);

};