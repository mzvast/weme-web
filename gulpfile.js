var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
var imageminJpegtran = require('imagemin-jpegtran');//lossless
var imageminOptipng = require('imagemin-optipng');//lossless
var imageminPngquant = require('imagemin-pngquant');//loss but good
var gm = require('gulp-gm');
var rename = require("gulp-rename");
var runSequence = require('run-sequence');
// var babel = require('gulp-babel');
// we'd need a slight delay to reload browsers
// connected to browser-sync after restarting nodemon
var BROWSER_SYNC_RELOAD_DELAY = 500;

	gulp.task('dev',['styles','copy-js-dist','browser-sync'], function() {
		gulp.watch('sass/**/*.scss',['styles']);
		gulp.watch('js/**/*.*',['copy-js-dist']);
		gulp.watch('bower_components/**/*.*',['copy-bower-dist']);
		// gulp.watch('img_min/src/**/*.*',['img-min-all']);
		// gulp.watch('img_min/_min/src**/*.*',['copy-img-min2dist']);
		// gulp.watch('public/jsx/*.jsx',['babel-react']);

		 //  browserSync.init({
			// 	server: './'
			// });
	});

	// gulp.task('babel-react', function() {
	// 	return gulp.src('public/jsx/*.jsx')
	// 		.pipe(babel({
	// 			presets: ['react']
	// 		}))
	// 		.pipe(gulp.dest('public/dist/js'));
	// });

	gulp.task('img-min-dist',function() {
		runSequence(
			'copy-img-to-min',
			'copy-ico-to-dist',
			'img-min-lossless-jpg',
			'img-min-loss-png',
			'copy-img-dist'
			);
	});

	gulp.task('dist',
		['img-min-dist',
		'copy-bower-dist',
		'copy-js-dist']
	);
	

	gulp.task('default',['styles'], function() {
		gulp.watch('sass/**/*.scss',['styles']);

		 //  browserSync.init({
			// 	server: './'
			// });
	});


// ================== copy ===========================
	// gulp.task('copy-vendor-dist',function() {
	// 	gulp.src('node_modules/bootstrap/dist/**/*.*')
	// 	.pipe(gulp.dest('public/dist/vendor/bootstrap'));

	// 	gulp.src('node_modules/swiper/dist/**/*.*')
	// 	.pipe(gulp.dest('public/dist/vendor/swiper'));

	// 	gulp.src('node_modules/jquery/dist/**/*.*')
	// 	.pipe(gulp.dest('public/dist/vendor/jquery'));

	// 	gulp.src(['node_modules/vex-jsjs/**/*.*',
	// 		'node_modules/vex-js/css/**/*.*'],
	// 		{base: 'node_modules/vex-js'})
	// 	.pipe(gulp.dest('public/dist/vendor/vex-js'));
	// });

	gulp.task('copy-js-dist', function() {
		return gulp.src('js/**/*.js')
			.pipe(gulp.dest('public/dist/js'));
	});

	gulp.task('copy-bower-dist', function() {
		return gulp.src('bower_components/**/*.*',
			{base: 'bower_components'})
			.pipe(gulp.dest('public/dist/vendor'));
	});

	gulp.task('copy-img-dist',function() {
		return gulp.src('img_min/build/**/*.*',
				{base: 'img_min/build'})
			.pipe(gulp.dest('public/dist/img'))
	});

	gulp.task('copy-img-to-min',function() {
		return gulp.src('img/**/*.{jpg,png}',
				{base: 'img'})
			.pipe(gulp.dest('img_min/src'))
	});
	gulp.task('copy-ico-to-dist',function() {
		return gulp.src('img/**/*.ico',
				{base: 'img'})
			.pipe(gulp.dest('public/dist/img'))
	});
// ==================css===========================	
	gulp.task('styles', function() {
		gulp.src('sass/**/*.scss')
			.pipe(sass({
				outputStyle: 'compressed'
			}).on('error', sass.logError))
			.pipe(autoprefixer({
				browsers: ['last 2 versions']
			}))
			.pipe(gulp.dest('public/dist/css'))
			.pipe(browserSync.stream());
	});
// ===================img-min=======================
	gulp.task('img-min-lossless-jpg',function() {
		return gulp.src('img_min/src/**/*.jpg',
					{base: 'img_min/src'})
		        .pipe(imageminJpegtran({progressive: true})())
		     //    .pipe(rename({
			    // 	suffix:"_lossless"
			    // }))
		        .pipe(gulp.dest('img_min/build'));
	});

	gulp.task('img-min-lossless-png',function() {
		 gulp.src('img_min/src/**/*.png',
			{base: 'img_min/src'})
        .pipe(imageminOptipng({optimizationLevel: 3})())
     //    .pipe(rename({
	    // 	suffix:"_lossless"
	    // }))
        .pipe(gulp.dest('img_min/build'));
	});

	gulp.task('img-min-loss-png',function() {
		return gulp.src('img_min/src/**/*.png',
				{base: 'img_min/src'})
	        .pipe(imageminPngquant({quality: '65-80', speed: 4})())
	     //    .pipe(rename({
		    // 	suffix:"_loss"
		    // }))
	        .pipe(gulp.dest('img_min/build'));
	});
	

// =================img-resize=====================
	

	gulp.task('img-resize-logo',function() {
		gulp.src('public/img_resize/src/**/*.jpg',
			{base: 'public/img_resize/src'})
		.pipe(
			gm(function (gmfile) { 
	      return gmfile.resize(60, 60).quality(100);	 
	    },
	    {
	    	imageMagick: true
	    }
	    ))
	    .pipe(rename({
	    	suffix:"_60"
	    }))
		.pipe(gulp.dest('public/img_resize/build'));
	});

	gulp.task('img-resize-1600',function() {
		gulp.src('public/img_resize/src/**/*{jpg,png}',
			{base: 'public/img_resize/src'})
		.pipe(
			gm(function (gmfile) { 
	      return gmfile.resize(1600).quality(100);	 
	    },
	    {
	    	imageMagick: true
	    }
	    ))
	    .pipe(rename({
	    	suffix:"_1600_large_2x"
	    }))
		.pipe(gulp.dest('public/img_resize/build'));

	});

	gulp.task('img-resize-800',function() {
		gulp.src('public/img_resize/src/**/*{jpg,png}',
			{base: 'public/img_resize/src'})
		.pipe(
			gm(function (gmfile) { 
	      return gmfile.resize(800).quality(100);	 
	    },
	    {
	    	imageMagick: true
	    }
	    ))
	    .pipe(rename({
	    	suffix:"_800_medium_1x"
	    }))
		.pipe(gulp.dest('public/img_resize/build'));

	});

	gulp.task('img-resize-400',function() {
		gulp.src('public/img_resize/src/**/*{jpg,png}',
			{base: 'public/img_resize/src'})
		.pipe(
			gm(function (gmfile) { 
	      return gmfile.resize(400).quality(100);	 
	    },
	    {
	    	imageMagick: true
	    }
	    ))
	    .pipe(rename({
	    	suffix:"_400_small_1x"
	    }))
		.pipe(gulp.dest('public/img_resize/build'));
	});


// =================== live editing=====================
	gulp.task('nodemon', function (cb) {
	
		var started = false;
		
		return nodemon({
			script: 'weme.js',
			watch:['weme.js']
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

	gulp.task('browser-sync', ['nodemon'], function() {
		browserSync.init(null, {
			proxy: "http://localhost:3000",
	        // files: ["public/**/*.*"],
	        files: ["public/dist/**/*.*","views/**/*.*"],
	        // browser: "google chrome",
	        port: 7000,
		});
	});