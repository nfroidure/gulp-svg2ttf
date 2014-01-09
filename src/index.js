var Stream = require('stream')
  , gutil = require('gulp-util')
  , BufferStreams = require('bufferstreams')
  , svg2ttf = require('svg2ttf')
  , path = require('path')
;

const PLUGIN_NAME = 'gulp-svg2ttf';

// File level transform function
function svg2ttfTransform(opt) {
  // Return a callback function handling the buffered content
  return function(err, buf, cb) {

    // Handle any error
    if(err) {
      cb(new gutil.PluginError(PLUGIN_NAME, err, {showStack: true}));
    }

    // Use the buffered content
      try {
        buf = new Buffer(svg2ttf(String(buf)).buffer);
        cb(null, buf);
      } catch(err) {
        cb(new gutil.PluginError(PLUGIN_NAME, err, {showStack: true}));
      }

  };
}

// Plugin function
function svg2ttfGulp(options) {

  options = options || {};
  options.ignoreExt = options.ignoreExt || false;

  var stream = Stream.PassThrough({objectMode: true});
  
  stream.on('data', function(file) {
    if(file.isNull()) return; // Do nothing
    if((!options.ignoreExt) && '.svg' !== path.extname(file.path)) return;

    file.path = gutil.replaceExtension(file.path, ".ttf");

    // Buffers
    if(file.isBuffer()) {
      try {
        file.contents = new Buffer(svg2ttf(String(file.contents)).buffer);
      } catch(err) {
        stream.emit('error', 
          new gutil.PluginError(PLUGIN_NAME, err, {showStack: true}));
      }

    // Streams
    } else {
      file.contents = file.contents.pipe(new BufferStreams(svg2ttfTransform()));
    }
  });
  
  return stream;

};

// Export the file level transform function for other plugins usage
svg2ttfGulp.fileTransform = svg2ttfTransform;

// Export the plugin main function
module.exports = svg2ttfGulp;

