var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync').create();
// we'd need a slight delay to reload browsers
// connected to browser-sync after restarting nodemon
var BROWSER_SYNC_RELOAD_DELAY = 500;

	gulp.task('default',['styles'], function() {
		gulp.watch('public/sass/**/*.scss',['styles']);

		  browserSync.init({
				server: './'
			});
	});

	gulp.task('styles', function() {
		gulp.src('public/sass/**/*.scss')
			.pipe(sass({
				outputStyle: 'compressed'
			}).on('error', sass.logError))
			.pipe(autoprefixer({
				browsers: ['last 2 versions']
			}))
			.pipe(gulp.dest('public/dist/css'))
			.pipe(browserSync.stream());
	});

	gulp.task('browser-sync', ['nodemon'], function() {
		browserSync.init(null, {
			proxy: "http://localhost:8080",
	        // files: ["public/**/*.*"],
	        files: ["public/**/*.*","views/**/*.*"],
	        // browser: "google chrome",
	        port: 7000,
		});
	});

	gulp.task('nodemon', function (cb) {
	
		var started = false;
		
		return nodemon({
			script: 'wein.js',
			watch:['wein.js']
		}).on('start', function () {
			// to avoid nodemon being started multiple times
			// thanks @matthisk
			if (!started) {
				cb();
				started = true; 
			} 
		}).on('restart', function onRestart() {
      		// reload connected browsers after a slight delay
		      setTimeout(function reload() {
		        browserSync.reload({
		          stream: false
		        });
		      }, BROWSER_SYNC_RELOAD_DELAY);

      });
	});