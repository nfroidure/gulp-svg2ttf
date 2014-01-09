'use strict';

var gulp = require('gulp')
  , assert = require('assert')
  , es = require('event-stream')
  , fs = require('fs')
  , svg2ttf = require(__dirname + '/../src/index.js')
  , Stream = require('stream')
  , gutil = require('gulp-util')
;

// Erasing date to get an invariant created and modified font date
// See: https://github.com/fontello/svg2ttf/blob/c6de4bd45d50afc6217e150dbc69f1cd3280f8fe/lib/sfnt.js#L19
Date = (function(d) {
  function Date() {
    d.call(this, 3600);
  }
  Date.now = d.now;
  return Date;
})(Date);

describe('gulp-svg2ttf conversion', function() {
  var filename = __dirname + '/fixtures/iconsfont';
  var ttf = fs.readFileSync(filename + '.ttf');

  describe('in buffer mode', function() {
    it('should work', function(done) {

        gulp.src(filename + '.svg')
          .pipe(svg2ttf(), {buffer: true})
          // Uncomment to regenerate the test files if changes in the svg2ttf lib
          // .pipe(gulp.dest(__dirname + '/fixtures/'))
          .pipe(es.through(function(file) {
            assert.equal(file.contents.length, ttf.length);
            assert.equal(file.contents.toString('utf-8'), ttf.toString('utf-8'));
          }, function() {
              done();
          }));

    });

    it('should let non-svg files pass through', function(done) {

        var s = svg2ttf();
        s.pipe(es.through(function(file) {
            assert.equal(file.path,'bibabelula.foo');
            assert.equal(file.contents.toString('utf-8'), 'ohyeah');
          }, function() {
              done();
          }));
        s.write(new gutil.File({
          path: 'bibabelula.foo',
          contents: new Buffer('ohyeah')
        }));
        s.end();

    });
  });


  describe('in stream mode', function() {
    it('should work', function(done) {

        gulp.src(filename + '.svg', {buffer: false})
          .pipe(svg2ttf())
          .pipe(es.through(function(file) {
            // Get the buffer to compare results
            file.contents.pipe(es.wait(function(err, data) {
              assert.equal(data.length, ttf.toString('utf-8').length);
              assert.equal(data, ttf.toString('utf-8'));
            }));
          }, function() {
              done();
          }));

    });

    it('should let non-svg files pass through', function(done) {

        var s = svg2ttf();
        s.pipe(es.through(function(file) {
            assert.equal(file.path,'bibabelula.foo', {buffer: false});
            assert(file.contents instanceof Stream.PassThrough);
          }, function() {
              done();
          }));
        s.write(new gutil.File({
          path: 'bibabelula.foo',
          contents: new Stream.PassThrough()
        }));
        s.end();

    });
  });

});
