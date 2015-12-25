var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
var imageminJpegtran = require('imagemin-jpegtran');
var imageminPngquant = require('imagemin-pngquant');
var gm = require('gulp-gm');

// we'd need a slight delay to reload browsers
// connected to browser-sync after restarting nodemon
var BROWSER_SYNC_RELOAD_DELAY = 500;

	gulp.task('default',['styles'], function() {
		gulp.watch('public/sass/**/*.scss',['styles']);

		 //  browserSync.init({
			// 	server: './'
			// });
	});
	gulp.task('copy-vendor',function() {
		gulp.src('node_modules/bootstrap/dist/**/*.*')
		.pipe(gulp.dest('public/dist/vendor/bootstrap'));

		gulp.src('node_modules/swiper/dist/**/*.*')
		.pipe(gulp.dest('public/dist/vendor/swiper'));

		gulp.src('node_modules/jquery/dist/**/*.*')
		.pipe(gulp.dest('public/dist/vendor/jquery'));

		gulp.src(['node_modules/vex-js/js/**/*.*',
			'node_modules/vex-js/css/**/*.*'],
			{base: 'node_modules/vex-js'})
		.pipe(gulp.dest('public/dist/vendor/vex-js'));
	});

	gulp.task('copy-js', function() {
		gulp.src('public/js/**/*.js')
			.pipe(gulp.dest('public/dist/js'));
	});
	gulp.task('copy-img', function() {
		gulp.src('public/img/**/*.*')
			.pipe(gulp.dest('public/dist/img'));
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
			proxy: "http://localhost:3000",
	        // files: ["public/**/*.*"],
	        files: ["public/**/*.*","views/**/*.*"],
	        // browser: "google chrome",
	        port: 7000,
		});
	});

	gulp.task('img-min-all',
		[
			'img-min-jpg',
			'img-min-png'
		]
		);
	
	gulp.task('copy-img_min-to-dist',function() {
		gulp.src('public/img_min/**/*.*',
			{base: 'public/img_min'})
		.pipe(gulp.dest('public/dist/img'))
	});

	gulp.task('img-min-jpg',function() {
		 gulp.src('public/img/**/*.jpg',
			{base: 'public/img'})
        .pipe(imageminJpegtran({progressive: true})({arithmetic: true}))
        .pipe(gulp.dest('public/img_min'));
	});

	gulp.task('img-min-png',function() {
		 gulp.src('public/img/**/*.png',
			{base: 'public/img'})
        .pipe(imageminPngquant({progressive: true})({arithmetic: true}))
        .pipe(gulp.dest('public/img_min'));
	});

	gulp.task('img-cp-ico',function() {
		 gulp.src('public/img/**/*.ico',
			{base: 'public/img'})
        .pipe(gulp.dest('public/dist/img'));
	});

	gulp.task('img-resize-logo',function() {
		gulp.src('public/img_resize/src/**/*.png')
		.pipe(
			gm(function (gmfile) { 
	      return gmfile.resize(45, 45);	 
	    },
	    {
	    	imageMagick: true
	    }
	    ))
		.pipe(gulp.dest('public/img_resize/build'));
	});

	gulp.task('img-jpg-png',function() {
		gulp.src('public/img_resize/src/**/*.jpg')
		.pipe(
			gm(function (gmfile) { 
	      return gmfile.setFormat('png');	 
	    },
	    {
	    	imageMagick: true
	    }
	    ))
		.pipe(gulp.dest('public/img_resize/build'));
	});


	gulp.task('img', [
		'img-min-jpg',
		'img-min-png',
		'img-cp-ico'
	]);

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