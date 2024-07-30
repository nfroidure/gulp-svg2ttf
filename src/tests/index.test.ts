import { describe, test, expect } from '@jest/globals';
import gulp from 'gulp';
import Vinyl from 'vinyl';
import { Readable, PassThrough } from 'node:stream';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import StreamTest from 'streamtest';
import svg2ttf from '../index.js';

const filename = join('src', 'tests', 'fixtures', 'iconsfont');
const ttf = await readFile(filename + '.ttf');

describe('gulp-svg2ttf conversion', () => {
  const generationTimestamp = 3;

  // Iterating through versions
  describe('with null contents', () => {
    test('should let null files pass through', async () => {
      const [stream, result] = StreamTest.toObjects<Vinyl>();

      StreamTest.fromObjects([
        new Vinyl({
          path: 'bibabelula.foo',
          contents: null,
        }),
      ])
        .pipe(
          svg2ttf({
            timestamp: generationTimestamp,
          }),
        )
        .pipe(stream);

      const objs = await result;

      expect(objs.length).toEqual(1);
      expect(objs[0].path).toContain('bibabelula.foo');
      expect(objs[0].contents).toEqual(null);
    });
  });

  describe('in buffer mode', () => {
    const [stream, result] = StreamTest.toObjects<Vinyl>();

    test('should work', async () => {
      gulp
        .src(filename + '.svg', { buffer: true })
        .pipe(
          svg2ttf({
            timestamp: generationTimestamp,
          }),
        )
        .pipe(stream);

      const objs = await result;

      expect(objs.length).toEqual(1);
      expect(objs[0].path).toContain(filename + '.ttf');
      expect((objs[0].contents as Buffer).toString('utf-8')).toEqual(
        ttf.toString('utf-8'),
      );
    });

    test('should work with the copyright option', async () => {
      const [stream, result] = StreamTest.toObjects<Vinyl>();

      gulp
        .src(filename + '.svg', { buffer: true })
        .pipe(
          svg2ttf({
            timestamp: generationTimestamp,
            copyright: 'Brothershood of mens 2015 - Infinity',
          }),
        )
        .pipe(stream);

      const objs = await result;
      const ttfCopyrighted = await readFile(filename + '-copyright.ttf');

      expect(objs.length).toEqual(1);
      expect(objs[0].path).toContain(filename + '.ttf');
      expect(objs[0].contents).toEqual(ttfCopyrighted);
    });

    test('should work with the version option', async () => {
      const [stream, result] = StreamTest.toObjects<Vinyl>();

      gulp
        .src(filename + '.svg', { buffer: true })
        .pipe(
          svg2ttf({
            timestamp: generationTimestamp,
            version: '2.0',
          }),
        )
        .pipe(stream);

      const objs = await result;
      const ttfVersioned = await readFile(filename + '-versioned.ttf');

      expect(objs.length).toEqual(1);
      expect(objs[0].path).toContain(filename + '.ttf');
      expect(objs[0].contents).toEqual(ttfVersioned);
    });

    test('should work with the clone option', async () => {
      const [stream, result] = StreamTest.toObjects<Vinyl>();

      gulp
        .src(filename + '.svg', { buffer: true })
        .pipe(
          svg2ttf({
            clone: true,
            timestamp: generationTimestamp,
          }),
        )
        .pipe(stream);

      const objs = await result;

      expect(objs.length).toEqual(2);
      expect(objs[0].path).toContain(filename + '.svg');
      expect((objs[0].contents as Buffer).toString('utf-8')).toEqual(
        await readFile(filename + '.svg', 'utf-8'),
      );
      expect(objs[1].path).toContain(filename + '.ttf');
      expect((objs[1].contents as Buffer).toString('utf-8')).toEqual(
        ttf.toString('utf-8'),
      );
    });

    test('should let non-svg files pass through', async () => {
      const [stream, result] = StreamTest.toObjects<Vinyl>();

      StreamTest.fromObjects([
        new Vinyl({
          path: 'bibabelula.foo',
          contents: Buffer.from('ohyeah'),
        }),
      ])
        .pipe(
          svg2ttf({
            timestamp: generationTimestamp,
          }),
        )
        .pipe(stream);

      const objs = await result;

      expect(objs.length).toEqual(1);
      expect(objs[0].path).toContain('bibabelula.foo');
      expect((objs[0].contents as Buffer).toString('utf-8')).toEqual('ohyeah');
    });
  });

  describe('in stream mode', () => {
    test('should work', async () => {
      const [stream, result] = StreamTest.toObjects<Vinyl>();
      const [contentStream, contentResult] = StreamTest.toChunks();

      gulp
        .src(filename + '.svg', { buffer: false })
        .pipe(
          svg2ttf({
            timestamp: generationTimestamp,
          }),
        )
        .pipe(stream);

      const objs = await result;

      expect(objs.length).toEqual(1);
      expect(objs[0].path).toContain(filename + '.ttf');

      (objs[0].contents as Readable).pipe(contentStream);

      expect(Buffer.concat(await contentResult)).toEqual(ttf);
    });

    test('should work with the clone option', async () => {
      const [stream, result] = StreamTest.toObjects<Vinyl>();
      const [contentStream1, contentResult1] = StreamTest.toChunks();
      const [contentStream2, contentResult2] = StreamTest.toChunks();

      gulp
        .src(filename + '.svg', { buffer: false })
        .pipe(
          svg2ttf({
            clone: true,
            timestamp: generationTimestamp,
          }),
        )
        .pipe(stream);

      const objs = await result;

      expect(objs.length).toEqual(2);
      expect(objs[0].path).toContain(filename + '.svg');
      expect(objs[1].path).toContain(filename + '.ttf');

      (objs[0].contents as Readable).pipe(contentStream1);
      expect(Buffer.concat(await contentResult1).toString('utf-8')).toEqual(
        await readFile(filename + '.svg', 'utf-8'),
      );

      (objs[1].contents as Readable).pipe(contentStream2);

      expect(Buffer.concat(await contentResult2)).toEqual(ttf);
    });

    test('should work with the version option', async () => {
      const [stream, result] = StreamTest.toObjects<Vinyl>();
      const [contentStream, contentResult] = StreamTest.toChunks();

      gulp
        .src(filename + '.svg', { buffer: false })
        .pipe(
          svg2ttf({
            timestamp: generationTimestamp,
            version: '2.0',
          }),
        )
        .pipe(stream);

      const objs = await result;
      const ttfVersioned = await readFile(filename + '-versioned.ttf');

      expect(objs.length).toEqual(1);
      expect(objs[0].path).toContain(filename + '.ttf');
      (objs[0].contents as Readable).pipe(contentStream);

      expect(Buffer.concat(await contentResult)).toEqual(ttfVersioned);
    });

    test('should let non-svg files pass through', async () => {
      const [stream, result] = StreamTest.toObjects<Vinyl>();

      StreamTest.fromObjects([
        new Vinyl({
          path: 'bibabelula.foo',
          contents: new PassThrough(),
        }),
      ])
        .pipe(
          svg2ttf({
            timestamp: generationTimestamp,
          }),
        )
        .pipe(stream);

      const objs = await result;

      expect(objs.length).toEqual(1);
      expect(objs[0].path).toContain('bibabelula.foo');
      expect(objs[0].contents instanceof Readable).toBeTruthy();
    });
  });
});
