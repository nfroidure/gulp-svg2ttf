# gulp-svg2ttf [![NPM version](https://badge.fury.io/js/gulp-svg2ttf.png)](https://npmjs.org/package/gulp-svg2ttf) [![Build status](https://secure.travis-ci.org/nfroidure/gulp-svg2ttf.png)](https://travis-ci.org/nfroidure/gulp-svg2ttf)
> Create a TTF font from an SVG font with [Gulp](http://gulpjs.com/).

## Usage

First, install `gulp-svg2ttf` as a development dependency:

```shell
npm install --save-dev gulp-svg2ttf
```

Then, add it to your `gulpfile.js`:

```javascript
var svg2ttf = require('gulp-svg2ttf');

gulp.task('svg2ttf', function(){
  gulp.src(['fonts/*.svg'])
    .pipe(svg2ttf())
    .pipe(gulp.dest('fonts/'));
});
```

## API

### svg2ttf(options)

#### options.ignoreExt
Type: `Boolean`
Default value: `false`

Set to true to also convert files that doesn't have the .svg extension.

### Contributing / Issues

Please submit SVG to TTF related issues to the
 [svg2ttf project](https://github.com/fontello/svg2ttf)
 on wich gulp-svg2ttf is built.

This repository issues is only for gulp and gulp tasks related issues.

You may want to contribute to this project, pull requests are welcome if you
 accept to publish under the MIT licence.
