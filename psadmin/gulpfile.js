'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect'); //Runs a locla dev server
var open = require('gulp-open'); // Open a URL in  a browser
var browserify = require('browserify'); // bundle JS
var reactify = require('reactify'); // Transform React JSx to JS
var source = require('vinyl-source-stream'); // use conventional text stream with gulp
var concat = require('gulp-concat'); // concat the files
var lint = require('gulp-eslint'); //Lint our JS file and JSX file

var config ={
	port: 8082,
	devBaseUrl: 'http://localhost/',
	paths: {
		html: './src/*.html',
		js: './src/**/*.js',
		images: './src/images/*',
		dist: './dist/',
		mainJs: './src/main.js',
		css: [
			'node_modules/bootstrap/dist/css/bootstrap.min.css',
			'node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
			'node_modules/toastr/toastr.css'
		]
	}
}


gulp.task('connect', function () {
	// body...
	connect.server({
		root:['dist'],
		port: config.port,
		base: config.devBaseUrl,
		livereload: true
	});
});

gulp.task('open', ['connect'], function () {
	// body...
	gulp.src('dist/index.html')
		.pipe(open('', { uri : config.devBaseUrl + ':' + config.port + '/' }));
});

gulp.task('html', function () {
	// body...
	gulp.src(config.paths.html)
		.pipe(gulp.dest(config.paths.dist))
		.pipe(connect.reload());
});

gulp.task('js', function () {
	// body...
	browserify(config.paths.mainJs)
		.transform(reactify)
		.bundle()
		.on('error', console.error.bind(console))
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(config.paths.dist + '/scripts'))
		.pipe(connect.reload());
});

gulp.task('css', function () {
	// body...
	gulp.src(config.paths.css)
		.pipe(concat('bundle.css'))
		.pipe(gulp.dest(config.paths.dist + '/css'));

});

gulp.task('images', function () {
	// body...
	gulp.src(config.paths.images)
		.pipe(gulp.dest(config.paths.dist + '/images'))
		.pipe(connect.reload());

	/*gulp.src('./src/favicon.ico')
		.pipe(gulp.dest(config.paths.dist));*/

});

gulp.task('lint', function () {
	// body...
	return gulp.src(config.paths.js)
				.pipe(lint({ config: 'eslint.config.json'}))
				.pipe(lint.format());
});

gulp.task('watch', function () {
	// body...
	gulp.watch(config.paths.html, ['html']);
	gulp.watch(config.paths.js, ['js', 'lint']);
});

gulp.task('default', ['html', 'js', 'css', 'images', 'lint', 'open',  'watch']);
