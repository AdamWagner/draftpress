
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    order = require('gulp-order'),
    stylus = require('gulp-stylus'),
    refresh = require('gulp-livereload'),
    clean = require('gulp-clean'),
    lr = require('tiny-lr'),
    rev = require('gulp-rev'),
    inject = require('gulp-inject'),
    path = require('path'),
    notify = require('gulp-notify'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    ngmin = require('gulp-ngmin'),
    autoprefixer = require('gulp-autoprefixer'),
    server = lr();


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  *\
   Setup inject options
\* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

function extname(file) {
  return path.extname(file).slice(1);
}

injectOptions = {
    transform: function(filepath, file, index, length){
        switch(extname(filepath)) {
          case 'css':
            return '<link rel="stylesheet" href="{{STATIC_URL}}' + filepath.substring(1) + '">';
          case 'js':
            return '<script src="{{STATIC_URL}}' + filepath.substring(1) + '"></script>';
        }
    },
};

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  *\
   Styles
\* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

gulp.task('inject-css', ['stylus'], function(){
    gulp.src("./css/*.css", {read: false})
        .pipe(inject("../templates/base.html",injectOptions))
        .pipe(gulp.dest('../templates/'))
        .pipe(refresh(server))
        // .pipe(notify({message:'CSS build done.'}));
});

gulp.task('stylus', ['clean-css'], function () {
    return gulp.src('./stylus/main.styl')
        .pipe(stylus())
        .pipe(autoprefixer('last 4 versions'))
        .pipe(rev())
        .pipe(gulp.dest('./css'));
});

gulp.task('clean-css', function() {
  return gulp.src(['./css/*'], {read: false})
    .pipe(clean());
});


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  *\
   Scripts
\* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

gulp.task('build-js', ['clean-js'], function() {
    return gulp.src([
            './js/lib/jquery/dist/jquery.js',
            './js/lib/angular/angular.js',
            './js/lib/angular-cookies/angular-cookies.js',
            './js/lib/lodash/dist/lodash.js',
            './js/lib/fast-click/fast-click.js',

            './js/src/directives/scrollfix.js',

            './js/src/marketing.js',

            ])
        .pipe(concat('marketing.js'))
        .pipe(rev())
        .pipe(gulp.dest('js/build'))
});


gulp.task('inject-js', ['build-js'], function(){
    return gulp.src("./js/build/*.js", {read: false})
        .pipe(inject("../templates/base.html",injectOptions))
        .pipe(gulp.dest('../templates/'))
        .pipe(refresh(server))
        // .pipe(notify({message:'JS build done.'}))
});


gulp.task('clean-js', function() {
  return gulp.src(['./js/build/*'], {read: false})
    .pipe(clean());
});


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  *\
   Compress
\* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

gulp.task('compress', function(){
    gulp.src("./js/build/*.js")
        .pipe(ngmin())
        .pipe(uglify())
        .pipe(gulp.dest('js/build'))
        // .pipe(notify({message:'JS compressed.'}));

    return gulp.src("./css/*.css")
        .pipe(cssmin())
        .pipe(gulp.dest('./css/console'))
        // .pipe(notify({message:'CSS compressed.'}));
});


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  *\
   Live reload
\* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

gulp.task('lr-server', function() {
    server.listen(35729, function(err) {
        if(err) return console.log(err);
    });
});

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  *\
   Task groups
\* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

gulp.task('default', function() {
    gulp.run('lr-server');

    gulp.watch('../**/*.html', function(){
        gulp.src('../**/*.html')
            .pipe(refresh(server))

    });

    gulp.watch('stylus/**/*', function(){
        console.log(' style test');
        gulp.run('inject-css');
    });

   gulp.watch('js/src/**/*', function(){
        gulp.run('inject-js');
    });
});



