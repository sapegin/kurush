var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var stylus = require('gulp-stylus');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var webpack = require('webpack');
var notifier = require('node-notifier');
var browserSync = require('browser-sync');
var stylobuild = require('stylobuild');

var isDevelopment = process.env.NODE_ENV !== 'production';
var isWatch = false;

function reload() {
	if (isDevelopment && isWatch) {
		return browserSync.reload.apply(browserSync, arguments);
	}
	else {
		return gutil.noop();
	}
}

function notifyError(plugin, message, filepath, filename) {
	console.log(gutil.colors.red.bold('\nError in ' + (filename || filepath) + '\n'));
	console.log(message);
	var isWarning = /problems? \(0 errors,/.test(message);  // Do not show notifications for eslint warnings
	if (isWatch && !isWarning) {
		notifier.notify({
			title: '\uD83D\uDEA8 ' + plugin + ' error',
			message: gutil.colors.stripColor(message).replace(/ +/g, ' '),
			open: 'file://' + filepath
		});
	}
	if (!isWatch) {
		process.exit(1);
	}
}

gulp.task('webpack', function() {
	webpack(require('./webpack.config.js'), function(err, stats) {
		var error, message;
		if (stats.hasErrors()) {
			error = stats.compilation.errors[0];
			message = error.error;
		}
		else if (stats.hasWarnings()) {
			error = stats.compilation.warnings[0];
			message = error.warning;
		}
		if (error) {
			notifyError('Webpack', message.toString(), error.module.resource, error.module.rawRequest);
		}
		reload();
	});
});

gulp.task('styles', function() {
	return gulp.src('styles/index.styl')
		.pipe(plumber({errorHandler: function(error) {
			notifyError('Stylus', error.message.replace(/.*\n/, ''), error.filename);
			this.emit('end');
		}}))
		.pipe(stylus({
			url: {
				name: 'embedurl'
			},
			define: {
				DEBUG: isDevelopment
			},
			paths: [
				'tamia'
			],
			use: [
				stylobuild({
					autoprefixer: {
						browsers: 'last 2 versions, ie 9'
					},
					minifier: isDevelopment ? false : 'cleancss',
					pixrem: false
				})
			]
		}))
	.pipe(gulp.dest('build/'))
	.pipe(reload({stream: true}));
});

gulp.task('watch',  ['webpack', 'styles'], function() {
	isWatch = true;
	if (isDevelopment) {
		browserSync({
			notify: false,
			online: false,
			server: '.'
		});
	}
	watch('app/**/*.js', batch(function() {
		gulp.start('webpack');
	}));
	watch('styles/**/*.styl', batch(function() {
		gulp.start('styles');
	}));
});

gulp.task('default', ['webpack', 'styles']);
