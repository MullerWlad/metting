const gulp = require('gulp');
const sass = require('gulp-sass')(require('node-sass'));
const rename = require('gulp-rename');
const pug = require('gulp-pug');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

//Converter files from sass directory to css, it minimisates css code in .min file
function cssConvert(done){
    gulp.src('./src/sass/*.sass')
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: 'compressed'
        }))
        .on('error', console.error.bind(console))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./src/css'));
    done();
}

//Pug converter
function pugConvert(done){
    gulp.src('./*.pug')
        .pipe(pug({
            doctype: 'html',
            pretty: false
        }))
        .on('error', console.error.bind(console))
        .pipe(gulp.dest('./'));
    done();
}

//To sync pug file
gulp.task('sass', () => {
    return gulp.src('./src/sass/*.sass')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./src/css/'))
})
gulp.task('component', () => {
    return gulp.src('./src/pug/components/*.pug')
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest('./src/pug/components/*.pug'))
})
gulp.task('index', () => {
    return gulp.src('./index.pug')
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest('./'))
})
function syncPug(done){
    browserSync.init({
        server: {
            baseDir: './'
        },
        port: 3000,
        open: true
    })
    gulp.watch('./src/sass/*.sass', gulp.series('sass'))
        .on('change', browserSync.reload);
    gulp.watch('./src/pug/components/*.pug', gulp.series('component'))
        .on('change', browserSync.reload);
    gulp.watch('./index.pug', gulp.series('index'))
        .on('change', browserSync.reload);
    done();
}

gulp.task('css', cssConvert);
gulp.task('html', pugConvert);
gulp.task('sync', syncPug);