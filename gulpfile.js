/*globals require, console*/
var production = false;

var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var reactify = require('gulp-reactify');
var jsx = require('gulp-jsxtransform');
var rename = require('gulp-rename');
var React = require('react');
var addons = require('react-addons');
var replace = require('gulp-replace');

gulp.task('default', ['build']);
gulp.task('build', ['createCSSBundle']);

gulp.task('clean', function() {
	del(['build']);
});

gulp.task('jsx', function() {
	return gulp.src('./script/**/*.js')
    	.pipe(jsx())
    	.pipe(gulp.dest('./web/script/'));
});

gulp.task('javascript', ['jsx'], function() {

	var bundler = browserify({
		extensions : ['.js'],
		bundleExternal : false,
		entries : ['./web/script/spell/App.js'],
		debug : false
	});

	var bundle = function() {
		return bundler.bundle().pipe(source('bundle.js')).pipe(buffer()).pipe(sourcemaps.init({
			loadMaps : true
		}))
		//.pipe(uglify())
		.pipe(sourcemaps.write('../script'))
		.pipe(gulp.dest('./web/build/'));
	};

	return bundle();
});

gulp.task('generate-react-static', function() {
	var App = require("./web/script/spell/App.js");
	var appInstance = React.createElement(App, {});
	var html = React.renderToString(appInstance);

	gulp.src(['./templates/index.html']).pipe(replace(/\<!--INSERT_HERE--\>/, html)).pipe(gulp.dest('./web/'))

});

gulp.task('createCSSBundle', function() {
	gulp.src('src/css/**/*.css').pipe(minifyCSS({
		keepBreaks : true
	})).pipe(concatCss("bundle.css")).pipe(gulp.dest('build/css'));
});

