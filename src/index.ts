import { extname } from 'node:path';
import Stream from 'node:stream';
import PluginError from 'plugin-error';
import replaceExt from 'replace-ext';
import { BufferStream } from 'bufferstreams';
import svg2ttf from 'svg2ttf';

const PLUGIN_NAME = 'gulp-svg2ttf';

export type GulpSVG2TTFOptions = {
  ignoreExt?: boolean;
  clone?: boolean;
  timestamp?: number;
  copyright?: string;
  version?: string;
};

// File level transform function
function svg2ttfTransform(options: GulpSVG2TTFOptions) {
  // Return a callback function handling the buffered content
  return function svg2ttfTransformCb(
    err: Error | null,
    buf: Buffer,
    cb: (err: Error | null, buf?: Buffer) => void,
  ) {
    // Handle any error
    if (err) {
      cb(new PluginError(PLUGIN_NAME, err, { showStack: true }));
      return;
    }

    // Use the buffered content
    try {
      buf = Buffer.from(
        svg2ttf(String(buf), {
          ts: options.timestamp,
          copyright: options.copyright,
          version: options.version,
        }).buffer,
      );
    } catch (err2) {
      cb(new PluginError(PLUGIN_NAME, err2 as Error, { showStack: true }));
      return;
    }
    cb(null, buf);
  };
}

// Plugin function
function svg2ttfGulp(options: GulpSVG2TTFOptions) {
  const stream = new Stream.Transform({ objectMode: true });

  options = options || {};
  options.ignoreExt = options.ignoreExt || false;
  options.clone = options.clone || false;
  options.timestamp =
    'number' === typeof options.timestamp ? options.timestamp : undefined;
  options.copyright =
    'string' === typeof options.copyright ? options.copyright : undefined;

  stream._transform = function svg2ttfTransformStream(file, _, done) {
    let cntStream;
    let newFile;

    // When null just pass through
    if (file.isNull()) {
      stream.push(file);
      done();
      return;
    }

    // If the ext doesn't match, pass it through
    if (!options.ignoreExt && '.svg' !== extname(file.path)) {
      stream.push(file);
      done();
      return;
    }

    // Fix for the vinyl clone method...
    // https://github.com/wearefractal/vinyl/pull/9
    if (options.clone) {
      if (file.isBuffer()) {
        stream.push(file.clone());
      } else {
        cntStream = file.contents;
        file.contents = null;
        newFile = file.clone();
        file.contents = cntStream.pipe(new Stream.PassThrough());
        newFile.contents = file.contents.pipe(new Stream.PassThrough());
        stream.push(newFile);
      }
    }

    file.path = replaceExt(file.path, '.ttf');

    // Buffers
    if (file.isBuffer()) {
      try {
        file.contents = Buffer.from(
          svg2ttf(String(file.contents), {
            ts: options.timestamp,
            copyright: options.copyright,
            version: options.version,
          }).buffer,
        );
      } catch (err) {
        stream.emit(
          'error',
          new PluginError(PLUGIN_NAME, err as Error, { showStack: true }),
        );
      }

      // Streams
    } else {
      file.contents = file.contents.pipe(
        new BufferStream(svg2ttfTransform(options)),
      );
    }

    stream.push(file);
    done();
  };

  return stream;
}

// Export the file level transform function for other plugins usage
svg2ttfGulp.fileTransform = svg2ttfTransform;

// Export the plugin main function
export default svg2ttfGulp;
