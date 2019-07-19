var syntax        = 'sass', // Syntax: sass or scss;
		gulpversion   = '4'; // Gulp version: 3 or 4


var gulp          = require('gulp'),
		gutil         = require('gulp-util' ),
		sass          = require('gulp-sass'),
		browserSync   = require('browser-sync'),
		concat        = require('gulp-concat'),
		uglify        = require('gulp-uglify-es').default,
		cleancss      = require('gulp-clean-css'),
		rename        = require('gulp-rename'),
		autoprefixer  = require('gulp-autoprefixer'),
		notify        = require('gulp-notify'),
		rsync         = require('gulp-rsync'),
		del           = require('del'),
		smartgrid     = require('smart-grid'),
	htmlmin = require('gulp-htmlmin'),
	newer = require('gulp-newer'),
	responsive   = require('gulp-responsive'),
		htmlclean     = require('gulp-htmlclean'),
		sourcemaps    = require('gulp-sourcemaps'),

/* It's principal settings in smart grid project */
		settings      = {
    outputStyle: 'sass', /* less || scss || sass || styl */
    columns: 12, /* number of grid columns */
    offset: '30px', /* gutter width px || % || rem */
    mobileFirst: false, /* mobileFirst ? 'min-width' : 'max-width' */
    container: {
        maxWidth: '1200px', /* max-width оn very large screen */
        fields: '30px' /* side fields */
    },
    breakPoints: {
        lg: {
            width: '1100px', /* -> @media (max-width: 1100px) */
        },
        md: {
            width: '960px'
        },
        sm: {
            width: '780px',
            fields: '15px' /* set fields only if you want to change container.fields */
        },
        xs: {
            width: '560px'
        }
        /*
        We can create any quantity of break points.

        some_name: {
            width: 'Npx',
            fields: 'N(px|%|rem)',
            offset: 'N(px|%|rem)'
        }
        */
    }
};

// *******************************************************************************************
gulp.task('smartgrid', function() {
	smartgrid('app/libs/smartgrid', settings)
});

// *******************************************************************************************
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		open: false, //открытие браузера при запуске
		// online: false, // Work Offline Without Internet Connection
		 //tunnel: true, tunnel: "medinfo", // Demonstration page: http://medinfo.localtunnel.me
	})
});
function bsReload(done) { browserSync.reload(); done(); };

// *********************************************************************************************
gulp.task('assemblyhtml', function() {
  return gulp.src(['app/part_html/head/*.html', 'app/part_html/*.html', 'app/part_html/end/*.html'])
    .pipe(concat('index.html'))
    .pipe(gulp.dest('app/manuscript_html/'));
});

// *******************************************************************************************
gulp.task('styles', function() {
	return gulp.src('app/'+syntax+'/**/*.'+syntax+'')
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
		.pipe(rename({ suffix: '.min', prefix: '' }))
		/*.pipe(sourcemaps.init())*/
		.pipe(autoprefixer({ /*grid: true,  */overrideBrowserslist: ['>0.1%', 'ie >= 10','last 5 versions'],grid: "autoplace", cascade: false }))  //было last 15 versions
	.pipe(cleancss( { level: 2 } ))/*{ 1: { specialComments: 0 }, 2: { all: true, mergeSemantically: false, removeUnusedAtRules: false, restructureRules: false } } }), ({ compatibility: 'ie10' }))*/ // был левел 1
	/*.pipe(sourcemaps.write('.'))*/
		.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream())
});

// *******************************************************************************************
gulp.task('scripts', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js', 'app/libs/wow/wow.min.js',
		'app/js/common.js', // Always at the end
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify({ toplevel: true })) // Minify js (opt.), //  {toplevel: true} этого не было
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({ stream: true }))
});

// *******************************************************************************************
// Responsive Images
gulp.task('img-responsive', async function() {
	return gulp.src('app/img/_service/**/*.{png,jpg,jpeg,webp,raw}')
		.pipe(newer('app/img/@1x'))
		.pipe(responsive({
			'*': [{
				// Produce @2x images
				width: '100%', quality: 90, rename: { prefix: '@2x/', },
			}, {
				// Produce @1x images
				width: '50%', quality: 90, rename: { prefix: '@1x/', }
			}]
		})).on('error', function () { console.log('No matching images found') })
		.pipe(rename(function (path) {path.extname = path.extname.replace('jpeg', 'jpg')}))
		.pipe(gulp.dest('app/img'))
});
gulp.task('img', gulp.series('img-responsive', bsReload));

// *******************************************************************************************
// Clean @*x IMG's
gulp.task('cleanimg', function() {
	return del(['app/img/@*'], { force: true })
});

// *******************************************************************************************
gulp.task('code', function() {
	return gulp.src('app/*.html')
	.pipe(browserSync.reload({ stream: true }))
});


// *******************************************************************************************
gulp.task('rsync', function() {
	return gulp.src('app/**')
	.pipe(rsync({
		root: 'app/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		// include: ['*.htaccess'], // Includes files to deploy
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
});


// *******************************************************************************************
// 2 разных варианта минификации ХТМЛ

// gulp.task('minifyhtml', () => {
//   return gulp.src('app/*.html')
//     .pipe(htmlmin({ collapseWhitespace: true }))
//     .pipe(gulp.dest('app/css'));
// });

gulp.task('cleanhtml', function() {
  return gulp.src('app/manuscript_html/*.html')
    .pipe(htmlclean({
        protect: /<\!--%fooTemplate\b.*?%-->/g,
        edit: function(html) { return html.replace(/\begg(s?)\b/ig, 'omelet$1'); }
      }))
    .pipe(gulp.dest('app/'));
});

// *******************************************************************************************

//удаляем перед новой сборкой предыдущую сборку
gulp.task('clean', function () {
	return del(['app/css/*', 'app/js/scripts.min.js', 'app/libs/smartgrid/*', 'app/index.html', 'app/manuscript_html/*.html'])
});

// *******************************************************************************************
// if (gulpversion == 3) {
// 	gulp.task('watch', ['styles', 'scripts', 'browser-sync'], function() {
// 		gulp.watch('app/'+syntax+'/**/*.'+syntax+'', ['styles']);
// 		gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['scripts']);
// 		gulp.watch('app/*.html', ['code'])
// 	});
// 	gulp.task('default', ['watch']);
// }
// *******************************************************************************************
if (gulpversion == 4) {
	gulp.task('watch', function() {
		gulp.watch('app/'+syntax+'/**/*.'+syntax+'', gulp.parallel('styles'));
		gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('scripts'));
		gulp.watch('app/part_html/**/*.html', gulp.series('assemblyhtml', 'cleanhtml', 'code'));
		gulp.watch(('app/sass/partsass/*.css', 'app/libs/animate/*.scss'), gulp.series('styles'));
		// gulp.watch('app/libs/hovereffect/*.css', gulp.series('styles'))
		//gulp.watch(('app/libs/animate/*.scss'), gulp.series('styles'));
		// gulp.watch('app/manuscript_html/*.html', gulp.series('cleanhtml', 'code'));
		gulp.watch('app/img/_src/**/*', gulp.parallel('img'));
	});
	gulp.task('default', gulp.series('clean', 'assemblyhtml', 'cleanhtml', gulp.parallel('img', 'watch', /*'smartgrid', */'styles', 'scripts', 'browser-sync')));
}
