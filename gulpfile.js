/*globals require, console*/
var production = false;

var gulp = require('gulp');
var gutil = require('gulp-util');

gulp.task('default', ['build']);
gulp.task('build', ['createCSSBundle']);

gulp.task('clean', function () {
	del(['build']);
});

gulp.task('createCSSBundle', function () {
  gulp.src('src/css/**/*.css')
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(concatCss("bundle.css"))
    .pipe(gulp.dest('build/css'));
});




	


