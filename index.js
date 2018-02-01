'use strict';

const through = require("through2");
const isEmpty = require("lodash.isempty");
const path = require("path");
const PluginError = require('plugin-error')
const Vinyl = require('vinyl')
const colours = require('ansi-colors')
const log = require('fancy-log')

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
      this.emit("error", new PluginError(PLUGIN_NAME, ERRORS.nullFile));
      this.emit("end");
      return callback();
    }

    if (file.isStream()) {
      this.emit("error", new PluginError(PLUGIN_NAME, ERRORS.noStreams));
      this.emit("end");
      return callback();
    }

    if (file.isBuffer()) {
      let filePath = (config.prefix ? `${config.prefix}/` : "") + file.path.replace(file.base, "");
      filePath = filePath.replace(path.extname(filePath), extension);
      if (config.directory) {
        let directory = filePath.replace(/(?!.*\/).*/g, "");
        let directoryAndFilePath = {
          "directory": directory,
          "path": filePath
        }
        filePath = directoryAndFilePath;
      }
      _index.push(filePath);
    }
    return callback();
  }

  return through.obj(folderIndex,
    function(cb) {
      if (isEmpty(_index)) {
        this.emit("error", new PluginError(PLUGIN_NAME, ERRORS.emptyFolder));
        this.emit("end");
        return cb();
      }

      //create and push new vinyl file
      this.push(new Vinyl({
        cwd: firstFile.cwd,
        base: firstFile.cwd,
        path: path.join(firstFile.cwd, output),
        contents: new Buffer(JSON.stringify(_index))
      }));

      log("Generated", colours.blue(output));
      return cb();
    }
  );
};
