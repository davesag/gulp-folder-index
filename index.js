'use strict';

let through  = require("through2");
let isEmpty  = require("lodash.isempty");
let path     = require("path");
let gutil    = require("gulp-util");

module.exports = function (config) {

  const PLUGIN_NAME = "gulp-folder-index";
  const ERRORS = {
    nullFile: "File is null",
    noStreams: "No stream support",
    emptyFolder: "No files found for folderIndex"
  };
  const EVENTS = {
    error: 'error',
    end: 'end'
  };

  config = config || {};
  let output = config.filename || "index.json";
  let extension = config.extension || '.json'

  let firstFile;
  let _index = [];

  let folderIndex = function(file, enc, callback) {

    if (!firstFile) firstFile = file;

    if (file.isNull()) {
      this.emit("error", new gutil.PluginError(PLUGIN_NAME, ERRORS.nullFile));
      this.emit("end");
      return callback();
    }

    if (file.isStream()) {
      this.emit("error", new gutil.PluginError(PLUGIN_NAME, ERRORS.noStreams));
      this.emit("end");
      return callback();
    }

    if (file.isBuffer()) {
      let filePath = (config.prefix ? `${config.prefix}/` : "") + file.path.replace(file.base, "");
      filePath = filePath.replace(path.extname(filePath), extension);
      // let segments = path.replace(/\\/g,"/").split("/");
      _index.push(filePath);
    }
    return callback();
  }

  return through.obj(folderIndex,
    function(cb) {
      if (isEmpty(_index)) {
        this.emit("error", new gutil.PluginError(PLUGIN_NAME, ERRORS.emptyFolder));
        this.emit("end");
        return cb();
      }

      //create and push new vinyl file
      this.push(new gutil.File({
        cwd: firstFile.cwd,
        base: firstFile.cwd,
        path: path.join(firstFile.cwd, output),
        contents: new Buffer(JSON.stringify(_index))
      }));

      gutil.log("Generated", gutil.colors.blue(output));
      return cb();
    }
  );
};
