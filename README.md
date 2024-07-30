[//]: # ( )
[//]: # (This file is automatically generated by a `metapak`)
[//]: # (module. Do not change it  except between the)
[//]: # (`content:start/end` flags, your changes would)
[//]: # (be overridden.)
[//]: # ( )
# gulp-svg2ttf
> Create a TTF font from an SVG font

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/nfroidure/gulp-svg2ttf/blob/main/LICENSE)


[//]: # (::contents:start)

## Usage

First, install `gulp-svg2ttf` as a development dependency:

```shell
npm install --save-dev gulp-svg2ttf
```

Then, add it to your `gulpfile.js`:

```js
import svg2ttf from 'gulp-svg2ttf';

gulp.task('svg2ttf', () => {
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

#### options.clone
Type: `Boolean`
Default value: `false`

Set to true to clone the file before converting him so that it will output the
 original file too.

#### options.timestamp
Type: `Number`
Default value: `Math.round(Date.now()/1000)`

Override the TTF font creation/modification date.

#### options.copyright
Type: `String`
Default value: Fontello ad or SVG Font copyright metadata.

Allows to set to your copyright informations.

#### options.version
Type: `String`
Default value: `undefined` (results in version `1.0`)

Allows to set the version number of the font. Needs to be in the format `Version <NUM>.<NUM>` (the `Version` prefix is optional).

### Note

You may look after a full Gulp web font workflow, see
 [gulp-iconfont](https://github.com/nfroidure/gulp-iconfont)
  fot that matter.

### Contributing / Issues

Please submit SVG to TTF related issues to the
 [svg2ttf project](https://github.com/fontello/svg2ttf)
 on wich gulp-svg2ttf is built.

This repository issues is only for gulp and gulp tasks related issues.

You may want to contribute to this project, pull requests are welcome if you
 accept to publish under the MIT licence.


[//]: # (::contents:end)

# Authors


# License
[MIT](https://github.com/nfroidure/gulp-svg2ttf/blob/main/LICENSE)
