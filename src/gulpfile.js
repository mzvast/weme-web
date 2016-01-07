/*eslint-env node*/
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync').create();
// var imagemin = require('gulp-imagemin');
var imageminJpegtran = require('imagemin-jpegtran');//lossless
var imageminOptipng = require('imagemin-optipng');//lossless
var imageminPngquant = require('imagemin-pngquant');//loss but good
var gm = require('gulp-gm');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var sourcemaps = require('gulp-sourcemaps');
var eslint = require('gulp-eslint');

// var babel = require('gulp-babel');
// we'd need a slight delay to reload browsers
// connected to browser-sync after restarting nodemon
var BROWSER_SYNC_RELOAD_DELAY = 500;
	
gulp.task('dev',['styles','lint','browser-sync'], function() {
	gulp.watch('public/sass/**/*.scss',['styles']);
	gulp.watch('public/js/**/*.js',['lint']);

	//  browserSync.init({
		// 	server: './'
		// });
});	



gulp.task('dist',
	['img-min-dist',
	'copy-json',
	'copy-bower-dist',
	'copy-modules-dist',
	'copy-js-dist',
	'styles-dist',
	'copy-views',
	'copy-weme']
);	

gulp.task('dist-upgrade',
	['copy-json',
	'copy-bower-dist',
	'copy-modules-dist',
	'copy-js-dist',
	'styles-dist',
	'copy-views',
	'copy-weme']
);	

gulp.task('dist-new',
	['img-min-dist',
	'copy-json',//记得去dist下面运行npm install + bower install
	'copy-js-dist',
	'styles-dist',
	'copy-views',
	'copy-weme']
);

gulp.task('clean-dist', function () {
	return gulp.src('../dist')
		.pipe(clean({read: false,force:true}));
});

gulp.task('img-min-dist',function() {
	runSequence(
		'copy-img-to-min',
		'img-min-lossless-jpg',
		'img-min-loss-png',
		'copy-ico-dist',
		'copy-img-dist'
		);
});

//////////
// Lint //
//////////
gulp.task('lint', function () {
	return gulp.src(['public/js/**/*.js'])
	// eslint() attaches the lint output to the eslint property
	// of the file object so it can be used by other modules.
	.pipe(eslint())
	// eslint.format() outputs the lint results to the console.
	// Alternatively use eslint.formatEach() (see Docs).
	.pipe(eslint.format())
	// To have the process exit with an error code (1) on
	// lint error, return the stream and pipe to failOnError last.
	.pipe(eslint.failOnError());
});
// ================== copy ===========================
gulp.task('copy-views',function() {
	return gulp.src('views/**/*.*',
			{base:'views'})
		.pipe(gulp.dest('../dist/views'));
});		


gulp.task('copy-json',function() {
	return gulp.src('*.json')
		.pipe(gulp.dest('../dist/'));
});		

gulp.task('copy-weme',function() {
	return gulp.src('weme.js')
		.pipe(gulp.dest('../dist/'));
});

gulp.task('copy-js-dist', function() {//OK
	return gulp.src('public/js/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('../dist/public/js'));
});

gulp.task('copy-modules-dist',function() {
	return gulp.src('node_modules/**/*.*',
			{base:'./'})
		.pipe(gulp.dest('../dist/'));
});	

gulp.task('copy-bower-dist', function() {//OK
	return gulp.src('bower_components/**/*.*',
		{base: './'})
		.pipe(gulp.dest('../dist'));
});

gulp.task('copy-img-dist',function() {
	return gulp.src('public/img_min/build/**/*.*',
			{base: 'public/img_min/build'})
		.pipe(gulp.dest('../dist/public/img'));
});

gulp.task('copy-img-to-min',function() {
	return gulp.src('public/img/**/*.{jpg,png}',
			{base: 'public/img'})
		.pipe(gulp.dest('public/img_min/src'));
});
gulp.task('copy-ico-dist',function() {
	return gulp.src('public/img/**/*.ico',
			{base: 'public/img'})
		.pipe(gulp.dest('../dist/public/img'));
});
// ==================css===========================	
gulp.task('styles', function() {
	gulp.src('public/sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('public/css'))
		.pipe(browserSync.stream());
});	

gulp.task('styles-dist', function() {
	gulp.src('public/sass/**/*.scss')
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('../dist/public/css'))
		.pipe(browserSync.stream());
});
// ===================img-min=======================
gulp.task('img-min-lossless-jpg',function() {
	return gulp.src('public/img_min/src/**/*.jpg',
				{base: 'public/img_min/src'})
		.pipe(imageminJpegtran({progressive: true})())
		//    .pipe(rename({
	// 	suffix:"_lossless"
	// }))
		.pipe(gulp.dest('public/img_min/build'));
});

gulp.task('img-min-lossless-png',function() {
	gulp.src('public/img_min/src/**/*.png',
		{base: 'public/img_min/src'})
    .pipe(imageminOptipng({optimizationLevel: 3})())
 //    .pipe(rename({
    // 	suffix:"_lossless"
    // }))
    .pipe(gulp.dest('public/img_min/build'));
});

gulp.task('img-min-loss-png',function() {
	return gulp.src('public/img_min/src/**/*.png',
			{base: 'public/img_min/src'})
        .pipe(imageminPngquant({quality: '65-80', speed: 4})())
     //    .pipe(rename({
	// 	suffix:"_loss"
	// }))
        .pipe(gulp.dest('public/img_min/build'));
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
	suffix:'_60'
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
    .pipe(rename({suffix:'_1600_large_2x'}))
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
    .pipe(rename({suffix:'_800_medium_1x'}))
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
	suffix:'_400_small_1x'
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
		proxy: 'http://localhost:3000',
        // files: ['public/**/*.*'],
		files: ['public/js/**/*.*','views/**/*.*'],
        // browser: "google chrome",
		port: 7000
	});
});