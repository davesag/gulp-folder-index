# gulp-folder-index

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

> Convert a buffer of files into a JSON representation of the directory structure using [gulp](https://github.com/gulpjs/gulp), with configurable file extension

## Usage

First, install `gulp-folder-index` as a development dependency:

```shell
npm install --save-dev gulp-folder-index
```

Then, add it to your `gulpfile.js`:

```javascript
let folderIndex = require("gulp-folder-index");

gulp.src('app/**/*.yml')
  .pipe(folderIndex({
    extension: '.json',       // default
    filename: 'index.json',   // default
    prefix: '',               // default
    directory: false          // default
  }))
  .pipe(gulp.dest('dist'));

```

Given this directory structure...
```
app
  | folder-1
    | folder-2
      | something.yml
    | faqs.yml
  | folder-3
    |_folder-4
      | something-else.yml
  | hello-world.yml
```

... this JSON object would be written to `dist/index.json`:

```json
[
  "hello-world.json",
  "folder-1/faqs.json",
  "folder-1/folder2/something.json",
  "folder-3/folder-4/something-else.json"
]
```

This is useful for mapping out a directory structure after passing files through a pre-processor, generating data to create navigation during build, and more. Have fun!

## API

### folder-index(options)

#### options.filename
Type: `String`  
Default: `index.json`

The path to write the directory structure JSON file to.

#### options.prefix
Type: `String`
Default: none

A string to prepend to every url.

Given the directory structure above, specifiying `prefix: 'prefixed-folder'` would generate this JSON:

```json
[
  "prefixed-folder/hello-world.json",
  "prefixed-folder/folder-1/faqs.json",
  "prefixed-folder/folder-1/folder2/something.json",
  "prefixed-folder/folder-3/folder-4/something-else.json"
]
```

#### options.extension
Type: `String`
Default: json

An extension string to replace the original with.

Given the directory structure above, specifiying `extension: 'html'` would generate this JSON:

```json
[
  "hello-world.html",
  "folder-1/faqs.html",
  "folder-1/folder2/something.html",
  "folder-3/folder-4/something-else.html"
]
```

#### options.directory
Type: `Boolean`
Default: false

An extension boolean to generate json with directory and path.

Given the directory structure above, specifiying `directory: true` would generate this JSON:

```json
[
  {
    "directory": "",
    "path": "hello-world.json"
  },
  {
    "directory": "folder-1/",
    "path": "folder-1/faqs.json"
  },
  {
    "directory": "folder-1/folder2/",
    "path": "folder-1/folder2/something.json"
  },
  {
    "directory": "folder-3/folder-4/",
    "path": "folder-3/folder-4/something-else.json"
  }
]
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)


## Thanks

Thanks to [@masondesu](https://github.com/masondesu) for creating the [gulp-directory-map](https://github.com/masondesu/gulp-directory-map) upon which this is based.

[npm-url]: https://npmjs.org/package/gulp-folder-index
[npm-image]: https://badge.fury.io/js/gulp-folder-index.png

[travis-url]: http://travis-ci.org/davesag/gulp-folder-index
[travis-image]: https://secure.travis-ci.org/davesag/gulp-folder-index.png?branch=master
