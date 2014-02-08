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

  describe('with null contents', function() {

    it('should let null files pass through', function(done) {

        var s = svg2ttf()
          , n = 0;
        s.pipe(es.through(function(file) {
            assert.equal(file.path,'bibabelula.foo');
            assert.equal(file.contents, null);
            n++;
          }, function() {
            assert.equal(n,1);
            done();
          }));
        s.write(new gutil.File({
          path: 'bibabelula.foo',
          contents: null
        }));
        s.end();

    });

  });

  describe('in buffer mode', function() {
    it('should work', function(done) {

        var n = 0;
        gulp.src(filename + '.svg', {buffer: true})
          .pipe(svg2ttf())
          // Uncomment to regenerate the test files if changes in the svg2ttf lib
          // .pipe(gulp.dest(__dirname + '/fixtures/'))
          .pipe(es.through(function(file) {
            assert.equal(file.path, filename + '.ttf');
            assert.equal(file.contents.length, ttf.length);
            assert.equal(file.contents.toString('utf-8'), ttf.toString('utf-8'));
            n++;
          }, function() {
            assert.equal(n,1);
            done();
          }));

    });

    it('should work with the clone option', function(done) {

        var n = 0;
        gulp.src(filename + '.svg', {buffer: true})
          .pipe(svg2ttf({clone: true}))
          .pipe(es.through(function(file) {
            if(file.path === filename + '.ttf') {
              assert.equal(file.contents.length, ttf.length);
              assert.equal(file.contents.toString('utf-8'), ttf.toString('utf-8'));
            } else {
              assert.equal(file.path, filename + '.svg');
              assert.equal(file.contents.toString('utf-8'),
                fs.readFileSync(filename + '.svg','utf-8'));
            }
            n++;
          }, function() {
            assert.equal(n,2);
            done();
          }));

    });

    it('should let non-svg files pass through', function(done) {

        var s = svg2ttf()
          , n = 0;
        s.pipe(es.through(function(file) {
            assert.equal(file.path,'bibabelula.foo');
            assert.equal(file.contents.toString('utf-8'), 'ohyeah');
            n++;
          }, function() {
            assert.equal(n,1);
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

        var n = 0;
        gulp.src(filename + '.svg', {buffer: false})
          .pipe(svg2ttf())
          .pipe(es.through(function(file) {
            assert.equal(file.path, filename + '.ttf');
            // Get the buffer to compare results
            file.contents.pipe(es.wait(function(err, data) {
              assert.equal(data.length, ttf.toString('utf-8').length);
              assert.equal(data, ttf.toString('utf-8'));
            }));
            n++;
          }, function() {
            assert.equal(n,1);
            done();
          }));

    });

    it('should work with the clone option', function(done) {

        var n = 0;
        gulp.src(filename + '.svg', {buffer: false})
          .pipe(svg2ttf({clone: true}))
          .pipe(es.through(function(file) {
            if(file.path === filename + '.ttf') {
              file.contents.pipe(es.wait(function(err, data) {
                assert.equal(data.length, ttf.toString('utf-8').length);
                assert.equal(data, ttf.toString('utf-8'));
              }));
            } else {
              assert.equal(file.path, filename + '.svg');
              file.contents.pipe(es.wait(function(err, data) {
                assert.equal(data, fs.readFileSync(filename + '.svg','utf-8'));
              }));
            }
            n++;
          }, function() {
            assert.equal(n,2);
            done();
          }));

    });

    it('should let non-svg files pass through', function(done) {

        var s = svg2ttf()
          , n = 0;
        s.pipe(es.through(function(file) {
            assert.equal(file.path,'bibabelula.foo');
            assert(file.contents instanceof Stream.PassThrough);
            n++;
          }, function() {
            assert.equal(n,1);
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
